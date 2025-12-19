import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ExternalLink, TrendingUp, Plus, ArrowRight, Zap, Crown, Shuffle } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { getProjects, voteProject, boostProject, getRandomProject, type RankingPeriod } from '../services/studioService';
import { useUserStore as useUserStoreCredits } from '../store/userStore';
import type { Project } from '../types/studio';
import { useTranslation } from '../hooks/useTranslation';
import { useSEO } from '../hooks/useSEO';
import { useToast } from '../contexts/ToastContext';
import { ProjectCardSkeleton } from '../components/LoadingSkeleton';
import { getProjectImageUrl } from '../utils/faviconUtils';

export const Studio: React.FC = () => {
  const { user, credits } = useUserStore();
  const { refreshCredits } = useUserStoreCredits();
  const { t, language } = useTranslation();
  const { success, error: showError, warning } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<string | null>(null);
  const [boosting, setBoosting] = useState<string | null>(null);
  const [rankingPeriod, setRankingPeriod] = useState<RankingPeriod>('all-time');
  const [loadingRandom, setLoadingRandom] = useState(false);

  useSEO({
    title: language === 'fr' 
      ? 'SimplePlate Studio | Showcase de Micro-SaaS - Audit IA & Communauté'
      : 'SimplePlate Studio | Micro-SaaS Showcase - AI Audit & Community',
    description: language === 'fr' 
      ? 'Découvrez et votez pour les meilleurs Micro-SaaS de la communauté. Obtenez un audit IA complet (50 crédits) et recevez des retours constructifs. Gagnez 0.5 crédit par avis (max 3 crédits/jour).'
      : 'Discover and vote for the best Micro-SaaS from the community. Get a complete AI audit (50 credits) and receive constructive feedback. Earn 0.5 credits per review (max 3 credits/day).',
    language,
    keywords: language === 'fr'
      ? ['SimplePlate Studio', 'Micro-SaaS', 'audit IA', 'showcase', 'startup', 'communauté', 'vote', 'avis', 'audit automatique']
      : ['SimplePlate Studio', 'Micro-SaaS', 'AI audit', 'showcase', 'startup', 'community', 'vote', 'review', 'automated audit'],
    jsonLdId: 'json-ld-studio',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'SimplePlate Studio',
      description: language === 'fr' 
        ? 'Plateforme communautaire pour découvrir, auditer et promouvoir des projets Micro-SaaS'
        : 'Community platform to discover, audit and promote Micro-SaaS projects',
      url: `${window.location.origin}/studio`,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    },
  });

  useEffect(() => {
    loadProjects();
  }, [rankingPeriod]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects(20, 0, rankingPeriod);
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (projectId: string) => {
    if (!user) {
      showError(language === 'fr' ? 'Vous devez être connecté pour voter' : 'You must be logged in to vote');
      return;
    }

    setVoting(projectId);
    try {
      await voteProject(projectId);
      await loadProjects(); // Reload to update vote counts
      success(language === 'fr' ? 'Vote enregistré !' : 'Vote recorded!');
    } catch (error) {
      console.error('Error voting:', error);
      showError(language === 'fr' ? 'Erreur lors du vote' : 'Error voting');
    } finally {
      setVoting(null);
    }
  };

  const handleBoost = async (projectId: string) => {
    if (!user) {
      showError(language === 'fr' ? 'Vous devez être connecté' : 'You must be logged in');
      return;
    }

    if (credits < 100) {
      warning(language === 'fr' 
        ? `Vous avez besoin de 100 crédits pour booster votre projet. Vous avez ${credits} crédits.`
        : `You need 100 credits to boost your project. You have ${credits} credits.`);
      return;
    }

    if (!confirm(language === 'fr' 
      ? 'Boostez ce projet pour 24h avec 100 crédits ?'
      : 'Boost this project for 24h with 100 credits?')) {
      return;
    }

    setBoosting(projectId);
    try {
      const result = await boostProject(projectId);
      if (result.success) {
        await loadProjects();
        await refreshCredits();
        success(language === 'fr' ? 'Projet boosté pour 24h !' : 'Project boosted for 24h!');
      } else {
        showError(result.error || (language === 'fr' ? 'Erreur lors du boost' : 'Error boosting'));
      }
    } catch (error) {
      console.error('Error boosting:', error);
      showError(language === 'fr' ? 'Erreur lors du boost' : 'Error boosting');
    } finally {
      setBoosting(null);
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, { fr: string; en: string }> = {
      saas: { fr: 'SaaS', en: 'SaaS' },
      tool: { fr: 'Outil', en: 'Tool' },
      app: { fr: 'App', en: 'App' },
      website: { fr: 'Site Web', en: 'Website' },
      other: { fr: 'Autre', en: 'Other' },
    };
    return labels[category]?.[language] || category;
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold dark:text-white mb-4">
          SimplePlate <span className="text-neo-violet">Studio</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-6">
          {language === 'fr' 
            ? 'Showcase de Micro-SaaS. Soumettez votre projet, obtenez un audit IA et des retours de la communauté.'
            : 'Micro-SaaS Showcase. Submit your project, get an AI audit and community feedback.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/studio/submit"
            className="px-6 py-3 bg-neo-black dark:bg-white text-white dark:text-black font-bold border-2 border-black dark:border-white rounded-md shadow-neo dark:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {language === 'fr' ? 'Soumettre un projet' : 'Submit Project'}
          </Link>
          <button
            onClick={async () => {
              setLoadingRandom(true);
              try {
                const randomProject = await getRandomProject();
                if (randomProject) {
                  window.location.href = `/studio/project/${randomProject.slug || randomProject.id}`;
                } else {
                  showError(language === 'fr' ? 'Aucun projet trouvé' : 'No project found');
                }
              } catch (error) {
                console.error('Error loading random project:', error);
                showError(language === 'fr' ? 'Erreur lors du chargement' : 'Error loading');
              } finally {
                setLoadingRandom(false);
              }
            }}
            disabled={loadingRandom}
            className="px-6 py-3 bg-neo-violet text-white font-bold border-2 border-black dark:border-white rounded-md shadow-neo dark:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Shuffle className="w-5 h-5" />
            {loadingRandom 
              ? (language === 'fr' ? 'Chargement...' : 'Loading...')
              : (language === 'fr' ? 'Projet aléatoire' : 'Random Project')}
          </button>
          {user && (
            <div className="px-6 py-3 bg-neo-yellow border-2 border-black rounded-md shadow-neo font-bold">
              {credits} {language === 'fr' ? 'crédits' : 'credits'}
            </div>
          )}
        </div>
      </header>

      {/* Leaderboard Header */}
      <div className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-400">
        <TrendingUp className="w-5 h-5" />
        <h2 className="font-bold text-lg">
          {language === 'fr' 
            ? rankingPeriod === 'all-time' ? 'Classement depuis toujours' 
            : rankingPeriod === 'weekly' ? 'Classement hebdomadaire'
            : 'Classement journalier'
            : rankingPeriod === 'all-time' ? 'All-time Leaderboard'
            : rankingPeriod === 'weekly' ? 'Weekly Leaderboard'
            : 'Daily Leaderboard'}
        </h2>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 border-2 border-black dark:border-white rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {language === 'fr' ? 'Aucun projet pour le moment.' : 'No projects yet.'}
          </p>
          <Link
            to="/studio/submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-neo-violet text-white font-bold rounded-md hover:bg-neo-violet/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {language === 'fr' ? 'Soumettre le premier' : 'Submit the first one'}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`bg-white dark:bg-gray-600 border-2 rounded-lg p-6 shadow-neo dark:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all relative ${
                project.is_boosted 
                  ? 'border-neo-yellow dark:border-neo-yellow bg-neo-yellow/10 dark:bg-neo-yellow/20' 
                  : 'border-black dark:border-white'
              }`}
            >
              {/* Boost Badge */}
              {project.is_boosted && (
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-neo-yellow border-2 border-black rounded-md text-xs font-bold">
                  <Crown className="w-3 h-3" />
                  {language === 'fr' ? 'BOOSTÉ' : 'BOOSTED'}
                </div>
              )}

              {/* Project Header */}
              <div className="flex items-start justify-between mb-4 gap-4">
                {(() => {
                  const imageUrl = getProjectImageUrl(project);
                  return imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={`${project.name} ${project.logo_url ? 'logo' : project.screenshot_url ? 'screenshot' : 'favicon'}`} 
                      className="w-16 h-16 object-contain border-2 border-black dark:border-white rounded-md flex-shrink-0"
                      onError={(e) => {
                        // Fallback to favicon if image fails to load
                        if (project.logo_url || project.screenshot_url) {
                          const target = e.target as HTMLImageElement;
                          target.src = getProjectImageUrl({ url: project.url });
                        }
                      }}
                    />
                  ) : null;
                })()}
                <div className="flex-1">
                  <h3 className="font-display font-bold text-xl dark:text-white mb-1 line-clamp-2">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-500 text-xs font-bold rounded border border-gray-300 dark:border-white">
                      {getCategoryLabel(project.category)}
                    </span>
                    {project.user_owns && !project.is_boosted && (
                      <button
                        onClick={() => handleBoost(project.id)}
                        disabled={boosting === project.id || credits < 100}
                        className="flex items-center gap-1 px-2 py-1 bg-neo-yellow border-2 border-black rounded-md text-xs font-bold hover:bg-neo-yellow/90 transition-colors disabled:opacity-50"
                      >
                        <Zap className="w-3 h-3" />
                        {language === 'fr' ? 'Boost (100)' : 'Boost (100)'}
                      </button>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleVote(project.id)}
                  disabled={voting === project.id || !user}
                  className={`flex items-center gap-1 px-3 py-1 border-2 rounded-md font-bold text-sm transition-colors ${
                    project.user_voted
                      ? 'bg-neo-violet text-white border-neo-violet'
                      : 'bg-white dark:bg-gray-600 border-black dark:border-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${project.user_voted ? 'fill-current' : ''}`} />
                  {project.votes_count}
                </button>
              </div>

              {/* Description */}
              {project.description && (
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-dashed border-gray-300 dark:border-white">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-bold text-neo-violet hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  {language === 'fr' ? 'Visiter' : 'Visit'}
                </a>
                <Link
                  to={`/studio/project/${project.slug || project.id}`}
                  className="flex items-center gap-1 text-sm font-bold text-black dark:text-white hover:text-neo-violet transition-colors"
                >
                  {language === 'fr' ? 'Détails' : 'Details'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

