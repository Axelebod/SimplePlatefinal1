
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserState, User } from '../types';
import { supabase } from '../lib/supabaseClient';
import { SITE_CONFIG } from '../constants';

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null, 
      credits: 0,
      creditsFree: 0,
      creditsPaid: 0,
      isPro: false,
      isDarkMode: false,

      login: async (user: User) => {
        set({ user });
        
        // Vérifier et recharger les crédits gratuits hebdomadaires (pour TOUS les utilisateurs, y compris PRO)
        try {
          await supabase.rpc('reset_weekly_free_credits', { p_user_id: user.id });
        } catch (err) {
          console.warn("Erreur lors de la vérification du reset hebdomadaire:", err);
        }
        
        // Vérifier et recharger les crédits PRO mensuels si nécessaire (seulement pour PRO)
        try {
          await supabase.rpc('reset_pro_monthly_credits', { p_user_id: user.id });
        } catch (err) {
          console.warn("Erreur lors de la vérification du reset mensuel PRO:", err);
        }
        
        // FORCER la synchronisation depuis Supabase (ignore localStorage)
        const { data, error } = await supabase
          .from('profiles')
          .select('credits, credits_free, credits_paid, is_pro, free_credits_reset_date, created_at')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Erreur fetch profil:", error);
          set({ credits: 0, creditsFree: 0, creditsPaid: 0, isPro: false });
        } else {
          // Forcer la mise à jour même si localStorage a une autre valeur
          const creditsFromDB = data?.credits ?? 0;
          const creditsFreeFromDB = data?.credits_free ?? 0;
          const creditsPaidFromDB = data?.credits_paid ?? 0;
          const isProFromDB = data?.is_pro ?? false;
          
          set({ 
            credits: creditsFromDB,
            creditsFree: creditsFreeFromDB,
            creditsPaid: creditsPaidFromDB,
            isPro: isProFromDB
          });
          
          // Forcer la mise à jour du localStorage aussi
          const currentStorage = JSON.parse(localStorage.getItem('simpleplate-storage') || '{}');
          currentStorage.state = {
            ...currentStorage.state,
            credits: creditsFromDB,
            isPro: isProFromDB,
            user: user
          };
          localStorage.setItem('simpleplate-storage', JSON.stringify(currentStorage));
        }
      },
      
      refreshCredits: async () => {
        const { user } = get();
        if (!user) return;
        
        // Vérifier et recharger les crédits gratuits hebdomadaires (pour TOUS les utilisateurs, y compris PRO)
        try {
          await supabase.rpc('reset_weekly_free_credits', { p_user_id: user.id });
        } catch (err) {
          console.warn("Erreur lors de la vérification du reset hebdomadaire:", err);
        }
        
        // Vérifier et recharger les crédits PRO mensuels si nécessaire (seulement pour PRO)
        try {
          await supabase.rpc('reset_pro_monthly_credits', { p_user_id: user.id });
        } catch (err) {
          console.warn("Erreur lors de la vérification du reset mensuel PRO:", err);
        }
        
        // Rafraîchir les crédits depuis Supabase
        const { data, error } = await supabase
          .from('profiles')
          .select('credits, credits_free, credits_paid, is_pro, free_credits_reset_date, created_at')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          const creditsFromDB = data.credits ?? 0;
          const creditsFreeFromDB = data.credits_free ?? 0;
          const creditsPaidFromDB = data.credits_paid ?? 0;
          const isProFromDB = data.is_pro ?? false;
          
          set({ 
            credits: creditsFromDB,
            creditsFree: creditsFreeFromDB,
            creditsPaid: creditsPaidFromDB,
            isPro: isProFromDB
          });
          
          // Forcer la mise à jour du localStorage aussi
          const currentStorage = JSON.parse(localStorage.getItem('simpleplate-storage') || '{}');
          currentStorage.state = {
            ...currentStorage.state,
            credits: creditsFromDB,
            creditsFree: creditsFreeFromDB,
            creditsPaid: creditsPaidFromDB,
            isPro: isProFromDB,
            user: user
          };
          localStorage.setItem('simpleplate-storage', JSON.stringify(currentStorage));
        }
      },

      logout: async () => {
        set({ user: null, credits: 0, creditsFree: 0, creditsPaid: 0, isPro: false });
        await supabase.auth.signOut();
        localStorage.removeItem('simpleplate-storage'); // Nettoyage complet
      },

      deductCredits: async (amount: number) => {
        const { user, credits } = get();
        
        if (!user) {
          return false;
        }
        
        // Vérification locale rapide (pour UX)
        if (credits < amount) {
          return false;
        }
        
        // Mise à jour optimiste (UI réactive)
        const optimisticBalance = credits - amount;
        set({ credits: optimisticBalance });
        
        // Déduction atomique côté serveur (évite les race conditions)
        try {
          const { data, error } = await supabase.rpc('deduct_credits', {
            user_id_param: user.id,
            amount_param: amount
          });
          
          if (error) {
            console.error("Erreur déduction crédits:", error);
            // En cas d'erreur, rafraîchir depuis la DB
            await get().refreshCredits();
            return false;
          }
          
          if (data && data.success) {
            // Mise à jour avec les vraies valeurs depuis la DB
            set({ 
              credits: data.credits_total || (data.credits_free + data.credits_paid),
              creditsFree: data.credits_free || 0,
              creditsPaid: data.credits_paid || 0
            });
            return true;
          } else {
            // Pas assez de crédits côté serveur
            await get().refreshCredits();
            return false;
          }
        } catch (err: any) {
          console.error("Erreur déduction crédits:", err);
          // En cas d'erreur, rafraîchir depuis la DB
          await get().refreshCredits();
          return false;
        }
      },

      buyCredits: async (amount: number) => {
        const { user } = get();
        
        if (!user || !user.email) {
          alert("Vous devez être connecté pour acheter des crédits.");
          return;
        }

        // Mapping amount → price ID
        const priceMap: Record<number, string> = {
          1: process.env.REACT_APP_STRIPE_PRICE_PACK_1 || '',
          50: process.env.REACT_APP_STRIPE_PRICE_PACK_50 || '',
          100: process.env.REACT_APP_STRIPE_PACK_100 || '',
          500: process.env.REACT_APP_STRIPE_PACK_500 || '',
        };

        const priceId = priceMap[amount];
        
        if (!priceId) {
          alert("Configuration manquante pour ce pack.");
          return;
        }

        try {
          // Créer une Checkout Session avec email pré-rempli (celui du compte)
          const response = await supabase.functions.invoke('create-checkout-session', {
            body: {
              priceId,
              amount,
              customerEmail: user.email, // Email du compte connecté
              userId: user.id, // Passer l'user_id pour le webhook
            },
          });

          // Gérer les erreurs de manière plus robuste
          if (response.error) {
            console.error('Erreur Supabase function:', response.error);
            throw new Error(response.error.message || 'Erreur lors de la création de la session');
          }

          if (!response.data?.url) {
            throw new Error('Aucune URL retournée par le serveur');
          }

          // Redirection vers Stripe Checkout
          window.location.href = response.data.url;
        } catch (err: any) {
          console.error('Erreur checkout:', err);
          const errorMessage = err.message || 'Erreur inconnue';
          alert(`Erreur lors de la création du paiement: ${errorMessage}. Réessayez.`);
        }
      },

      refillCredits: () => {
        // Fonction Debug
        set({ credits: 20 });
      },

      togglePro: async () => {
        const { user } = get();
        
        if (!user || !user.email) {
          alert("Vous devez être connecté pour passer PRO.");
          return;
        }

        const priceId = process.env.REACT_APP_STRIPE_PRICE_PRO_SUBSCRIPTION || '';
        
        if (!priceId) {
          alert("Configuration manquante pour l'abonnement PRO.");
          return;
        }

        try {
          // Créer une Checkout Session pour l'abonnement avec email pré-rempli
          const response = await supabase.functions.invoke('create-checkout-session', {
            body: {
              priceId,
              amount: 999, // Code spécial pour abonnement
              customerEmail: user.email, // Email du compte connecté
              userId: user.id, // Passer l'user_id pour le webhook
            },
          });

          // Gérer les erreurs de manière plus robuste
          if (response.error) {
            console.error('Erreur Supabase function:', response.error);
            throw new Error(response.error.message || 'Erreur lors de la création de la session');
          }

          if (!response.data?.url) {
            throw new Error('Aucune URL retournée par le serveur');
          }

          // Redirection vers Stripe Checkout
          window.location.href = response.data.url;
        } catch (err: any) {
          console.error('Erreur checkout PRO:', err);
          const errorMessage = err.message || 'Erreur inconnue';
          alert(`Erreur lors de la création du paiement: ${errorMessage}. Réessayez.`);
        }
      },


      toggleDarkMode: () => {
          set((state) => {
              const newDarkMode = !state.isDarkMode;
              // Appliquer immédiatement la classe sur <html>
              const root = window.document.documentElement;
              if (newDarkMode) {
                  root.classList.add('dark');
              } else {
                  root.classList.remove('dark');
              }
              return { isDarkMode: newDarkMode };
          });
      }
    }),
    {
      name: 'simpleplate-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
