
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserState, User } from '../types';
import { supabase } from '../lib/supabaseClient';
import { SITE_CONFIG } from '../constants';

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => {
      // Initialiser le dark mode avec la préférence stockée ou système
      let initialDarkMode = false;
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('simpleplate-storage');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            initialDarkMode = parsed.state?.isDarkMode ?? false;
          } catch (e) {
            // Si erreur de parsing, utiliser la préférence système
            initialDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
          }
        } else {
          // Si pas de préférence stockée, utiliser la préférence système
          initialDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
      }

      return {
        user: null, 
        credits: 0,
        creditsFree: 0,
        creditsPaid: 0,
        isPro: false,
        isDarkMode: initialDarkMode,
        freeCreditsResetDate: null,

      login: async (user: User) => {
        set({ user });
        
        // Vérifier et recharger les crédits gratuits hebdomadaires (pour TOUS les utilisateurs, y compris PRO)
        try {
          await supabase.rpc('check_weekly_refill', { p_user_id: user.id });
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
          .select('credits, credits_free, credits_paid, is_pro, free_credits_reset_date, created_at, username')
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
          const freeCreditsResetDate = data?.free_credits_reset_date ? new Date(data.free_credits_reset_date) : null;
          
          // Update user with username if available
          const updatedUser = { ...user, username: data?.username || undefined };
          
          set({ 
            user: updatedUser,
            credits: creditsFromDB,
            creditsFree: creditsFreeFromDB,
            creditsPaid: creditsPaidFromDB,
            isPro: isProFromDB,
            freeCreditsResetDate: freeCreditsResetDate
          });
          
          // Forcer la mise à jour du localStorage aussi
          const currentStorage = JSON.parse(localStorage.getItem('simpleplate-storage') || '{}');
          currentStorage.state = {
            ...currentStorage.state,
            credits: creditsFromDB,
            isPro: isProFromDB,
            user: updatedUser
          };
          localStorage.setItem('simpleplate-storage', JSON.stringify(currentStorage));
        }
      },
      
      refreshCredits: async () => {
        const { user } = get();
        if (!user) return;
        
        // Vérifier et recharger les crédits gratuits hebdomadaires (pour TOUS les utilisateurs, y compris PRO)
        try {
          await supabase.rpc('check_weekly_refill', { p_user_id: user.id });
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
          .select('credits, credits_free, credits_paid, is_pro, free_credits_reset_date, created_at, username')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          const creditsFromDB = data.credits ?? 0;
          const creditsFreeFromDB = data.credits_free ?? 0;
          const creditsPaidFromDB = data.credits_paid ?? 0;
          const isProFromDB = data.is_pro ?? false;
          const freeCreditsResetDate = data.free_credits_reset_date ? new Date(data.free_credits_reset_date) : null;
          
          // Update user with username if available
          const currentUser = get().user;
          if (currentUser) {
            const updatedUser = { ...currentUser, username: data?.username || undefined };
            set({ 
              user: updatedUser,
              credits: creditsFromDB,
              creditsFree: creditsFreeFromDB,
              creditsPaid: creditsPaidFromDB,
              isPro: isProFromDB,
              freeCreditsResetDate: freeCreditsResetDate
            });
          } else {
            set({ 
              credits: creditsFromDB,
              creditsFree: creditsFreeFromDB,
              creditsPaid: creditsPaidFromDB,
              isPro: isProFromDB,
              freeCreditsResetDate: freeCreditsResetDate
            });
          }
          
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
          // The RPC signature can vary depending on your Supabase setup.
          // Try the most common parameter names used elsewhere in this codebase (p_user_id),
          // and fall back to the previous naming.
          const attempts: Array<Record<string, any>> = [
            { p_user_id: user.id, p_amount: amount },
            { p_user_id: user.id, amount: amount },
            { user_id_param: user.id, amount_param: amount },
            { user_id: user.id, amount: amount },
          ];

          let lastError: any = null;
          let data: any = null;
          let error: any = null;

          for (const params of attempts) {
            const res = await supabase.rpc('deduct_credits', params);
            data = res.data;
            error = res.error;
            if (!error) break;
            lastError = error;
          }
          
          if (error) {
            console.error("Erreur déduction crédits:", lastError || error);
            // En cas d'erreur, rafraîchir depuis la DB
            await get().refreshCredits();
            return false;
          }
          
          // Some implementations return a JSON object with success + balances,
          // others return the updated profile row or just a boolean.
          if (data?.success === true) {
            if (typeof data.credits_free === 'number' || typeof data.credits_paid === 'number' || typeof data.credits_total === 'number') {
              set({ 
                credits: data.credits_total ?? ((data.credits_free || 0) + (data.credits_paid || 0)),
                creditsFree: data.credits_free ?? 0,
                creditsPaid: data.credits_paid ?? 0
              });
            } else {
              // Unknown shape: force refresh
              await get().refreshCredits();
            }
            return true;
          }

          // If the RPC returned something truthy but without "success", assume it worked and refresh.
          if (data) {
            await get().refreshCredits();
            return true;
          }

          // Pas assez de crédits côté serveur / réponse vide
          await get().refreshCredits();
          return false;
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
      },

      updateUsername: async (username: string) => {
        const { user } = get();
        if (!user) throw new Error('User must be logged in');

        const { data, error } = await supabase.rpc('update_username', {
          p_user_id: user.id,
          p_username: username,
        });

        if (error) {
          console.error('Error updating username:', error);
          throw error;
        }

        if (data && data.success) {
          // Update user in store
          const updatedUser = { ...user, username: data.username };
          set({ user: updatedUser });
          
          // Update localStorage
          const currentStorage = JSON.parse(localStorage.getItem('simpleplate-storage') || '{}');
          currentStorage.state = {
            ...currentStorage.state,
            user: updatedUser
          };
          localStorage.setItem('simpleplate-storage', JSON.stringify(currentStorage));
        } else {
          throw new Error(data?.error || 'Failed to update username');
        }
      },
    }
  },
  {
    name: 'simpleplate-storage',
    storage: createJSONStorage(() => localStorage),
  }
)
);
