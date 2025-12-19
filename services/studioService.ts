import { supabase } from '../lib/supabaseClient';
import type { Project, Review, SubmitProjectData, SubmitReviewData, AIAuditResult } from '../types/studio';
import { performCompleteAudit } from './auditService';
import { deleteProjectImage } from './imageUploadService';

// ============================================
// PROJECTS SERVICE
// ============================================

export async function submitProject(data: SubmitProjectData): Promise<Project | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User must be authenticated');

  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      url: data.url,
      name: data.name,
      description: data.description,
      category: data.category,
      logo_url: data.logo_url || null,
      screenshot_url: data.screenshot_url || null,
      links: data.links ? JSON.stringify(data.links) : '[]',
      status: 'pending', // Will be auto-approved for now, can add moderation later
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting project:', error);
    throw error;
  }

  // Auto-approve for now (can add moderation later)
  const { data: approvedProject } = await supabase
    .from('projects')
    .update({ status: 'published' })
    .eq('id', project.id)
    .select()
    .single();

  return approvedProject;
}

export type RankingPeriod = 'all-time' | 'weekly' | 'daily';

export async function getProjects(limit: number = 20, offset: number = 0, period: RankingPeriod = 'all-time'): Promise<Project[]> {
  const { data: { user } } = await supabase.auth.getUser();

  // Use RPC function for period-based ranking
  const { data: rankedData, error: rpcError } = await supabase.rpc('get_projects_ranked', {
    p_period: period,
    p_limit: limit,
    p_offset: offset,
  });

  if (rpcError) {
    console.error('Error fetching ranked projects:', rpcError);
    // Fallback to direct query
    return getProjectsFallback(limit, offset);
  }

  if (!rankedData || rankedData.length === 0) {
    return [];
  }

  // Get user info for each project
  const projectIds = rankedData.map((p: any) => p.id);
  const { data: profilesData } = await supabase
    .from('profiles')
    .select('id, email, username')
    .in('id', [...new Set(rankedData.map((p: any) => p.user_id))]);

  const profilesMap = new Map(profilesData?.map((p: any) => [p.id, p]) || []);

  // Check if user has voted on each project
  const projectsWithVotes = await Promise.all(
    rankedData.map(async (project: any) => {
      if (!user) {
        return { ...project, user_voted: false, user_owns: false };
      }

      const { data: vote } = await supabase
        .from('votes')
        .select('id')
        .eq('project_id', project.id)
        .eq('user_id', user.id)
        .single();

      const profile = profilesMap.get(project.user_id);
      const isBoosted = project.boosted_until 
        ? new Date(project.boosted_until) > new Date()
        : false;

      // Parse links if it's a string
      let links = project.links;
      if (typeof links === 'string') {
        try {
          links = JSON.parse(links);
        } catch {
          links = [];
        }
      }

      return {
        ...project,
        links: links || [],
        user_voted: !!vote,
        user_owns: project.user_id === user.id,
        user_email: profile?.email,
        user_username: profile?.username,
        is_boosted: isBoosted,
        recent_votes_count: project.recent_votes_count || project.votes_count,
      };
    })
  );

  return projectsWithVotes as Project[];
}

