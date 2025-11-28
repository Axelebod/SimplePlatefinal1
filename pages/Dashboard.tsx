
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { SITE_CONFIG } from '../constants';
import { supabase } from '../lib/supabaseClient';
import { Zap, Crown, CreditCard, Settings, LogOut, TrendingUp, AlertTriangle, Package, Clock } from 'lucide-react';
import { getRecentActivity } from '../services/toolHistoryService';
import { ToolResult } from '../types/toolHistory';
import { tools } from '../tools-config';

export const Dashboard: React.FC = () => {
  const { user, credits, isPro, logout, togglePro, refreshCredits } = useUserStore();
  const navigate = useNavigate();
  const [nextResetDate, setNextResetDate] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [recentActivity, setRecentActivity] = useState<ToolResult[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);

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
        .select('last_credit_reset, created_at')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        // Calculer la prochaine date de recharge (1 mois après le dernier reset ou la création)
        const lastReset = data.last_credit_reset 
          ? new Date(data.last_credit_reset) 
          : new Date(data.created_at);
        
        const nextReset = new Date(lastReset);
        nextReset.setMonth(nextReset.getMonth() + 1);
        
        setNextResetDate(nextReset);
      }
    } catch (err) {
      console.error('Erreur chargement date reset:', err);
    }
  };

  useEffect(() => {
    if (user) {
      loadRecentActivity();
    }
  }, [user]);

  const loadRecentActivity = async () => {
    if (!user) return;
    setActivityLoading(true);
    const data = await getRecentActivity(6);
    setRecentActivity(data);
    setActivityLoading(false);
  };

  // Timer en temps réel
  useEffect(() => {
    if (!nextResetDate) return;

    const updateTimer = () => {
      const now = new Date();
      const diff = nextResetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Recharge disponible !');
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
        setTimeRemaining(`${days}j ${hours}h ${minutes}m`);
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

  const handleManageSubscription = () => {
      // Redirection vers le portail client Stripe
      const portalUrl = SITE_CONFIG.stripe.customerPortal;
      if (portalUrl && !portalUrl.includes('votre_portail')) {
          window.location.href = portalUrl;
      } else {
          alert("Le portail client Stripe n'est pas encore configuré. Veuillez configurer REACT_APP_STRIPE_PORTAL dans vos variables d'environnement.");
      }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold dark:text-white mb-2">
                Mon Espace
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
                Heureux de vous revoir, <span className="font-bold text-black dark:text-white">{user.email.split('@')[0]}</span>.
            </p>
        </div>
        <button 
            onClick={() => { logout(); navigate('/'); }}
            className="px-4 py-2 border-2 border-black dark:border-gray-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 font-bold text-sm flex items-center gap-2 transition-colors"
        >
            <LogOut className="w-4 h-4" /> Se déconnecter
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
                    <Zap className="w-4 h-4" /> Solde Disponible
                </div>
                <div className="font-display text-6xl font-bold mb-6 dark:text-white">
                    {credits}
                </div>
                
                <div className="flex gap-3">
                    <Link 
                        to="/pricing"
                        className="flex-1 py-3 bg-neo-black dark:bg-white text-white dark:text-black font-bold text-center rounded-md shadow-[3px_3px_0px_0px_#fdba74] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                    >
                        Acheter des crédits
                    </Link>
                </div>
                <div className="mt-4 space-y-2">
                    <p className="text-xs text-gray-400">
                        {isPro ? "Abonnement PRO actif." : "Passez PRO pour obtenir 100 crédits/mois."}
                    </p>
                    {nextResetDate && (
                        <div className="flex items-center gap-2 text-xs bg-gray-100 dark:bg-gray-500 px-3 py-2 rounded-md border border-gray-300 dark:border-white">
                            <Clock className="w-3 h-3 text-neo-orange" />
                            <span className="text-gray-600 dark:text-gray-300">
                                <span className="font-bold">Prochaine recharge :</span> {timeRemaining}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 ml-auto">
                                ({isPro ? '100' : '5'} crédits)
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* CARD 2 : ABONNEMENT */}
        <div className={`border-2 border-black dark:border-white rounded-lg p-6 shadow-neo dark:shadow-[2px_2px_0px_0px_#fff] relative overflow-hidden ${isPro ? 'bg-neo-violet text-black' : 'bg-white dark:bg-gray-600 dark:text-white'}`}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Crown className="w-32 h-32 text-white dark:text-gray-500" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 font-bold uppercase tracking-wider text-xs opacity-70">
                    <Crown className="w-4 h-4" /> Mon Plan
                </div>
                <div className="font-display text-6xl font-bold mb-2">
                    {isPro ? "PRO" : "Gratuit"}
                </div>
                <div className="mb-6 text-sm font-medium opacity-80">
                    {isPro ? "Abonnement actif." : "Fonctionnalités limitées."}
                </div>

                <div className="flex gap-3">
                    {isPro ? (
                        <button 
                            onClick={handleManageSubscription}
                            className="flex-1 py-3 bg-white text-black font-bold border-2 border-black rounded-md hover:bg-gray-100 transition-colors"
                        >
                            Gérer l'abonnement / Résilier
                        </button>
                    ) : (
                        <Link 
                            to="/pricing"
                            className="flex-1 py-3 bg-neo-black dark:bg-white text-white dark:text-black font-bold text-center rounded-md shadow-[3px_3px_0px_0px_#fff] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                        >
                            Passer PRO (9.99€)
                        </Link>
                    )}
                </div>
            </div>
        </div>

      </div>

      {/* SECTION HISTORIQUE / STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLONNE GAUCHE : INFO COMPTE */}
          <div className="bg-gray-50 dark:bg-gray-500 border-2 border-black dark:border-white rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 dark:text-white">
                  <Settings className="w-5 h-5" /> Détails du compte
              </h3>
              <ul className="space-y-3 text-sm">
                  <li className="flex justify-between dark:text-gray-300">
                      <span className="text-gray-500">Email</span>
                      <span className="font-bold">{user.email}</span>
                  </li>
                  <li className="flex justify-between dark:text-gray-300">
                      <span className="text-gray-500">ID Membre</span>
                      <span className="font-mono text-xs bg-gray-200 dark:bg-gray-500 px-2 py-0.5 rounded">#{user.id.substring(0, 8)}</span>
                  </li>
              </ul>
          </div>

        {/* COLONNE DROITE : STATS */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-600 border-2 border-black dark:border-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2 dark:text-white">
                  <TrendingUp className="w-5 h-5" /> Activité récente
              </h3>
              <button
                onClick={loadRecentActivity}
                className="text-xs font-bold px-3 py-1 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Actualiser
              </button>
            </div>

            {activityLoading ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Chargement de vos dernières actions...</p>
            ) : recentActivity.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Aucune sauvegarde récente. Utilisez un outil et enregistrez le résultat pour voir l'activité ici.
              </p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity) => {
                  const toolMeta = tools.find(t => t.id === activity.tool_id);
                  return (
                    <div
                      key={activity.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-gray-200 dark:border-gray-500 rounded-lg p-4"
                    >
                      <div>
                        <p className="font-bold text-sm dark:text-white">{toolMeta?.title || activity.tool_id}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.created_at).toLocaleString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-gray-500 dark:text-gray-300">
                          -{activity.credits_used} crédit{activity.credits_used > 1 ? 's' : ''}
                        </span>
                        {toolMeta && (
                          <Link
                            to={`/tool/${toolMeta.slug || toolMeta.id}`}
                            className="px-3 py-1 bg-neo-black dark:bg-white text-white dark:text-black rounded-md font-bold text-xs hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                          >
                            Ouvrir
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-md flex gap-4 items-start">
          <AlertTriangle className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />
          <div>
              <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm">Besoin d'une facture ?</h4>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Les factures sont envoyées automatiquement par Stripe à votre adresse email lors de chaque paiement. Vérifiez vos spams ou contactez le support.
              </p>
          </div>
      </div>

    </div>
  );
};
