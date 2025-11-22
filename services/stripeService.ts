import { supabase } from '../lib/supabaseClient';

// Créer une Checkout Session Stripe avec email pré-rempli et Apple Pay désactivé
export const createCheckoutSession = async (
  priceId: string,
  amount: number,
  userEmail: string
): Promise<string> => {
  try {
    // Appeler une Edge Function Supabase qui créera la session Stripe
    // (Plus sécurisé que d'exposer la clé secrète côté front)
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        priceId,
        amount,
        customerEmail: userEmail,
      },
    });

    if (error) throw error;
    if (!data?.url) throw new Error('Aucune URL de checkout retournée');

    return data.url;
  } catch (err: any) {
    console.error('Erreur création checkout:', err);
    throw new Error('Impossible de créer la session de paiement');
  }
};

