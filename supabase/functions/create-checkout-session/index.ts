import Stripe from 'https://esm.sh/stripe@15.9.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY') ?? '';
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

if (!stripeSecret) {
  console.error('STRIPE_SECRET_KEY missing');
}

const stripe = new Stripe(stripeSecret, {
  apiVersion: '2024-06-20',
});

Deno.serve(async (req) => {
  // Gérer CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { priceId, amount, customerEmail, userId } = await req.json();

    if (!priceId || !customerEmail) {
      return new Response(JSON.stringify({ error: 'Missing priceId or customerEmail' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Créer une Checkout Session avec email pré-rempli et Apple Pay désactivé
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Seulement carte, pas Apple Pay/Google Pay
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: customerEmail, // Email pré-rempli (obligatoire, non modifiable)
      billing_address_collection: 'required', // Forcer l'adresse de facturation
      mode: amount === 999 ? 'subscription' : 'payment', // 999 = abonnement PRO
      metadata: {
        user_id: userId || '', // Passer l'user_id dans les metadata pour le webhook
      },
      success_url: `${req.headers.get('origin') || 'https://fwrmziiqzjoqslsolyfh.supabase.co'}/#/dashboard?success=true`,
      cancel_url: `${req.headers.get('origin') || 'https://fwrmziiqzjoqslsolyfh.supabase.co'}/#/pricing?canceled=true`,
      payment_method_options: {
        card: {
          // Désactiver les méthodes de paiement rapides
          request_three_d_secure: 'automatic',
        },
      },
      // Désactiver explicitement Apple Pay et Google Pay
      payment_method_configuration: undefined,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    console.error('Stripe checkout error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});

