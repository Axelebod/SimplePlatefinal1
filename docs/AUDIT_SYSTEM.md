# Système d'Audit IA Complet - SimplePlate Studio

## 🎯 Vue d'ensemble

Le système d'audit IA de SimplePlate Studio est conçu pour être **le plus complet possible**. Il analyse un projet Micro-SaaS sous tous les angles et propose des outils SimplePlate spécifiques pour corriger chaque problème détecté.

## 🔍 Catégories d'Analyse

L'audit analyse **minimum 7-8 catégories** :

1. **Design & UI**
   - Espacement, couleurs, layout
   - Responsive design
   - Typographie
   - Outils suggérés: `website-generator`, `px-rem-converter`, `hex-color-display`

2. **Copywriting & Content**
   - Textes, headlines, CTA
   - Clarté du message
   - Qualité du contenu
   - Outils suggérés: `business-plan-pro`, `text-analyzer`, `ai-humanizer`

3. **Technical**
   - Code, structure, performance
   - Erreurs techniques
   - Optimisation
   - Outils suggérés: `json-formatter`, `csv-to-json`

4. **SEO**
   - Meta tags, URLs, structure
   - Sitemap, robots.txt
   - Optimisation SEO
   - Outils suggérés: `seo-meta-generator`, `slug-gen`

5. **UX & Usability**
   - Navigation, clarté
   - Parcours utilisateur
   - Expérience globale
   - Outils suggérés: `website-generator`, `business-plan-pro`

6. **Accessibility**
   - A11y, contraste
   - Lisibilité
   - Standards d'accessibilité
   - Outils suggérés: `text-analyzer`, `px-rem-converter`

7. **Business & Marketing**
   - Positionnement, message
   - Proposition de valeur
   - Stratégie marketing
   - Outils suggérés: `business-plan-pro`, `hashtag-gen`, `brand-name-gen`

8. **Performance**
   - Vitesse, optimisation
   - Ressources
   - Chargement
   - Outils suggérés: `json-formatter` (optimisation code)

## 🛠️ Mapping Intelligent des Outils

Le système utilise un **mapping intelligent** qui associe automatiquement les problèmes détectés aux outils SimplePlate appropriés :

### Exemples de Mapping

| Problème Détecté | Outil SimplePlate |
|-----------------|-------------------|
| "JSON mal formaté" | `json-formatter` |
| "Meta tags manquants" | `seo-meta-generator` |
| "URLs non SEO-friendly" | `slug-gen` |
| "Copywriting faible" | `business-plan-pro` |
| "Texte trop robotique" | `ai-humanizer` |
| "Espacement incohérent" | `px-rem-converter` |
| "Couleurs mal définies" | `hex-color-display` |
| "CSV à convertir" | `csv-to-json` |
| "Hashtags manquants" | `hashtag-gen` |
| "Texte à analyser" | `text-analyzer` |

## 📊 Structure de l'Audit

Chaque audit contient :

```typescript
{
  overall_score: 75, // Score global 0-100
  categories: [
    {
      name: "Design & UI",
      score: 80, // Score de la catégorie 0-100
      issues: [
        "Problème détaillé 1",
        "Problème détaillé 2",
        "Problème détaillé 3"
      ],
      suggested_tools: [
        "website-generator",
        "px-rem-converter"
      ]
    }
  ],
  generated_at: "2025-01-17T10:00:00Z"
}
```

## 🚀 Fonctionnement

1. **Déblocage** : L'utilisateur paie 20 crédits pour débloquer l'audit
2. **Analyse** : Le service `auditService.ts` utilise Gemini IA pour analyser le site
3. **Mapping** : Les problèmes sont automatiquement mappés aux outils SimplePlate
4. **Affichage** : L'audit est affiché avec scores colorés et boutons d'action directs

## 🎨 Interface Utilisateur

L'audit est affiché avec :
- **Score global** en grand avec badge coloré
- **Scores par catégorie** avec indicateurs visuels (vert/jaune/rouge)
- **Liste détaillée des problèmes** pour chaque catégorie
- **Boutons d'action** vers les outils SimplePlate suggérés

## 🔧 Personnalisation

Pour ajouter de nouveaux mappings d'outils, modifiez :
- `PROBLEM_TO_TOOL_MAP` dans `auditService.ts`
- Fonction `inferToolsFromIssues()` pour le mapping intelligent
- Fonction `getDefaultToolsForCategory()` pour les outils par défaut

## 📈 Métriques

L'audit détecte **minimum 20 problèmes** au total, répartis sur toutes les catégories, garantissant une analyse exhaustive.

## 🎯 Objectif

Créer un **viral loop** où :
1. Les utilisateurs soumettent leur projet
2. Ils obtiennent un audit complet
3. Ils utilisent les outils SimplePlate suggérés pour corriger
4. Ils gagnent des crédits en rédigeant des avis
5. Ils débloquent l'audit de leur propre projet

