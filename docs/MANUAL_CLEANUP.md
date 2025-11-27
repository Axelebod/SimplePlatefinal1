# Comment Appeler Manuellement le Nettoyage

## Option 1 : Via le Navigateur (Simple)

Ouvrez votre navigateur et allez à cette URL (remplacez `YOUR_ANON_KEY` par votre clé anonyme Supabase) :

```
https://fwrmziiqzjoqslsolyfh.supabase.co/functions/v1/cleanup-old-results
```

**Note** : Cette méthode nécessite que l'Edge Function soit déployée.

## Option 2 : Via cURL (Terminal)

```bash
curl -X POST https://fwrmziiqzjoqslsolyfh.supabase.co/functions/v1/cleanup-old-results \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

## Option 3 : Via SQL Directement (Le Plus Simple)

Allez dans **Supabase Dashboard** → **SQL Editor** et exécutez :

```sql
SELECT cleanup_old_tool_results();
```

Cela retournera le nombre de résultats supprimés.

## Option 4 : Via le Code Frontend (Pour un Bouton Admin)

Vous pouvez créer un bouton dans votre dashboard admin qui appelle :

```typescript
const { data, error } = await supabase.rpc('cleanup_old_tool_results');
console.log('Résultats supprimés:', data);
```

## Résultat Attendu

```json
{
  "deleted_count": 42
}
```

Cela indique le nombre de résultats supprimés.