async function getProjectsFallback(limit: number = 20, offset: number = 0): Promise<Project[]> {
  const { data: { user } } = await supabase.auth.getUser();

  let query = supabase
    .from('projects')
    .select(`
      *,
      profiles!projects_user_id_fkey(email, username)
    `)
    .eq('status', 'published')
    // Boosted projects first, then by votes
    .order('boosted_until', { ascending: false, nullsFirst: false })
    .order('votes_count', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }

  // Check if user has voted on each project
  const projectsWithVotes = await Promise.all(
    (data || []).map(async (project) => {
      if (!user) {
        return { ...project, user_voted: false, user_owns: false };
      }

      const { data: vote } = await supabase
        .from('votes')
        .select('id')
        .eq('project_id', project.id)
        .eq('user_id', user.id)
        .single();

      // Check if project is boosted
      const isBoosted = project.boosted_until 
        ? new Date(project.boosted_until) > new Date()
        : false;

      // Parse links if it's a string
      let links = project.links;
      if (typeof links === 'string') {
        try {
          links = JSON.parse(links);
        } catch {
          links = [];
        }
      }

      return {
        ...project,
        links: links || [],
        user_voted: !!vote,
        user_owns: project.user_id === user.id,
        user_email: project.profiles?.email,
        user_username: project.profiles?.username,
        is_boosted: isBoosted,
      };
    })
  );

  return projectsWithVotes as Project[];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      profiles!projects_user_id_fkey(email, username)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    console.error('Error fetching project by slug:', error);
    return null;
  }

  // Check if user has voted
  let userVoted = false;
  let userOwns = false;
  let isBoosted = false;
  if (user) {
    const { data: vote } = await supabase
      .from('votes')
      .select('id')
      .eq('project_id', data.id)
      .eq('user_id', user.id)
      .single();

    userVoted = !!vote;
    userOwns = data.user_id === user.id;
  }

  // Check if project is boosted
  if (data.boosted_until) {
    isBoosted = new Date(data.boosted_until) > new Date();
  }

  // Parse links if it's a string
  let links = data.links;
  if (typeof links === 'string') {
    try {
      links = JSON.parse(links);
    } catch {
      links = [];
    }
  }

  return {
    ...data,
    links: links || [],
    user_voted: userVoted,
    user_owns: userOwns,
    user_email: data.profiles?.email,
    user_username: data.profiles?.username,
    is_boosted: isBoosted,
  } as Project;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      profiles!projects_user_id_fkey(email, username)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }

  // Check if user has voted
  let userVoted = false;
  let userOwns = false;
  let isBoosted = false;
  if (user) {
    const { data: vote } = await supabase
      .from('votes')
      .select('id')
      .eq('project_id', id)
      .eq('user_id', user.id)
      .single();

    userVoted = !!vote;
    userOwns = data.user_id === user.id;
  }

  // Check if project is boosted
  if (data.boosted_until) {
    isBoosted = new Date(data.boosted_until) > new Date();
  }

  return {
    ...data,
    user_voted: userVoted,
    user_owns: userOwns,
    user_email: data.profiles?.email,
    user_username: data.profiles?.username,
    is_boosted: isBoosted,
  } as Project;
}

export async function deleteProject(projectId: string): Promise<{ success: boolean; message?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: 'User must be authenticated' };
  }

  // First, get the project to check ownership and get image URLs
  const { data: project, error: fetchError } = await supabase
    .from('projects')
    .select('id, user_id, logo_url, screenshot_url')
    .eq('id', projectId)
    .single();

  if (fetchError || !project) {
    return { success: false, message: 'Project not found' };
  }

  // Check ownership
  if (project.user_id !== user.id) {
    return { success: false, message: 'You can only delete your own projects' };
  }

  // Delete associated images from storage
  if (project.logo_url) {
    try {
      await deleteProjectImage(project.logo_url);
    } catch (error) {
      console.error('Error deleting logo:', error);
      // Continue even if image deletion fails
    }
  }

  if (project.screenshot_url) {
    try {
      await deleteProjectImage(project.screenshot_url);
    } catch (error) {
      console.error('Error deleting screenshot:', error);
      // Continue even if image deletion fails
    }
  }

  // Delete the project (cascade will handle reviews and votes)
  const { error: deleteError } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('user_id', user.id); // Double check ownership

  if (deleteError) {
    console.error('Error deleting project:', deleteError);
    return { success: false, message: 'Error deleting project' };
  }

  return { success: true };
}

export async function getUserProjects(userId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user projects:', error);
    throw error;
  }

  return data || [];
}

// ============================================
// VOTES SERVICE
// ============================================

