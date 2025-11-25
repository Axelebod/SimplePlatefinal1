// @ts-nocheck
// Ce fichier utilise Deno (pas Node.js) - les erreurs TypeScript sont normales
// Le code fonctionnera correctement sur Supabase Edge Functions

import Stripe from 'https://esm.sh/stripe@15.9.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY') ?? '';
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const pricePack1 = Deno.env.get('STRIPE_PRICE_PACK_1') ?? '';
const pricePack50 = Deno.env.get('STRIPE_PRICE_PACK_50') ?? '';
const pricePack100 = Deno.env.get('STRIPE_PRICE_PACK_100') ?? '';
const pricePack500 = Deno.env.get('STRIPE_PRICE_PACK_500') ?? '';
const priceProSubscription = Deno.env.get('STRIPE_PRICE_PRO_SUBSCRIPTION') ?? '';

if (!stripeSecret || !webhookSecret || !supabaseUrl || !supabaseServiceRole) {
  console.error('Stripe/Supabase credentials missing in Edge function env.');
}

const stripe = new Stripe(stripeSecret, {
  apiVersion: '2024-06-20',
});

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);

const CREDIT_PACK_BY_PRICE: Record<string, number> = {
  [pricePack1]: 1,
  [pricePack50]: 50,
  [pricePack100]: 100,
  [pricePack500]: 500,
};

const PRO_MONTHLY_CREDITS = 100;

async function addCreditsToUser(userId: string | null, email: string | null, creditsToAdd: number, description: string) {
  let profileId: string | null = null;

  // Priorité 1 : Utiliser user_id depuis metadata si disponible
  if (userId) {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (!error && profile) {
      profileId = profile.id;
    } else {
      console.warn('User ID from metadata not found, falling back to email:', userId);
    }
  }

  // Priorité 2 : Fallback sur email si user_id n'est pas disponible
  if (!profileId && email) {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (!error && profile) {
      profileId = profile.id;
    } else {
      console.error('Profile lookup failed (both user_id and email)', { userId, email, error });
      return false;
    }
  }

  if (!profileId) {
    console.error('No profile found with user_id or email');
    return false;
  }

  // Récupérer les crédits payants actuels
  const { data: profile, error: fetchError } = await supabaseAdmin
    .from('profiles')
    .select('credits_paid')
    .eq('id', profileId)
    .single();

  if (fetchError || !profile) {
    console.error('Failed to fetch current paid credits', fetchError);
    return false;
  }

  const newPaidBalance = (profile.credits_paid ?? 0) + creditsToAdd;

  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({ credits_paid: newPaidBalance })
    .eq('id', profileId);

  if (updateError) {
    console.error('Failed to update credits', updateError);
    return false;
  }

  await supabaseAdmin.from('transactions').insert({
    user_id: profileId,
    amount: creditsToAdd,
    description,
  });

  return true;
}

async function activatePro(userId: string | null, email: string | null, isRenewal: boolean = false) {
  let profileId: string | null = null;

  // Priorité 1 : Utiliser user_id depuis metadata si disponible
  if (userId) {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('id, is_pro')
      .eq('id', userId)
      .single();

    if (!error && profile) {
      profileId = profile.id;
    } else {
      console.warn('User ID from metadata not found, falling back to email:', userId);
    }
  }

  // Priorité 2 : Fallback sur email si user_id n'est pas disponible
  if (!profileId && email) {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('id, is_pro')
      .eq('email', email)
      .single();

    if (!error && profile) {
      profileId = profile.id;
    } else {
      console.error('Profile lookup failed (pro)', { userId, email, error });
      return false;
    }
  }

  if (!profileId) {
    console.error('No profile found with user_id or email for PRO activation');
    return false;
  }

  // Récupérer les crédits payants actuels pour déterminer si c'est un renouvellement
  const { data: currentProfile, error: fetchError } = await supabaseAdmin
    .from('profiles')
    .select('credits_paid, is_pro')
    .eq('id', profileId)
    .single();

  if (fetchError || !currentProfile) {
    console.error('Failed to fetch current profile', fetchError);
    return false;
  }

  const wasAlreadyPro = currentProfile.is_pro ?? false;
  const currentPaidCredits = currentProfile.credits_paid ?? 0;

  // Si c'est un renouvellement (déjà PRO), AJOUTER les crédits payants au lieu de remplacer
  if (isRenewal || wasAlreadyPro) {
    const newPaidBalance = currentPaidCredits + PRO_MONTHLY_CREDITS;
    
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        is_pro: true, 
        credits_paid: newPaidBalance,
        pro_credits_reset_date: new Date().toISOString()
      })
      .eq('id', profileId);

    if (updateError) {
      console.error('Failed to update pro status (renewal)', updateError);
      return false;
    }

    await supabaseAdmin.from('transactions').insert({
      user_id: profileId,
      amount: PRO_MONTHLY_CREDITS,
      description: 'Renouvellement abonnement PRO (100 crédits mensuels)',
    });

    console.log(`Renouvellement PRO : ${PRO_MONTHLY_CREDITS} crédits payants ajoutés (nouveau solde: ${newPaidBalance})`);
  } else {
    // Première activation : définir les crédits payants à 100
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        is_pro: true, 
        credits_paid: PRO_MONTHLY_CREDITS,
        pro_credits_reset_date: new Date().toISOString()
      })
      .eq('id', profileId);

    if (updateError) {
      console.error('Failed to set pro status', updateError);
      return false;
    }

    await supabaseAdmin.from('transactions').insert({
      user_id: profileId,
      amount: PRO_MONTHLY_CREDITS,
      description: 'Activation abonnement PRO',
    });

    console.log(`Activation PRO : ${PRO_MONTHLY_CREDITS} crédits attribués`);
  }

  return true;
}

