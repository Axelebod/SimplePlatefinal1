<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1LUBup5xhCsLH5WnYZpQgeln937RU64bL

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create `.env.local` with the required credentials:

```
# Gemini
REACT_APP_API_KEY=your_gemini_key

# Supabase
REACT_APP_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
REACT_APP_SUPABASE_ANON_KEY=public-anon-key

# Stripe (replace with the checkout/portal links you generate)
REACT_APP_STRIPE_SUB_LINK=https://buy.stripe.com/...
REACT_APP_STRIPE_PORTAL=https://billing.stripe.com/p/login/...
REACT_APP_STRIPE_PACK_50=https://buy.stripe.com/...
REACT_APP_STRIPE_PACK_100=https://buy.stripe.com/...
REACT_APP_STRIPE_PACK_500=https://buy.stripe.com/...

# Analytics (optional)
REACT_APP_GA_ID=G-XXXXXXXXXX
```

3. (Optional but recommended) Run the SQL found in `supabase_schema.sql` (or open `pages/AdminSetup.tsx` in the browser) inside the Supabase SQL editor to provision the `profiles` and `transactions` tables plus triggers.
4. (Optional) Déployer le webhook Stripe → Supabase : voir [Stripe ↔ Supabase](#stripe--supabase).
5. Run the app:
   `npm run dev`

## Stripe ↔ Supabase

Pour créditer automatiquement les utilisateurs après paiement Stripe :

1. **Configurer les environnements Supabase Edge :**  
   ```
   supabase secrets set \
     STRIPE_SECRET_KEY=sk_live_xxx \
     STRIPE_WEBHOOK_SECRET=whsec_xxx \
     SUPABASE_SERVICE_ROLE_KEY=service_role_xxx \
     SUPABASE_URL=https://fwrmziiqzjoqslsolyfh.supabase.co \
     STRIPE_PRICE_PACK_50=price_xxx \
     STRIPE_PRICE_PACK_100=price_xxx \
     STRIPE_PRICE_PACK_500=price_xxx \
     STRIPE_PRICE_PRO_SUBSCRIPTION=price_xxx
   ```
   Les `price_xxx` doivent correspondre aux Price IDs utilisés dans vos payment links / abonnements.

2. **Déployer la fonction :**
   ```
   supabase functions deploy stripe-webhook
   supabase functions serve stripe-webhook --env-file ./supabase/.env --auto-approve
   ```
   (Remplacez par vos commandes habituelles Supabase CLI.)

3. **Connecter Stripe :** dans le Dashboard Stripe → Developers → Webhooks → Add endpoint → URL = `https://{YOUR_SUPABASE_PROJECT}.supabase.co/functions/v1/stripe-webhook`, événements `checkout.session.completed`, `customer.subscription.*`.

4. **Mettre à jour les liens d’achat** pour qu’ils utilisent les mêmes Price IDs que ceux déclarés ci-dessus.