export async function voteProject(projectId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User must be authenticated');

  // Check if already voted
  const { data: existingVote } = await supabase
    .from('votes')
    .select('id')
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .single();

  if (existingVote) {
    // Remove vote (toggle)
    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', user.id);

    return !error;
  }

  // Add vote
  const { error } = await supabase
    .from('votes')
    .insert({
      project_id: projectId,
      user_id: user.id,
    });

  return !error;
}

// ============================================
// REVIEWS SERVICE
// ============================================

export async function submitReview(data: SubmitReviewData): Promise<Review | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User must be authenticated');

  // Validate content length
  if (data.content.length <= 100) {
    throw new Error('Review content must be more than 100 characters');
  }

  // Import validation function
  const { validateReviewContent } = await import('../utils/reviewValidation');
  const validation = validateReviewContent(data.content);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid review content');
  }

  // Check if user already reviewed this project
  const { data: existingReview } = await supabase
    .from('reviews')
    .select('id')
    .eq('project_id', data.project_id)
    .eq('author_id', user.id)
    .single();

  if (existingReview) {
    // Update existing review
    const { data: review, error } = await supabase
      .from('reviews')
      .update({
        content: data.content,
        rating: data.rating,
      })
      .eq('id', existingReview.id)
      .select()
      .single();

    if (error) throw error;
    return review;
  }

  // Create new review
  const { data: review, error } = await supabase
    .from('reviews')
    .insert({
      project_id: data.project_id,
      author_id: user.id,
      content: data.content.trim(), // Ensure trimmed content
      rating: data.rating,
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting review:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    throw error;
  }

  if (!review) {
    console.error('Review insertion returned no data');
    throw new Error('Failed to create review - no data returned');
  }

  // Earn credits from review (via RPC function)
  let creditsEarned = 0;
  try {
    const { data: creditsData, error: creditsError } = await supabase.rpc('earn_credits_from_review', { p_user_id: user.id });
    if (!creditsError && creditsData !== null) {
      creditsEarned = creditsData as number;
    }
  } catch (err) {
    console.warn('Error earning credits from review:', err);
    // Don't fail the review submission if credit earning fails
  }

  // Add credits earned to review metadata for display
  return { ...review, credits_earned: creditsEarned } as Review & { credits_earned?: number };
}

