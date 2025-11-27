# Edge Function : Cleanup Old Results

Cette fonction nettoie automatiquement les résultats de plus de 90 jours qui ne sont pas en favoris.

## Déploiement

```bash
supabase functions deploy cleanup-old-results
```

## Configuration Cron (Optionnel)

Pour exécuter automatiquement tous les jours, configurez un cron job dans Supabase Dashboard :
- **Schedule** : `0 2 * * *` (tous les jours à 2h du matin)
- **URL** : `https://fwrmziiqzjoqslsolyfh.supabase.co/functions/v1/cleanup-old-results`

Ou utilisez un service externe comme :
- GitHub Actions (gratuit)
- Vercel Cron (gratuit)
- EasyCron (gratuit jusqu'à 2 jobs)

## Test Manuel

```bash
curl -X POST https://fwrmziiqzjoqslsolyfh.supabase.co/functions/v1/cleanup-old-results \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

