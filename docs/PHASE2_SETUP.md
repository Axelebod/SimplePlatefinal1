# SimplePlate Studio - Phase 2 Setup Guide

## 📋 Vue d'ensemble

SimplePlate Studio est la Phase 2 de SimplePlate, une plateforme communautaire où les utilisateurs peuvent :
- Soumettre leur Micro-SaaS
- Obtenir un audit IA
- Recevoir des retours de la communauté
- Gagner des crédits en rédigeant des avis

## 🗄️ Migration de Base de Données

### Étape 1 : Appliquer la migration SQL

Exécutez le fichier de migration dans votre base de données Supabase :

```bash
# Via Supabase CLI
supabase db push

# Ou via le SQL Editor dans le dashboard Supabase
# Copiez-collez le contenu de: supabase/migrations/20250117_phase2_studio.sql
```

### Étape 2 : Vérifier les tables créées

Les tables suivantes doivent être créées :
- `projects` - Projets soumis par les utilisateurs
- `reviews` - Avis de la communauté
- `votes` - Votes pour le leaderboard

Les colonnes suivantes doivent être ajoutées à `profiles` :
- `last_weekly_refill` - Dernière recharge hebdomadaire
- `daily_earned_credits` - Crédits gagnés aujourd'hui
- `last_activity_date` - Dernière activité (pour reset quotidien)

## 🎯 Fonctionnalités Implémentées

### 1. Système de Crédits Unifié

**Coûts (Outflow) :**
- Soumettre un projet : **GRATUIT**
- Débloquer l'audit IA complet : **50 crédits**
- Outils Premium (Phase 1) : Selon configuration
- Boost de visibilité (24h) : **100 crédits** ✅

**Gains (Inflow) :**
- **Recharge hebdomadaire** : Si `last_weekly_refill` > 7 jours ET `credits` < 5, recharge à 5 crédits
- **Mining d'avis** : 0.5 crédit par avis valide (>100 caractères)
- **Plafond quotidien** : Maximum 3 crédits par jour via les avis (6 avis max = 3 crédits)

### 2. Showcase (Feed de Projets)

- Affichage des projets triés par `votes_count` (Leaderboard hebdomadaire)
- Bouton "Voter" (nécessite authentification)
- Bouton "Partager" (à implémenter avec OpenGraph dynamique)

### 3. Clinic (Intégration Phase 1 <-> Phase 2)

L'audit IA suggère automatiquement des outils SimplePlate :
- Si "Bad JSON structure" → Bouton "Fix with JSON Formatter"
- Si "Weak Copywriting" → Bouton "Use Business Plan Generator"

### 4. Dashboard Unifié

Le Dashboard affiche maintenant :
- **Phase 1** : Historique des outils utilisés
- **Phase 2** : Projets soumis dans Studio
- Notification : "Vous avez X crédits pour débloquer votre Audit"

## 🚀 Routes Disponibles

- `/studio` - Showcase de projets (leaderboard)
- `/studio/submit` - Soumettre un projet
- `/studio/project/:id` - Détails d'un projet (audit IA, avis)

## 🔧 Configuration

### Variables d'Environnement

Aucune nouvelle variable requise. Le système utilise les mêmes variables que Phase 1.

### Fonctions RPC Supabase

Les fonctions suivantes sont créées automatiquement par la migration :
- `check_weekly_refill(p_user_id)` - Vérifie et recharge les crédits hebdomadaires
- `earn_credits_from_review(p_user_id)` - Gagne des crédits via un avis
- `unlock_project_audit(p_project_id, p_user_id)` - Débloque l'audit IA (déduit 20 crédits)
- `update_project_votes_count()` - Met à jour automatiquement le compteur de votes

## 📝 Notes Importantes

1. **Système de crédits unifié** : Les crédits sont maintenant gérés de manière unifiée entre Phase 1 et Phase 2
2. **Audit IA mock** : L'audit IA est actuellement mocké. Remplacez la logique dans `unlock_project_audit` pour intégrer votre vrai service IA
3. **Auto-approbation** : Les projets sont automatiquement approuvés (`status: 'published'`). Vous pouvez ajouter une modération plus tard
4. **Weekly Refill** : Le système vérifie automatiquement la recharge hebdomadaire à chaque login

## 🐛 Dépannage

### Les crédits ne se rechargent pas automatiquement

Vérifiez que la fonction `check_weekly_refill` est bien créée dans Supabase et que `last_weekly_refill` est bien initialisé.

### Les votes ne s'incrémentent pas

Vérifiez que le trigger `trigger_update_votes_count` est bien actif sur la table `votes`.

### Les avis ne génèrent pas de crédits

Vérifiez que la fonction `earn_credits_from_review` est appelée après la création d'un avis (déjà implémenté dans `studioService.ts`).

## 🔮 Prochaines Étapes

1. **Intégration IA réelle** : Remplacer le mock d'audit IA par un vrai service
2. **OpenGraph dynamique** : Générer des images de partage avec le score du projet
3. **Boost de visibilité** : Implémenter le système de boost (50 crédits pour 24h)
4. **Modération** : Ajouter un système de modération pour les projets
5. **Notifications** : Notifier les utilisateurs quand leur projet reçoit des votes/avis

