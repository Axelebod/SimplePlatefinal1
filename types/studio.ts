// Types for SimplePlate Studio (Phase 2)

export type ProjectCategory = 'saas' | 'tool' | 'app' | 'website' | 'other';
export type ProjectStatus = 'pending' | 'published' | 'rejected';

export interface ProjectLink {
  type: 'github' | 'twitter' | 'linkedin' | 'discord' | 'website' | 'other';
  url: string;
  label?: string;
}

export interface Project {
  id: string;
  user_id: string;
  url: string;
  name: string;
  description: string | null;
  category: ProjectCategory;
  status: ProjectStatus;
  ai_score: AIAuditResult | null;
  is_audit_unlocked: boolean;
  votes_count: number;
  slug: string; // Unique slug for backlinks
  logo_url?: string | null; // Logo image URL
  screenshot_url?: string | null; // Screenshot/preview image URL
  links?: ProjectLink[]; // Array of social/other links
  boosted_until?: string | null; // Timestamp until which project is boosted
  created_at: string;
  updated_at: string;
  // Joined data
  user_email?: string;
  user_username?: string;
  user_voted?: boolean;
  user_owns?: boolean;
  is_boosted?: boolean;
  recent_votes_count?: number; // Votes for current period (daily/weekly/all-time)
}

export interface AIAuditResult {
  overall_score: number;
  categories: AuditCategory[];
  generated_at: string;
}

export interface AuditCategory {
  name: string;
  score: number;
  issues: string[];
  suggested_tools?: string[]; // Tool IDs from Phase 1
}

export interface Review {
  id: string;
  project_id: string;
  author_id: string;
  content: string;
  rating: number; // 1-5
  created_at: string;
  // Joined data
  author_email?: string;
  author_username?: string;
}

export interface Vote {
  id: string;
  project_id: string;
  user_id: string;
  created_at: string;
}

export interface SubmitProjectData {
  url: string;
  name: string;
  description: string;
  category: ProjectCategory;
  logo_url?: string;
  screenshot_url?: string;
  links?: ProjectLink[];
}

export interface SubmitReviewData {
  project_id: string;
  content: string;
  rating: number;
}