export async function getProjectReviews(projectId: string): Promise<Review[]> {
  // Try multiple foreign key naming conventions
  let data: any[] | null = null;
  let error: any = null;

  // Try with explicit foreign key name first
  const { data: data1, error: error1 } = await supabase
    .from('reviews')
    .select(`
      *,
      profiles!reviews_author_id_fkey(email, username)
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (!error1 && data1) {
    data = data1;
  } else {
    // Try alternative foreign key naming
    const { data: data2, error: error2 } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles!author_id(email, username)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (!error2 && data2) {
      data = data2;
    } else {
      // Fallback: fetch reviews and profiles separately
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
        throw reviewsError;
      }

      // Fetch profiles for all authors
      const authorIds = [...new Set((reviewsData || []).map((r: any) => r.author_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, username')
        .in('id', authorIds);

      if (profilesError) {
        console.warn('Error fetching profiles:', profilesError);
      }

      // Map reviews with profiles
      const profilesMap = new Map((profilesData || []).map((p: any) => [p.id, p]));
      data = (reviewsData || []).map((review: any) => {
        const profile = profilesMap.get(review.author_id);
        return {
          ...review,
          profiles: profile || null,
        };
      });
    }
  }

  // Map reviews and ensure username is properly extracted
  const mappedReviews = (data || []).map((review: any) => {
    const profile = review.profiles || {};
    const authorEmail = profile.email || null;
    const authorUsername = profile.username || null;
    
    // Debug log
    if (process.env.NODE_ENV === 'development') {
      console.log('Review mapping:', {
        reviewId: review.id,
        authorId: review.author_id,
        authorEmail,
        authorUsername,
        profile: profile,
      });
    }
    
    return {
      ...review,
      author_email: authorEmail,
      author_username: authorUsername,
    };
  }) as Review[];

  return mappedReviews;
}

// ============================================
// AI AUDIT SERVICE
// ============================================

export async function unlockProjectAudit(
  projectId: string,
  language: 'fr' | 'en' = 'fr',
  skipCreditCheck: boolean = false
): Promise<{ success: boolean; credits_remaining?: number; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User must be authenticated');

  // Get project details
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single();

  if (projectError || !project) {
    throw new Error('Project not found or not owned by user');
  }

  // Check if already unlocked and has audit result
  if (project.is_audit_unlocked && project.ai_score) {
    return { success: false, error: 'Audit already unlocked' };
  }

  // Get user credits
  const { data: profile } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', user.id)
    .single();

  const userCredits = profile?.credits || 0;
  const auditCost = 50;

  // Check if free audit is available (50 free audits total for entire platform)
  let isFreeAudit = false;
  if (!skipCreditCheck) {
    try {
      const { data: freeAuditAvailable, error: freeAuditError } = await supabase.rpc('check_free_audit_available');
      if (!freeAuditError && freeAuditAvailable === true) {
        isFreeAudit = true;
        console.log('Free audit available! This audit will be free.');
      } else {
        console.log('No free audits left for the platform, will charge credits');
      }
    } catch (err) {
      console.warn('Error checking free audit availability:', err);
      // Continue with normal flow if check fails
    }
  }

  if (!skipCreditCheck && !isFreeAudit && userCredits < auditCost) {
    return {
      success: false,
      error: 'Insufficient credits',
      credits_remaining: userCredits,
    };
  }

  try {
    // IMPORTANT: Deduct credits FIRST, before generating the audit
    // This ensures credits are deducted even if audit generation fails
    // Skip if this is a free audit
    if (!skipCreditCheck && !isFreeAudit) {
      console.log('Deducting credits before audit generation...');
      
      // Try deduct_credits RPC first
      const { data: deductResult, error: deductError } = await supabase.rpc('deduct_credits', {
        p_user_id: user.id,
        p_amount: auditCost,
      });

      if (deductError || !deductResult?.success) {
        console.error('deduct_credits RPC failed:', deductError, deductResult);
        
        // If RPC doesn't exist, try unlock_project_audit RPC (which handles credit deduction)
        if (deductError?.code === 'P0001' || deductError?.message?.includes('function') || deductError?.code === '42883') {
          console.warn('deduct_credits RPC not found, trying unlock_project_audit RPC');
          
          const { data: unlockResult, error: unlockError } = await supabase.rpc('unlock_project_audit', {
            p_project_id: projectId,
            p_user_id: user.id,
          });
          
          if (unlockError || !unlockResult?.success) {
            console.error('unlock_project_audit RPC also failed:', unlockError, unlockResult);
            throw new Error(unlockResult?.error || unlockError?.message || 'Failed to deduct credits');
          }
          
          // If unlock_project_audit succeeded, it already unlocked the audit in the database
          // We still need to generate and save the audit result
          console.log('Credits deducted via unlock_project_audit RPC, audit unlocked in DB');
          
          // Re-fetch project to check if it's already unlocked
          const { data: updatedProject } = await supabase
            .from('projects')
            .select('is_audit_unlocked')
            .eq('id', projectId)
            .single();
          
          if (updatedProject?.is_audit_unlocked) {
            // Audit was already unlocked by the RPC, just generate and save the result
            console.log('Audit already unlocked by RPC, generating audit result...');
          }
        } else {
          // Other error - throw it (don't generate audit if credits can't be deducted)
          throw new Error(deductResult?.error || deductError?.message || 'Failed to deduct credits');
        }
      } else {
        console.log('Credits deducted successfully via deduct_credits RPC');
      }
    }

    // Now generate the audit (credits already deducted)
    console.log('Generating audit...');
    const auditResult = await performCompleteAudit(
      project.url,
      project.name,
      project.description || '',
      language
    );

    // Update project with audit result
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        is_audit_unlocked: true,
        ai_score: auditResult,
      })
      .eq('id', projectId);

    if (updateError) {
      console.error('Error updating project:', updateError);
      throw new Error('Failed to save audit');
    }

    // Get updated credits to return accurate remaining amount
    const { data: updatedProfile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    const remainingCredits = updatedProfile?.credits || (skipCreditCheck ? userCredits : userCredits - auditCost);

    return {
      success: true,
      credits_remaining: remainingCredits,
    };
  } catch (error: any) {
    console.error('Error performing audit:', error);
    console.error('Error details:', error?.message, error?.stack);
    
    // Even if audit generation fails, try to save a fallback audit
    try {
      const fallbackAudit = {
        overall_score: 70,
        categories: [
          {
            name: language === 'fr' ? 'Analyse générale' : 'General Analysis',
            score: 70,
            issues: [language === 'fr' ? 'Audit de base généré. Analysez votre site manuellement pour plus de détails.' : 'Basic audit generated. Analyze your site manually for more details.'],
            suggested_tools: [],
          },
        ],
        generated_at: new Date().toISOString(),
      };
      
      // Update project with fallback audit
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          is_audit_unlocked: true,
          ai_score: fallbackAudit,
        })
        .eq('id', projectId);
      
      if (!updateError) {
        return {
          success: true,
          credits_remaining: skipCreditCheck ? userCredits : userCredits - auditCost,
        };
      }
    } catch (fallbackError) {
      console.error('Error saving fallback audit:', fallbackError);
    }
    
    return {
      success: false,
      error: error.message || 'Failed to perform audit',
    };
  }
}

// ============================================
// CREDITS SERVICE (Unified)
// ============================================

export async function boostProject(projectId: string): Promise<{ success: boolean; credits_remaining?: number; error?: string; boosted_until?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User must be authenticated');

  const { data, error } = await supabase.rpc('boost_project', {
    p_project_id: projectId,
    p_user_id: user.id,
  });

  if (error) {
    console.error('Error boosting project:', error);
    throw error;
  }

  return data as { success: boolean; credits_remaining?: number; error?: string; boosted_until?: string };
}

export async function checkWeeklyRefill(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase.rpc('check_weekly_refill', {
    p_user_id: user.id,
  });

  if (error) {
    console.warn('Error checking weekly refill:', error);
    return false;
  }

  return data === true;
}

// ============================================
// RANDOM PROJECT SERVICE
// ============================================

export async function getRandomProject(): Promise<Project | null> {
  const { data: { user } } = await supabase.auth.getUser();

  // Get a random published project using RPC for true randomness
  // First, get count of published projects
  const { count } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  if (!count || count === 0) {
    return null;
  }

  // Get random offset
  const randomOffset = Math.floor(Math.random() * count);

  // Get project at random offset
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      profiles!projects_user_id_fkey(email, username)
    `)
    .eq('status', 'published')
    .range(randomOffset, randomOffset)
    .limit(1);

  if (error || !data || data.length === 0) {
    console.error('Error fetching random project:', error);
    return null;
  }

  const project = data[0];

  // Check if user has voted
  let userVoted = false;
  let userOwns = false;
  let isBoosted = false;
  if (user) {
    const { data: vote } = await supabase
      .from('votes')
      .select('id')
      .eq('project_id', project.id)
      .eq('user_id', user.id)
      .single();

    userVoted = !!vote;
    userOwns = project.user_id === user.id;
  }

  // Check if project is boosted
  if (project.boosted_until) {
    isBoosted = new Date(project.boosted_until) > new Date();
  }

  // Parse links if it's a string
  let links = project.links;
  if (typeof links === 'string') {
    try {
      links = JSON.parse(links);
    } catch {
      links = [];
    }
  }

  return {
    ...project,
    links: links || [],
    user_voted: userVoted,
    user_owns: userOwns,
    user_email: project.profiles?.email,
    user_username: project.profiles?.username,
    is_boosted: isBoosted,
  } as Project;
}

// Promo code service removed - using free audits system instead

