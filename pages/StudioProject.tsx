import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ExternalLink, MessageSquare, Lock, Unlock, Zap, ArrowLeft, Share2, ArrowRight, Crown, Trash2 } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { getProjectById, getProjectBySlug, voteProject, getProjectReviews, submitReview, unlockProjectAudit, boostProject, deleteProject, usePromoCode } from '../services/studioService';
import { useUserStore as useUserStoreCredits } from '../store/userStore';
import type { Project, Review, SubmitReviewData } from '../types/studio';
import { useTranslation } from '../hooks/useTranslation';
import { useSEO } from '../hooks/useSEO';
import { getTools } from '../tools-config';
import { useToast } from '../contexts/ToastContext';
import { getProjectImageUrl, getFaviconUrl } from '../utils/faviconUtils';

export const StudioProject: React.FC = () => {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const navigate = useNavigate();
  const { user, credits } = useUserStore();
  const { refreshCredits } = useUserStoreCredits();
  const { t, language } = useTranslation();
  const { success, error: showError, warning } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [boosting, setBoosting] = useState(false);
  const [showPromoCodeInput, setShowPromoCodeInput] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [applyingPromoCode, setApplyingPromoCode] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const tools = React.useMemo(() => getTools(language), [language]);

  useSEO({
    title: project 
      ? `${project.name} | SimplePlate Studio - Audit IA & Avis Communauté`
      : 'Project | SimplePlate Studio',
    description: project 
      ? `${project.description || project.name} - Découvrez ce projet Micro-SaaS sur SimplePlate Studio. Score IA: ${project.ai_score?.overall_score || 'N/A'}/100. ${project.votes_count} votes.`
      : 'Découvrez ce projet Micro-SaaS sur SimplePlate Studio',
    language,
    keywords: project 
      ? [project.name, 'Micro-SaaS', 'audit IA', 'SimplePlate Studio', project.category, 'startup', 'projet']
      : ['SimplePlate Studio', 'Micro-SaaS', 'audit IA'],
    imagePath: project?.screenshot_url || project?.logo_url,
    jsonLdId: 'json-ld-project',
    jsonLd: project ? {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: project.name,
      description: project.description,
      url: project.url,
      applicationCategory: 'WebApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
      },
      aggregateRating: project.reviews && project.reviews.length > 0 ? {
        '@type': 'AggregateRating',
        ratingValue: project.reviews.reduce((sum, r) => sum + r.rating, 0) / project.reviews.length,
        reviewCount: project.reviews.length,
      } : undefined,
    } : null,
  });

  useEffect(() => {
    if (slug || id) {
      loadProject();
      loadReviews();
    }
  }, [slug, id]);

  const loadProject = async () => {
    if (!slug && !id) return;
    setLoading(true);
    try {
      let data: Project | null = null;
      if (slug) {
        data = await getProjectBySlug(slug);
      } else if (id) {
        data = await getProjectById(id);
      }
      
      if (data && data.slug && slug !== data.slug) {
        // Redirect to slug-based URL if different
        navigate(`/studio/project/${data.slug}`, { replace: true });
        return;
      }
      
      setProject(data);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    if (!id) return;
    try {
      const data = await getProjectReviews(id);
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleVote = async () => {
    if (!user || !project) {
      showError(language === 'fr' ? 'Vous devez être connecté pour voter' : 'You must be logged in to vote');
      return;
    }

    setVoting(true);
    try {
      // Optimistically update UI
      const wasVoted = project.user_voted;
      setProject({
        ...project,
        user_voted: !wasVoted,
        votes_count: wasVoted ? project.votes_count - 1 : project.votes_count + 1,
      });

      await voteProject(project.id);
      success(language === 'fr' ? 'Vote enregistré !' : 'Vote recorded!');
    } catch (error) {
      console.error('Error voting:', error);
      // Revert optimistic update on error
      await loadProject();
      showError(language === 'fr' ? 'Erreur lors du vote' : 'Error voting');
    } finally {
      setVoting(false);
    }
  };

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      warning(language === 'fr' ? 'Veuillez entrer un code promo' : 'Please enter a promo code');
      return;
    }

    if (!project) {
      showError(language === 'fr' ? 'Projet non trouvé' : 'Project not found');
      return;
    }

    setApplyingPromoCode(true);
    try {
      // Utiliser le code promo pour débloquer directement l'audit
      const result = await usePromoCode(promoCode.trim(), project.id);
      if (result.success) {
        // Si le code a débloqué l'audit, générer l'audit maintenant (sans déduire de crédits)
        if (result.project_id) {
          setUnlocking(true);
          try {
            const auditResult = await unlockProjectAudit(project.id, language, true); // skipCreditCheck = true
            if (auditResult.success) {
              await loadProject();
              await refreshCredits();
              success(language === 'fr' ? 'Code promo appliqué ! Audit débloqué et généré avec succès.' : 'Promo code applied! Audit unlocked and generated successfully.');
            } else {
              // Le code a été utilisé mais l'audit n'a pas pu être généré
              await loadProject();
              showError(auditResult.error || (language === 'fr' ? 'Erreur lors de la génération de l\'audit' : 'Error generating audit'));
            }
          } catch (error) {
            console.error('Error generating audit:', error);
            await loadProject();
            showError(language === 'fr' ? 'Erreur lors de la génération de l\'audit' : 'Error generating audit');
          } finally {
            setUnlocking(false);
          }
        } else {
          // Code promo classique (crédits)
          await refreshCredits();
          success(result.message || (language === 'fr' 
            ? `Code promo appliqué ! Vous avez reçu ${result.credits_granted || 0} crédits.`
            : `Promo code applied! You received ${result.credits_granted || 0} credits.`));
        }
        setPromoCode('');
        setShowPromoCodeInput(false);
      } else {
        showError(result.error || (language === 'fr' ? 'Code promo invalide' : 'Invalid promo code'));
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      showError(language === 'fr' ? 'Erreur lors de l\'application du code' : 'Error applying code');
    } finally {
      setApplyingPromoCode(false);
    }
  };

  const handleUnlockAudit = async () => {
    if (!user || !project) return;

    if (credits < 50) {
      warning(language === 'fr' 
        ? `Vous avez besoin de 50 crédits pour débloquer l'audit complet. Vous avez ${credits} crédits.`
        : `You need 50 credits to unlock the complete audit. You have ${credits} credits.`);
      setShowPromoCodeInput(true);
      return;
    }

    setUnlocking(true);
    try {
      const result = await unlockProjectAudit(project.id, language);
      if (result.success) {
        await loadProject();
        await refreshCredits();
        success(language === 'fr' ? 'Audit débloqué avec succès! Analyse complète générée.' : 'Audit unlocked successfully! Complete analysis generated.');
      } else {
        const errorMsg = result.error || (language === 'fr' ? 'Erreur lors du déblocage' : 'Error unlocking');
        console.error('Audit unlock failed:', errorMsg);
        showError(errorMsg);
      }
    } catch (error: any) {
      console.error('Error unlocking audit:', error);
      const errorMsg = error?.message || (language === 'fr' ? 'Erreur lors du déblocage de l\'audit. Veuillez réessayer.' : 'Error unlocking audit. Please try again.');
      showError(errorMsg);
    } finally {
      setUnlocking(false);
    }
  };

  const handleBoost = async () => {
    if (!user || !project) return;

    if (credits < 100) {
      warning(language === 'fr' 
        ? `Vous avez besoin de 100 crédits pour booster votre projet. Vous avez ${credits} crédits.`
        : `You need 100 credits to boost your project. You have ${credits} credits.`);
      navigate('/pricing');
      return;
    }

    if (!confirm(language === 'fr' 
      ? 'Boostez ce projet pour 1 semaine avec 100 crédits ? Il apparaîtra en haut du classement.'
      : 'Boost this project for 1 week with 100 credits? It will appear at the top of the leaderboard.')) {
      return;
    }

    setBoosting(true);
    try {
      const result = await boostProject(project.id);
      if (result.success) {
        await loadProject();
        await refreshCredits();
        success(language === 'fr' ? 'Projet boosté pour 1 semaine !' : 'Project boosted for 1 week!');
      } else {
        showError(result.error || (language === 'fr' ? 'Erreur lors du boost' : 'Error boosting'));
      }
    } catch (error) {
      console.error('Error boosting:', error);
      showError(language === 'fr' ? 'Erreur lors du boost' : 'Error boosting');
    } finally {
      setBoosting(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user || !project) {
      return;
    }

    // Validate review content
    const { validateReviewContent } = await import('../utils/reviewValidation');
    const validation = validateReviewContent(reviewContent);
    if (!validation.valid) {
      warning(validation.error || (language === 'fr' 
        ? 'Le commentaire doit contenir plus de 100 caractères'
        : 'Review must be more than 100 characters'));
      return;
    }

    setSubmittingReview(true);
    try {
      const reviewData: SubmitReviewData = {
        project_id: project.id,
        content: reviewContent,
        rating: reviewRating,
      };
      const review = await submitReview(reviewData);
      if (review) {
        setReviews([review, ...reviews]);
        setReviewContent('');
        setReviewRating(5);
        setShowReviewForm(false);
        
        // Check if credits were earned
        const creditsEarned = (review as any).credits_earned || 0;
        if (creditsEarned > 0) {
          success(language === 'fr' 
            ? `Avis publié ! Vous avez gagné ${creditsEarned} crédit${creditsEarned > 1 ? 's' : ''}.` 
            : `Review published! You earned ${creditsEarned} credit${creditsEarned > 1 ? 's' : ''}.`);
        } else {
          success(language === 'fr' 
            ? 'Avis publié ! (Limite quotidienne de crédits atteinte)' 
            : 'Review published! (Daily credit limit reached)');
        }
        await refreshCredits();
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);
      showError(error?.message || (language === 'fr' ? 'Erreur lors de la publication de l\'avis' : 'Error publishing review'));
    } finally {
      setSubmittingReview(false);
    }
  };

  const getToolLink = (toolId: string) => {
    const tool = tools.find(t => t.id === toolId);
    return tool ? `/tool/${tool.slug || tool.id}` : '#';
  };

  const getToolName = (toolId: string) => {
    const tool = tools.find(t => t.id === toolId);
    return tool?.title || toolId;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center">
        <p className="text-gray-500 dark:text-gray-400">{language === 'fr' ? 'Chargement...' : 'Loading...'}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {language === 'fr' ? 'Projet introuvable' : 'Project not found'}
        </p>
        <Link to="/studio" className="text-neo-violet font-bold hover:underline">
          {language === 'fr' ? '← Retour au Studio' : '← Back to Studio'}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Back Button */}
      <Link
        to="/studio"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white mb-6 font-bold"
      >
        <ArrowLeft className="w-4 h-4" />
        {language === 'fr' ? 'Retour au Studio' : 'Back to Studio'}
      </Link>

      {/* Project Header */}
      <div className="bg-white dark:bg-gray-600 border-2 border-black dark:border-white rounded-lg p-6 md:p-8 mb-6 shadow-neo dark:shadow-[2px_2px_0px_0px_#fff]">
        {/* Share and Delete Buttons */}
        <div className="flex justify-end gap-2 mb-4">
          {project.user_owns && (
            <button
              onClick={async () => {
                if (!confirm(language === 'fr' 
                  ? 'Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.'
                  : 'Are you sure you want to delete this project? This action cannot be undone.')) {
                  return;
                }
                
                setDeleting(true);
                try {
                  const result = await deleteProject(project.id);
                  if (result.success) {
                    success(language === 'fr' ? 'Projet supprimé avec succès' : 'Project deleted successfully');
                    setTimeout(() => navigate('/studio'), 1000);
                  } else {
                    showError(result.message || (language === 'fr' ? 'Erreur lors de la suppression' : 'Error deleting project'));
                  }
                } catch (error) {
                  console.error('Error deleting project:', error);
                  showError(language === 'fr' ? 'Erreur lors de la suppression' : 'Error deleting project');
                } finally {
                  setDeleting(false);
                }
              }}
              disabled={deleting}
              className="px-4 py-2 bg-neo-red text-white border-2 border-black rounded-md font-bold hover:bg-neo-red/90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? (language === 'fr' ? 'Suppression...' : 'Deleting...') : (language === 'fr' ? 'Supprimer' : 'Delete')}
            </button>
          )}
          <button
            onClick={async () => {
              const shareUrl = `${window.location.origin}/studio/project/${project.slug || project.id}`;
              const shareData = {
                title: `${project.name} | SimplePlate Studio`,
                text: project.description || `Découvrez ${project.name} sur SimplePlate Studio`,
                url: shareUrl,
              };
              
              if (navigator.share) {
                try {
                  await navigator.share(shareData);
                } catch (err) {
                  // User cancelled or error
                  navigator.clipboard.writeText(shareUrl);
                  success(language === 'fr' ? 'Lien copié dans le presse-papiers!' : 'Link copied to clipboard!');
                }
              } else {
                navigator.clipboard.writeText(shareUrl);
                success(language === 'fr' ? 'Lien copié dans le presse-papiers!' : 'Link copied to clipboard!');
              }
            }}
            className="px-4 py-2 bg-neo-yellow border-2 border-black rounded-md font-bold hover:bg-neo-yellow/90 transition-colors flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            {language === 'fr' ? 'Partager' : 'Share'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Logo and Screenshot */}
          <div className="flex flex-col gap-4">
            {(() => {
              const logoUrl = project.logo_url || getFaviconUrl(project.url, 64);
              return logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={`${project.name} ${project.logo_url ? 'logo' : 'favicon'}`} 
                  className={`${project.logo_url ? 'w-24 h-24' : 'w-16 h-16'} object-contain border-2 border-black dark:border-white rounded-md`}
                  onError={(e) => {
                    // Fallback to smaller favicon if logo fails to load
                    if (project.logo_url) {
                      const target = e.target as HTMLImageElement;
                      target.src = getFaviconUrl(project.url, 64);
                      target.className = 'w-16 h-16 object-contain border-2 border-black dark:border-white rounded-md';
                    }
                  }}
                />
              ) : null;
            })()}
            {project.screenshot_url && (
              <img 
                src={project.screenshot_url} 
                alt={`${project.name} screenshot`} 
                className="w-full md:w-96 h-48 object-cover border-2 border-black dark:border-white rounded-md"
                onError={(e) => {
                  // Hide image if it fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
          </div>

          <div className="flex-1">
            {/* Boost Badge - Above project name */}
            {project.is_boosted && (
              <div className="flex items-center gap-1 px-2 py-1 bg-neo-yellow border-2 border-black rounded-md text-xs font-bold mb-2 w-fit">
                <Crown className="w-3 h-3" />
                {language === 'fr' ? 'BOOSTÉ' : 'BOOSTED'}
              </div>
            )}
            <h1 className="font-display text-3xl md:text-4xl font-bold dark:text-white mb-2">
              {project.name}
            </h1>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-neo-violet font-bold hover:underline mb-4"
            >
              <ExternalLink className="w-4 h-4" />
              {project.url}
            </a>
            {project.description && (
              <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
            )}
            
            {/* Links */}
            {project.links && project.links.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-500 border-2 border-black dark:border-white rounded-md text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-400 transition-colors"
                  >
                    {link.label || link.type}
                  </a>
                ))}
              </div>
            )}
            {project.user_owns && (
              <div className="mt-4 flex flex-wrap gap-2">
                {!project.is_boosted && (
                  <button
                    onClick={handleBoost}
                    disabled={boosting || credits < 100}
                    className="flex items-center gap-2 px-4 py-2 bg-neo-yellow border-2 border-black rounded-md font-bold shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
                  >
                    <Crown className="w-4 h-4" />
                    {boosting 
                      ? (language === 'fr' ? 'Boost...' : 'Boosting...')
                      : (language === 'fr' ? 'Boost 1 semaine (100 crédits)' : 'Boost 1 week (100 credits)')}
                  </button>
                )}
                {project.is_boosted && project.boosted_until && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-neo-yellow border-2 border-black rounded-md font-bold">
                    <Crown className="w-4 h-4" />
                    <span className="text-sm">
                      {language === 'fr' ? 'Boosté jusqu\'au' : 'Boosted until'} {new Date(project.boosted_until).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleVote}
              disabled={voting || !user}
              className={`flex items-center gap-2 px-4 py-2 border-2 rounded-md font-bold transition-colors ${
                project.user_voted
                  ? 'bg-neo-violet text-white border-neo-violet'
                  : 'bg-white dark:bg-gray-600 border-black dark:border-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Heart className={`w-5 h-5 ${project.user_voted ? 'fill-current' : ''}`} />
              {project.votes_count}
            </button>
            {project.is_boosted && (
              <div className="flex items-center justify-center gap-1 px-3 py-1 bg-neo-yellow border-2 border-black rounded-md text-xs font-bold">
                <Crown className="w-3 h-3" />
                {language === 'fr' ? 'BOOSTÉ' : 'BOOSTED'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Audit Section - Visible to everyone, but only owner can unlock */}
      <div className="border-t-2 border-black dark:border-white pt-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl font-bold dark:text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-neo-violet" />
            {language === 'fr' ? 'Audit IA' : 'AI Audit'}
          </h2>
          {!project.is_audit_unlocked && project.user_owns && (
            <div className="flex flex-col gap-2">
              <button
                onClick={handleUnlockAudit}
                disabled={unlocking || !user}
                className="flex items-center gap-2 px-4 py-2 bg-neo-yellow border-2 border-black rounded-md font-bold shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
              >
                {unlocking ? (
                  language === 'fr' ? 'Déblocage...' : 'Unlocking...'
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    {language === 'fr' ? 'Débloquer l\'audit (50 crédits)' : 'Unlock audit (50 credits)'}
                  </>
                )}
              </button>
              {credits < 50 && user && (
                <button
                  onClick={() => setShowPromoCodeInput(!showPromoCodeInput)}
                  className="text-xs text-neo-violet hover:underline font-bold"
                >
                  {language === 'fr' ? 'J\'ai un code promo' : 'I have a promo code'}
                </button>
              )}
              {showPromoCodeInput && user && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder={language === 'fr' ? 'Code promo' : 'Promo code'}
                    className="flex-1 px-3 py-2 border-2 border-black dark:border-white rounded-md bg-white dark:bg-gray-500 text-black dark:text-white font-bold text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleApplyPromoCode();
                      }
                    }}
                  />
                  <button
                    onClick={handleApplyPromoCode}
                    disabled={applyingPromoCode || !promoCode.trim()}
                    className="px-4 py-2 bg-neo-violet text-white font-bold border-2 border-black rounded-md shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
                  >
                    {applyingPromoCode 
                      ? (language === 'fr' ? '...' : '...')
                      : (language === 'fr' ? 'Appliquer' : 'Apply')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

            {project.is_audit_unlocked && project.ai_score ? (
              <div className="bg-gray-50 dark:bg-gray-500 border-2 border-black dark:border-white rounded-lg p-6">
                {/* Overall Score */}
                <div className="mb-8 text-center">
                  <div className="inline-block bg-neo-violet text-white px-8 py-4 rounded-lg border-2 border-black dark:border-white shadow-neo">
                    <div className="text-5xl font-bold mb-1">
                      {project.ai_score.overall_score}/100
                    </div>
                    <p className="text-sm font-bold opacity-90">
                      {language === 'fr' ? 'Score Global' : 'Overall Score'}
                    </p>
                  </div>
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                    {language === 'fr' 
                      ? 'Audit complet généré le ' + new Date(project.ai_score.generated_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')
                      : 'Complete audit generated on ' + new Date(project.ai_score.generated_at).toLocaleDateString('en-US')}
                  </p>
                </div>

                {/* Categories */}
                <div className="space-y-6">
                  {project.ai_score.categories.map((category, idx) => {
                    const scoreColor = category.score >= 80 
                      ? 'text-green-600 dark:text-green-400' 
                      : category.score >= 60 
                      ? 'text-yellow-600 dark:text-yellow-400' 
                    : 'text-red-600 dark:text-red-400';
                  
                  return (
                    <div key={idx} className="bg-white dark:bg-gray-600 border-2 border-black dark:border-white rounded-lg p-5 shadow-neo dark:shadow-[2px_2px_0px_0px_#fff]">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display text-xl font-bold dark:text-white">{category.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-3xl font-bold ${scoreColor}`}>
                            {category.score}/100
                          </span>
                          <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center ${
                            category.score >= 80 
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                              : category.score >= 60 
                              ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
                              : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          }`}>
                            <span className={`text-lg font-bold ${scoreColor}`}>
                              {category.score}%
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {category.issues.length > 0 && (
                        <div className="mb-4">
                          <p className="font-bold text-sm mb-2 dark:text-white">
                            {language === 'fr' ? '🔍 Problèmes détectés:' : '🔍 Issues detected:'}
                          </p>
                          <ul className="space-y-2">
                            {category.issues.map((issue, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <span className="text-red-500 mt-1">•</span>
                                <span>{issue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {category.suggested_tools && category.suggested_tools.length > 0 && (
                        <div className="mt-4 pt-4 border-t-2 border-gray-300 dark:border-white">
                          <p className="font-bold text-sm mb-3 dark:text-white flex items-center gap-2">
                            <Zap className="w-4 h-4 text-neo-violet" />
                            {language === 'fr' ? '🛠️ Outils SimplePlate pour corriger:' : '🛠️ SimplePlate tools to fix:'}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {category.suggested_tools.map((toolId) => {
                              const tool = tools.find(t => t.id === toolId);
                              if (!tool) return null;
                              return (
                                <Link
                                  key={toolId}
                                  to={getToolLink(toolId)}
                                  className="group px-4 py-2 bg-neo-violet text-white text-sm font-bold rounded-md hover:bg-neo-violet/90 transition-all border-2 border-neo-violet hover:border-black dark:hover:border-white shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                                >
                                  {tool.title}
                                  <ArrowRight className="w-3 h-3 inline-block ml-1 group-hover:translate-x-1 transition-transform" />
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-500 border-2 border-dashed border-gray-400 dark:border-white rounded-lg p-6 text-center">
              <Lock className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-300" />
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {language === 'fr' 
                  ? project.user_owns
                    ? 'Débloquez l\'audit IA pour voir l\'analyse détaillée de votre projet.'
                    : 'L\'audit IA n\'a pas encore été débloqué par le propriétaire du projet.'
                  : project.user_owns
                    ? 'Unlock the AI audit to see detailed analysis of your project.'
                    : 'The AI audit has not been unlocked by the project owner yet.'}
              </p>
            </div>
          )}
          </div>

      {/* Reviews Section */}
      <div className="bg-white dark:bg-gray-600 border-2 border-black dark:border-white rounded-lg p-6 md:p-8 shadow-neo dark:shadow-[2px_2px_0px_0px_#fff]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold dark:text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            {language === 'fr' ? 'Avis de la communauté' : 'Community Reviews'} ({reviews.length})
          </h2>
          {user && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2 bg-neo-black dark:bg-white text-white dark:text-black font-bold rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              {showReviewForm 
                ? (language === 'fr' ? 'Annuler' : 'Cancel')
                : (language === 'fr' ? '+ Ajouter un avis' : '+ Add Review')}
            </button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && user && (
          <div className="bg-gray-50 dark:bg-gray-500 border-2 border-black dark:border-white rounded-lg p-6 mb-6">
            <div className="mb-4">
              <label className="block font-bold mb-2 dark:text-white">
                {language === 'fr' ? 'Note (1-5)' : 'Rating (1-5)'}
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setReviewRating(rating)}
                    className={`w-10 h-10 border-2 rounded-md font-bold ${
                      reviewRating >= rating
                        ? 'bg-neo-yellow border-black'
                        : 'bg-white dark:bg-gray-600 border-gray-300 dark:border-white'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block font-bold mb-2 dark:text-white">
                {language === 'fr' ? 'Commentaire (min. 100 caractères)' : 'Review (min. 100 characters)'}
              </label>
              <textarea
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                className="w-full p-3 border-2 border-black dark:border-white rounded-md bg-white dark:bg-gray-600 text-black dark:text-white"
                rows={5}
                placeholder={language === 'fr' 
                  ? 'Partagez votre avis constructif...'
                  : 'Share your constructive feedback...'}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {reviewContent.length}/100 {language === 'fr' ? 'caractères' : 'characters'}
                {reviewContent.length > 100 && (
                  <span className="text-green-600 dark:text-green-400 ml-2">
                    ✓ {language === 'fr' ? 'Vous gagnerez 0.33 crédit!' : 'You will earn 0.33 credits!'}
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={handleSubmitReview}
              disabled={submittingReview || reviewContent.length <= 100}
              className="px-6 py-2 bg-neo-violet text-white font-bold rounded-md hover:bg-neo-violet/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submittingReview 
                ? (language === 'fr' ? 'Envoi...' : 'Submitting...')
                : (language === 'fr' ? 'Soumettre l\'avis' : 'Submit Review')}
            </button>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            {language === 'fr' ? 'Aucun avis pour le moment.' : 'No reviews yet.'}
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-50 dark:bg-gray-500 border-2 border-black dark:border-white rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold dark:text-white">{review.author_username || review.author_email || 'Anonymous'}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.created_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <span
                        key={rating}
                        className={`text-lg ${rating <= review.rating ? 'text-neo-yellow' : 'text-gray-300 dark:text-gray-600'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{review.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