async function deactivatePro(userId: string | null, email: string | null) {
  let profileId: string | null = null;

  // Priorité 1 : Utiliser user_id depuis metadata si disponible
  if (userId) {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (!error && profile) {
      profileId = profile.id;
    } else {
      console.warn('User ID from metadata not found, falling back to email:', userId);
    }
  }

  // Priorité 2 : Fallback sur email si user_id n'est pas disponible
  if (!profileId && email) {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (!error && profile) {
      profileId = profile.id;
    } else {
      console.error('Profile lookup failed (cancel pro)', { userId, email, error });
      return false;
    }
  }

  if (!profileId) {
    console.error('No profile found with user_id or email for PRO deactivation');
    return false;
  }

  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({ is_pro: false })
    .eq('id', profileId);

  if (updateError) {
    console.error('Failed to remove pro status', updateError);
    return false;
  }

  return true;
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email;
  const userId = session.metadata?.user_id || null; // Récupérer user_id depuis metadata

  if (!email && !userId) {
    console.error('Checkout session missing both customer email and user_id');
    return false;
  }

  console.log('Processing checkout with user_id:', userId, 'email:', email);

  if (session.mode === 'subscription') {
    if (session.subscription) {
      await activatePro(userId, email);
    }
    return true;
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 10 });
  let creditsToAdd = 0;

  for (const item of lineItems.data) {
    const priceId = item.price?.id ?? '';
    console.log('Processing line item with price ID:', priceId);
    console.log('Available price mappings:', Object.keys(CREDIT_PACK_BY_PRICE));
    creditsToAdd += CREDIT_PACK_BY_PRICE[priceId] ?? 0;
  }

  if (creditsToAdd === 0) {
    console.warn('Checkout completed but no matching credit pack', session.id);
    console.warn('Price IDs in session:', lineItems.data.map(item => item.price?.id));
    return false;
  }

  console.log('Adding credits:', creditsToAdd, 'to user_id:', userId, 'email:', email);

  return addCreditsToUser(userId, email, creditsToAdd, `Pack ${creditsToAdd} crédits (Stripe)`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const priceId = subscription.items.data[0]?.price?.id;
  const status = subscription.status;
  const cancelAtPeriodEnd = subscription.cancel_at_period_end ?? false;
  
  // L'abonnement est actif si le statut est actif ET qu'il n'est pas programmé pour annulation
  // OU si cancel_at_period_end est true mais que le statut est encore actif (jusqu'à la fin de la période)
  const isActive = ['active', 'trialing'].includes(status) && !(cancelAtPeriodEnd && status === 'canceled');
  const isCanceled = status === 'canceled' || status === 'unpaid' || status === 'past_due';

  const customerId = subscription.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  const email = !customer.deleted ? customer.email : null;
  const userId = subscription.metadata?.user_id || null; // Récupérer user_id depuis metadata

  if ((!email && !userId) || priceId !== priceProSubscription) {
    return false;
  }

  // Si l'abonnement est annulé mais reste actif jusqu'à la fin de la période
  if (cancelAtPeriodEnd && status === 'active') {
    console.log('Subscription scheduled for cancellation at period end, but still active until:', new Date(subscription.current_period_end * 1000));
    // L'abonnement reste actif jusqu'à la fin de la période, on continue à activer PRO
    const createdAt = subscription.created * 1000;
    const now = Date.now();
    const daysSinceCreation = (now - createdAt) / (1000 * 60 * 60 * 24);
    const isRenewal = daysSinceCreation > 1;
    return activatePro(userId, email, isRenewal);
  }

  if (isActive) {
    // Vérifier si c'est un renouvellement (subscription créée il y a plus d'un jour)
    const createdAt = subscription.created * 1000; // Convertir en millisecondes
    const now = Date.now();
    const daysSinceCreation = (now - createdAt) / (1000 * 60 * 60 * 24);
    const isRenewal = daysSinceCreation > 1; // Si créé il y a plus d'un jour, c'est probablement un renouvellement
    
    return activatePro(userId, email, isRenewal);
  } else if (isCanceled) {
    // L'abonnement est vraiment annulé, désactiver PRO
    console.log('Subscription canceled, deactivating PRO');
    return deactivatePro(userId, email);
  }

  return false;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const signature = req.headers.get('stripe-signature');
  const payload = await req.text();

  try {
    if (!signature) {
      console.error('Missing stripe-signature header');
      return new Response('Missing signature', { status: 400 });
    }

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return new Response('Webhook secret not configured', { status: 500 });
    }

    const event = await stripe.webhooks.constructEventAsync(payload, signature, webhookSecret);

    console.log('Received Stripe event:', event.type, event.id);

    switch (event.type) {
      case 'checkout.session.completed':
        const result = await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        console.log('Checkout completed result:', result);
        break;
      case 'customer.subscription.created':
        // Première création : activation initiale (pas de renouvellement)
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.updated':
        // Mise à jour : peut être un renouvellement mensuel
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.paid':
        // Facture payée : renouvellement mensuel confirmé
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          await handleSubscriptionUpdated(subscription);
        }
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      default:
        console.log('Unhandled Stripe event', event.type);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: any) {
    console.error('Stripe webhook error:', err.message, err.type);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});

