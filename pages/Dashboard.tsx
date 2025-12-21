import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { SITE_CONFIG } from '../constants';
import { supabase } from '../lib/supabaseClient';
import { Zap, CreditCard, Settings, LogOut, AlertTriangle, Package, Clock, Rocket, ExternalLink, User, Edit2, Check, X, Trash2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useSEO } from '../hooks/useSEO';
import { getUserProjects, deleteProject } from '../services/studioService';
import type { Project } from '../types/studio';
import { useToast } from '../contexts/ToastContext';
import { getProjectImageUrl } from '../utils/faviconUtils';
import { ConfirmModal } from '../components/ConfirmModal';

export const Dashboard: React.FC = () => {
  const { user, credits, logout, refreshCredits, updateUsername } = useUserStore();
  const [isEditingUsername, setIsEditingUsername] = React.useState(false);
  const [newUsername, setNewUsername] = React.useState('');
  const [usernameError, setUsernameError] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { success, error: showError, warning, info } = useToast();
  const [nextResetDate, setNextResetDate] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  useSEO({
    title: language === 'fr' ? 'Tableau de bord | SimplePlate AI' : 'Dashboard | SimplePlate AI',
    description: language === 'fr'
      ? 'Gérez vos crédits, consultez votre historique d\'outils et vos projets SimplePlate Studio.'
      : 'Manage your credits, view your tools history and SimplePlate Studio projects.',
    language,
    keywords: language === 'fr'
      ? ['tableau de bord', 'crédits', 'historique', 'projets', 'SimplePlate Studio']
      : ['dashboard', 'credits', 'history', 'projects', 'SimplePlate Studio'],
    noindex: true, // Private page
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      // Rafraîchir les crédits depuis Supabase à chaque chargement
      refreshCredits();
      // Charger la date de prochaine recharge
      loadNextResetDate();
    }
  }, [user, navigate, refreshCredits]);

  const loadNextResetDate = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('last_weekly_refill, created_at')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        // Calculer la prochaine date de recharge hebdomadaire (7 jours après le dernier reset ou la création)
        const lastReset = data.last_weekly_refill 
          ? new Date(data.last_weekly_refill) 
          : new Date(data.created_at);
        
        const nextReset = new Date(lastReset);
        nextReset.setDate(nextReset.getDate() + 7); // 7 jours pour le reset hebdomadaire
        
        setNextResetDate(nextReset);
      }
    } catch (err) {
      console.error('Erreur chargement date reset:', err);
    }
  };

  useEffect(() => {
    if (user) {
      loadMyProjects();
    }
  }, [user]);

  const loadMyProjects = async () => {
    if (!user) return;
    setProjectsLoading(true);
    try {
      const data = await getUserProjects(user.id);
      setMyProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setProjectsLoading(false);
    }
  };

  // Timer en temps réel
  useEffect(() => {
    if (!nextResetDate) return;

    const updateTimer = () => {
      const now = new Date();
      const diff = nextResetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining(t('dashboard.resetAvailable'));
        // Recharger les crédits si le timer est écoulé
        refreshCredits();
        loadNextResetDate();
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeRemaining(language === 'fr' ? `${days}j ${hours}h ${minutes}m` : `${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [nextResetDate, refreshCredits]);

  if (!user) return null;

  // Fonction supprimée - plus d'abonnement PRO
  const _handleManageSubscription = () => {
      // Redirection vers le portail client Stripe
      const portalUrl = SITE_CONFIG.stripe.customerPortal;
      if (portalUrl && !portalUrl.includes('votre_portail')) {
          window.location.href = portalUrl;
      } else {
          warning(language === 'fr' 
            ? "Le portail client Stripe n'est pas encore configuré. Veuillez configurer REACT_APP_STRIPE_PORTAL dans vos variables d'environnement."
            : "Stripe customer portal is not yet configured. Please configure REACT_APP_STRIPE_PORTAL in your environment variables.");
      }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold dark:text-white mb-2">
                {t('dashboard.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
                {t('dashboard.welcome')},{' '}
                <span className="font-bold text-black dark:text-white">{user.username || user.email.split('@')[0]}</span>.
            </p>
        </div>
        <button 
            onClick={() => { logout(); navigate('/'); }}
            className="px-4 py-2 border-2 border-black dark:border-gray-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 font-bold text-sm flex items-center gap-2 transition-colors"
        >
            <LogOut className="w-4 h-4" /> {t('nav.logout')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        
        {/* CARD 1 : CREDITS */}
        <div className="bg-white dark:bg-gray-600 border-2 border-black dark:border-white rounded-lg p-6 shadow-neo dark:shadow-[2px_2px_0px_0px_#fff] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap className="w-32 h-32 text-neo-orange" />
            </div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-xs">
                    <Zap className="w-4 h-4" /> {t('dashboard.credits')}
                </div>
                <div className="font-display text-6xl font-bold mb-6 dark:text-white">
                    {credits}
                </div>
                
                <div className="flex gap-3">
                    <Link 
                        to="/pricing"
                        className="flex-1 py-3 bg-neo-black dark:bg-white text-white dark:text-black font-bold text-center rounded-md shadow-[3px_3px_0px_0px_#fdba74] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                    >
                        {t('dashboard.buyCredits')}
                    </Link>
                </div>
                <div className="mt-4 space-y-2">
                    <p className="text-xs text-gray-400">
                        {t('dashboard.creditsInfo')}
                    </p>
                    {nextResetDate && (
                        <div className="flex items-center gap-2 text-xs bg-gray-100 dark:bg-gray-500 px-3 py-2 rounded-md border border-gray-300 dark:border-white">
                            <Clock className="w-3 h-3 text-neo-orange" />
                            <span className="text-gray-600 dark:text-gray-300">
                                <span className="font-bold">{t('dashboard.nextReset')}:</span> {timeRemaining}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 ml-auto">
                                (5 {t('tools.credits')})
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>


      </div>

      {/* SECTION PHASE 2: MY PROJECTS */}
      {myProjects.length > 0 && (
        <div className="mb-12 bg-white dark:bg-gray-600 border-2 border-black dark:border-white rounded-lg p-6 shadow-neo dark:shadow-[2px_2px_0px_0px_#fff]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl font-bold dark:text-white flex items-center gap-2">
              <Rocket className="w-6 h-6 text-neo-violet" />
              {language === 'fr' ? 'Mes Projets (Studio)' : 'My Projects (Studio)'}
            </h2>
            <Link
              to="/studio"
              className="text-sm font-bold text-neo-violet hover:underline"
            >
              {language === 'fr' ? 'Voir le Studio →' : 'View Studio →'}
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myProjects.slice(0, 4).map((project) => (
              <div
                key={project.id}
                className="border-2 border-black dark:border-white rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors relative"
              >
                <div className="flex items-start justify-between mb-2 gap-3">
                  {(() => {
                    const imageUrl = getProjectImageUrl(project);
                    return imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={`${project.logo_url ? 'Logo' : project.screenshot_url ? 'Capture d\'écran' : 'Favicon'} de ${project.name}`}
                        className="w-12 h-12 object-contain border-2 border-black dark:border-white rounded-md flex-shrink-0"
                        loading="lazy"
                        onError={(e) => {
                          if (project.logo_url || project.screenshot_url) {
                            const target = e.target as HTMLImageElement;
                            target.src = getProjectImageUrl({ url: project.url });
                          }
                        }}
                      />
                    ) : null;
                  })()}
                  <Link
                    to={`/studio/project/${project.slug || project.id}`}
                    className="flex-1"
                  >
                    <h3 className="font-bold dark:text-white line-clamp-1 hover:underline">{project.name}</h3>
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded">
                      {project.votes_count} {language === 'fr' ? 'votes' : 'votes'}
                    </span>
                    <button
                      onClick={() => setShowDeleteConfirm(project.id)}
                      disabled={deletingProjectId === project.id}
                      className="p-1.5 text-neo-red hover:bg-neo-red/10 rounded transition-colors disabled:opacity-50"
                      title={language === 'fr' ? 'Supprimer le projet' : 'Delete project'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-neo-violet hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  {project.url}
                </a>
                {!project.is_audit_unlocked && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {language === 'fr' 
                      ? `💡 ${credits >= 50 ? 'Débloquez l\'audit IA (50 crédits)' : 'Besoin de 50 crédits pour l\'audit'}`
                      : `💡 ${credits >= 50 ? 'Unlock AI audit (50 credits)' : 'Need 50 credits for audit'}`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION INFO COMPTE */}
      <div className="grid grid-cols-1 gap-8">
          {/* INFO COMPTE */}
          <div className="bg-gray-50 dark:bg-gray-500 border-2 border-black dark:border-white rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 dark:text-white">
                  <Settings className="w-5 h-5" /> {t('dashboard.accountDetails')}
              </h3>
              <ul className="space-y-3 text-sm">
                  <li className="flex justify-between items-center dark:text-gray-300">
                      <span className="text-gray-500 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {language === 'fr' ? 'Pseudo' : 'Username'}
                      </span>
                      {!isEditingUsername ? (
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{user.username || (language === 'fr' ? 'Non défini' : 'Not set')}</span>
                          <button
                            onClick={() => {
                              setIsEditingUsername(true);
                              setNewUsername(user.username || '');
                              setUsernameError(null);
                            }}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-400 rounded transition-colors"
                            title={language === 'fr' ? 'Modifier le pseudo' : 'Edit username'}
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => {
                              setNewUsername(e.target.value);
                              setUsernameError(null);
                            }}
                            placeholder={language === 'fr' ? 'Votre pseudo' : 'Your username'}
                            className="px-2 py-1 border-2 border-black dark:border-white rounded text-sm font-bold bg-white dark:bg-gray-600 dark:text-white max-w-[120px]"
                            maxLength={20}
                            pattern="[a-z0-9_-]+"
                          />
                          <button
                            onClick={async () => {
                              if (!newUsername.trim()) {
                                setUsernameError(language === 'fr' ? 'Le pseudo ne peut pas être vide' : 'Username cannot be empty');
                                return;
                              }
                              try {
                                await updateUsername(newUsername.trim());
                                setIsEditingUsername(false);
                                setUsernameError(null);
                                await refreshCredits();
                              } catch (error: any) {
                                setUsernameError(error.message || (language === 'fr' ? 'Erreur lors de la mise à jour' : 'Error updating'));
                              }
                            }}
                            className="p-1 hover:bg-green-200 dark:hover:bg-green-600 rounded transition-colors"
                            title={language === 'fr' ? 'Valider' : 'Save'}
                          >
                            <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                          </button>
                          <button
                            onClick={() => {
                              setIsEditingUsername(false);
                              setNewUsername('');
                              setUsernameError(null);
                            }}
                            className="p-1 hover:bg-red-200 dark:hover:bg-red-600 rounded transition-colors"
                            title={language === 'fr' ? 'Annuler' : 'Cancel'}
                          >
                            <X className="w-3 h-3 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      )}
                  </li>
                  {usernameError && (
                    <li className="text-xs text-red-600 dark:text-red-400 font-bold">{usernameError}</li>
                  )}
                  <li className="flex justify-between dark:text-gray-300">
                      <span className="text-gray-500">{t('contact.email')}</span>
                      <span className="font-bold">{user.email}</span>
                  </li>
                  <li className="flex justify-between dark:text-gray-300">
                      <span className="text-gray-500">{t('dashboard.memberId')}</span>
                      <span className="font-mono text-xs bg-gray-200 dark:bg-gray-500 px-2 py-0.5 rounded">#{user.id.substring(0, 8)}</span>
                  </li>
              </ul>
          </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-md flex gap-4 items-start">
          <AlertTriangle className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />
          <div>
              <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm">{t('dashboard.needInvoiceTitle')}</h4>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {t('dashboard.needInvoiceBody')}
              </p>
          </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm !== null}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={async () => {
          const projectId = showDeleteConfirm;
          if (!projectId) return;
          setShowDeleteConfirm(null);
          setDeletingProjectId(projectId);
          try {
            const result = await deleteProject(projectId);
            if (result.success) {
              setMyProjects(myProjects.filter(p => p.id !== projectId));
              success(language === 'fr' ? 'Projet supprimé avec succès' : 'Project deleted successfully');
            } else {
              showError(result.message || (language === 'fr' ? 'Erreur lors de la suppression' : 'Error deleting project'));
            }
          } catch (error) {
            console.error('Error deleting project:', error);
            showError(language === 'fr' ? 'Erreur lors de la suppression' : 'Error deleting project');
          } finally {
            setDeletingProjectId(null);
          }
        }}
        title={language === 'fr' ? 'Supprimer le projet' : 'Delete Project'}
        message={language === 'fr' 
          ? 'Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.'
          : 'Are you sure you want to delete this project? This action cannot be undone.'}
        confirmText={language === 'fr' ? 'Supprimer' : 'Delete'}
        cancelText={language === 'fr' ? 'Annuler' : 'Cancel'}
        variant="danger"
        isLoading={deletingProjectId === showDeleteConfirm}
      />
    </div>
  );
};
