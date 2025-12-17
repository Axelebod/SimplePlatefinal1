export type BlogPost = {
  slug: string;
  h1: string; // H1 = mot-clé principal
  title: string; // <title>
  metaDescription: string; // 150–160 caractères
  keywords: string[];
  publishedAt: string; // YYYY-MM-DD
  readingTime: string;
  cover: {
    src: string;
    alt: string;
  };
  excerpt: string;
  bodyMarkdown: string;
  relatedSlugs: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'simpleplate-cest-quoi',
    h1: 'SimplePlate',
    title: "SimplePlate : la boîte à outils IA pour créer, écrire et produire plus vite",
    metaDescription:
      "Découvrez SimplePlate, la boîte à outils IA pour créer du contenu, des sites, des CV, des factures et automatiser vos tâches en ligne, sans installation.",
    keywords: ['SimplePlate', 'outils IA', 'productivité', 'générateurs', 'web'],
    publishedAt: '2025-12-17',
    readingTime: '6 min',
    cover: {
      src: '/blog/simpleplate-cest-quoi.svg',
      alt: "Illustration SimplePlate : une boîte à outils IA tout-en-un",
    },
    excerpt:
      "SimplePlate regroupe des outils IA simples et rapides pour gagner du temps: rédaction, business, dev, SEO et plus.",
    bodyMarkdown: `## Pourquoi SimplePlate existe

Vous avez souvent besoin d'un **outil IA simple**, sans installation, pour faire une tâche précise: rédiger, structurer, analyser, transformer.
**SimplePlate** regroupe ces outils au même endroit.

## Ce que vous pouvez faire avec SimplePlate

- Générer un site en HTML (prêt à prévisualiser)
- Créer un CV ou une facture
- Formater du JSON, créer des slugs SEO, convertir px→rem
- Générer des prompts pro, analyser du texte, etc.

Pour commencer, allez sur la page d'accueil et choisissez un outil:
- [Voir tous les outils](/)

## Exemples rapides (en 2 minutes)

1. **Créer une page web**: utilisez le [Générateur de site web](/tool/generateur-site-web)
2. **Optimiser vos URLs**: essayez le [Générateur de slug](/tool/generateur-slug)
3. **Mettre au propre une donnée**: utilisez le [Formateur JSON](/tool/formateur-json)

## À lire aussi

- [Outils IA](/blog/top-10-outils-ia)
- [Générateur de site web](/blog/generateur-site-web)
- [Détecteur de texte IA](/blog/detecteur-texte-ia)
`,
    relatedSlugs: ['top-10-outils-ia', 'generateur-site-web', 'detecteur-texte-ia'],
  },
  {
    slug: 'top-10-outils-ia',
    h1: 'Outils IA',
    title: "Outils IA : top 10 des outils SimplePlate pour gagner du temps (vraiment)",
    metaDescription:
      "Top 10 outils IA SimplePlate pour écrire, créer un site, générer un CV, une facture, formater JSON et booster votre productivité au quotidien, vite, maintenant.",
    keywords: ['outils IA', 'SimplePlate', 'productivité', 'générateur', 'SEO'],
    publishedAt: '2025-12-17',
    readingTime: '8 min',
    cover: {
      src: '/blog/top-10-outils-ia.svg',
      alt: "Illustration : sélection des meilleurs outils IA de SimplePlate",
    },
    excerpt:
      "Une sélection des 10 outils SimplePlate les plus utiles pour produire plus vite: web, business, SEO, dev et automatisations.",
    bodyMarkdown: `## 1) Générateur de site web

Pour produire une landing page vite, avec preview:
- [Générateur de site web](/tool/generateur-site-web)

## 2) Studio Branding

Pour brainstormer un nom, une baseline, des angles:
- [Studio Branding](/tool/studio-branding)

## 3) Générateur de CV

Pour structurer un CV clair (et modifier ensuite):
- [Générateur de CV](/tool/cv-generator)

## 4) Générateur de Facture

Pour facturer proprement, vite:
- [Générateur de Facture](/tool/invoice-generator)

## 5) Générateur de slug

Pour des URLs propres et SEO:
- [Générateur de slug](/tool/generateur-slug)

## 6) Formateur JSON

Pour nettoyer/valider un JSON:
- [Formateur JSON](/tool/formateur-json)

## 7) Pixel vers rem

Pour un design system propre:
- [Pixel vers rem](/tool/pixel-vers-rem)

## 8) Générateur de QR Code

Pour partager un lien, Wi‑Fi, etc.:
- [Générateur de QR Code](/tool/generateur-qr-code)

## 9) Détecteur de texte IA

Pour vérifier si un texte semble généré:
- [Détecteur de texte IA](/tool/detecteur-texte-ia)

## 10) Générateur SEO meta

Pour titre + description + OpenGraph:
- [Générateur SEO meta](/tool/generateur-seo-meta)

## À lire aussi

- [SimplePlate](/blog/simpleplate-cest-quoi)
- [Générateur de site web](/blog/generateur-site-web)
- [Formateur JSON](/blog/formateur-json-en-ligne)
`,
    relatedSlugs: ['simpleplate-cest-quoi', 'generateur-site-web', 'formateur-json-en-ligne'],
  },
  {
    slug: 'generateur-site-web',
    h1: 'Générateur de site web',
    title: "Générateur de site web : créer une landing page en quelques minutes avec SimplePlate",
    metaDescription:
      "Créez une landing page rapidement avec le générateur de site web SimplePlate: HTML prêt à prévisualiser, sections claires, CTA et structure SEO, sans coder.",
    keywords: ['générateur de site web', 'landing page', 'SimplePlate', 'HTML', 'SEO'],
    publishedAt: '2025-12-17',
    readingTime: '7 min',
    cover: {
      src: '/blog/generateur-site-web.svg',
      alt: "Illustration : création rapide d'une landing page avec SimplePlate",
    },
    excerpt:
      "Comment utiliser le Générateur de site web SimplePlate pour produire une landing page HTML propre, rapide, et facile à éditer.",
    bodyMarkdown: `## Le problème

Créer une page web “propre” prend du temps: structure, sections, texte, CTA, cohérence.

## La solution SimplePlate

Ouvrez le tool:
- [Générateur de site web](/tool/generateur-site-web)

### Prompt conseillé

Décrivez:
- Le produit (1 phrase)
- La cible
- 3 bénéfices
- 1 preuve (chiffre, avis, cas)
- 1 CTA

### Checklist SEO rapide

- H1 unique
- Titres H2 utiles
- CTA clair
- Page rapide et lisible

## Liens internes utiles

- Tarifs et crédits: [Pricing](/pricing)
- Outils complémentaires: [Générateur de slug](/tool/generateur-slug) et [Générateur SEO meta](/tool/generateur-seo-meta)

## À lire aussi

- [Outils IA](/blog/top-10-outils-ia)
- [Générateur de slug](/blog/generateur-de-slug-seo)
`,
    relatedSlugs: ['top-10-outils-ia', 'generateur-de-slug-seo', 'simpleplate-cest-quoi'],
  },
  {
    slug: 'generateur-de-cv',
    h1: 'Générateur de CV',
    title: "Générateur de CV : structurer un CV clair et pro avec SimplePlate",
    metaDescription:
      "Créez un CV professionnel avec le générateur de CV SimplePlate: structure ATS, résumé, compétences, expériences, et conseils pour candidater plus vite.",
    keywords: ['générateur de CV', 'CV professionnel', 'ATS', 'SimplePlate', 'emploi'],
    publishedAt: '2025-12-17',
    readingTime: '7 min',
    cover: {
      src: '/blog/generateur-de-cv.svg',
      alt: "Illustration : CV structuré et optimisé généré avec SimplePlate",
    },
    excerpt:
      "Un guide simple pour créer un CV structuré avec SimplePlate, puis l'améliorer selon l'offre (ATS, mots-clés, lisibilité).",
    bodyMarkdown: `## Objectif

Un CV efficace = **lisible**, **structuré**, et adapté au poste.

## Utiliser SimplePlate

Outil:
- [Générateur de CV](/tool/cv-generator)

### Bon input = bon CV

- Poste visé (précis)
- Expériences avec résultats (chiffres)
- Compétences clés (ciblées)

### Astuce SEO (pour LinkedIn / portfolio)

Créez aussi une URL propre pour votre page:
- [Générateur de slug](/tool/generateur-slug)

## À lire aussi

- [Générateur de facture](/blog/generateur-de-facture)
- [Outils IA](/blog/top-10-outils-ia)
`,
    relatedSlugs: ['generateur-de-facture', 'top-10-outils-ia', 'generateur-de-slug-seo'],
  },
  {
    slug: 'generateur-de-facture',
    h1: 'Générateur de facture',
    title: "Générateur de facture : faire une facture pro en quelques clics avec SimplePlate",
    metaDescription:
      "Générez une facture pro avec SimplePlate: infos émetteur, client, lignes de prestation, TVA, mentions utiles, et un modèle prêt à envoyer, clair, vite.",
    keywords: ['générateur de facture', 'facture', 'auto-entrepreneur', 'SimplePlate', 'business'],
    publishedAt: '2025-12-17',
    readingTime: '6 min',
    cover: {
      src: '/blog/generateur-de-facture.svg',
      alt: "Illustration : facture professionnelle générée avec SimplePlate",
    },
    excerpt:
      "Créez une facture rapidement avec SimplePlate et gardez une structure claire: lignes, TVA, mentions et présentation.",
    bodyMarkdown: `## Pourquoi c'est utile

Une facture propre = paiement plus rapide et moins d'aller-retours.

## Utiliser SimplePlate

Outil:
- [Générateur de Facture](/tool/invoice-generator)

### Bonnes pratiques

- Numérotation cohérente (ex: FACT-2025-001)
- Détail des prestations
- Conditions de paiement

## Liens internes

- Packs de crédits: [Tarifs](/pricing)
- Pour proposer une offre: [Business Plan Pro](/tool/business-plan-pro)

## À lire aussi

- [Générateur de CV](/blog/generateur-de-cv)
- [Outils IA](/blog/top-10-outils-ia)
`,
    relatedSlugs: ['generateur-de-cv', 'top-10-outils-ia', 'simpleplate-cest-quoi'],
  },
  {
    slug: 'generateur-de-slug-seo',
    h1: 'Générateur de slug',
    title: "Générateur de slug : URLs propres et SEO pour vos pages (avec SimplePlate)",
    metaDescription:
      "Créez des URLs claires avec le générateur de slug SimplePlate: minuscules, sans accents, mots-clés, et structure idéale pour le SEO et le partage, simple.",
    keywords: ['générateur de slug', 'URL', 'SEO', 'SimplePlate', 'contenu'],
    publishedAt: '2025-12-17',
    readingTime: '6 min',
    cover: {
      src: '/blog/generateur-de-slug-seo.svg',
      alt: "Illustration : URL SEO propre générée (slug) avec SimplePlate",
    },
    excerpt:
      "Des slugs propres = meilleure lisibilité + SEO + partage. Voici une méthode simple et l'outil SimplePlate pour automatiser.",
    bodyMarkdown: `## Règles simples pour un bon slug

- Minuscules
- Sans accents
- Mots séparés par des tirets
- Court et descriptif

## Outil SimplePlate

- [Générateur de slug](/tool/generateur-slug)

## Exemples

- "Top 10 outils IA" → \`top-10-outils-ia\`
- "Créer une landing page" → \`creer-une-landing-page\`

## Liens internes

- Si vous publiez: [Générateur SEO meta](/tool/generateur-seo-meta)
- Pour créer la page: [Générateur de site web](/tool/generateur-site-web)

## À lire aussi

- [Outils IA](/blog/top-10-outils-ia)
- [Générateur de site web](/blog/generateur-site-web)
`,
    relatedSlugs: ['top-10-outils-ia', 'generateur-site-web', 'simpleplate-cest-quoi'],
  },
  {
    slug: 'formateur-json-en-ligne',
    h1: 'Formateur JSON',
    title: "Formateur JSON : nettoyer, indenter et valider un JSON avec SimplePlate",
    metaDescription:
      "Formatez et validez votre JSON en ligne avec SimplePlate: indentation lisible, détection d'erreurs, copie rapide, et workflow dev plus propre, en 1 clic.",
    keywords: ['formateur JSON', 'formatter', 'dev', 'SimplePlate', 'API'],
    publishedAt: '2025-12-17',
    readingTime: '5 min',
    cover: {
      src: '/blog/formateur-json-en-ligne.svg',
      alt: "Illustration : JSON propre et indenté grâce à SimplePlate",
    },
    excerpt:
      "Un JSON lisible évite des erreurs et accélère le dev. Utilisez le Formateur JSON de SimplePlate pour nettoyer et valider en 1 clic.",
    bodyMarkdown: `## Quand l'utiliser

- Debug d'une API
- Nettoyage d'un payload
- Lecture d'un gros objet

## Outil SimplePlate

- [Formateur JSON](/tool/formateur-json)

## Astuce

Si votre JSON vient d'un CSV:
- [CSV vers JSON](/tool/csv-vers-json)

## À lire aussi

- [Outils IA](/blog/top-10-outils-ia)
- [Pixel vers rem](/blog/pixel-vers-rem)
`,
    relatedSlugs: ['top-10-outils-ia', 'pixel-vers-rem', 'generateur-de-slug-seo'],
  },
  {
    slug: 'generateur-qr-code',
    h1: 'Générateur de QR Code',
    title: "Générateur de QR Code : créer un QR code propre (lien, Wi‑Fi, texte) avec SimplePlate",
    metaDescription:
      "Créez un QR code en ligne avec SimplePlate: lien, texte ou Wi‑Fi. Téléchargement rapide, usage print, et bonnes pratiques pour un scan fiable, partout.",
    keywords: ['générateur de QR Code', 'qr code', 'SimplePlate', 'print', 'partage'],
    publishedAt: '2025-12-17',
    readingTime: '5 min',
    cover: {
      src: '/blog/generateur-qr-code.svg',
      alt: "Illustration : QR code prêt à télécharger généré avec SimplePlate",
    },
    excerpt:
      "Créez un QR code scannable et propre avec SimplePlate, puis téléchargez-le pour vos flyers, menus, affiches et cartes de visite.",
    bodyMarkdown: `## Outil SimplePlate

- [Générateur de QR Code](/tool/generateur-qr-code)

## Bonnes pratiques

- Testez le scan sur 2 téléphones
- Gardez une marge blanche autour
- Évitez les URLs trop longues

## Liens internes

- Pour rendre l'URL plus propre: [Générateur de slug](/tool/generateur-slug)

## À lire aussi

- [Outils IA](/blog/top-10-outils-ia)
- [SimplePlate](/blog/simpleplate-cest-quoi)
`,
    relatedSlugs: ['top-10-outils-ia', 'simpleplate-cest-quoi', 'generateur-de-slug-seo'],
  },
  {
    slug: 'detecteur-texte-ia',
    h1: 'Détecteur de texte IA',
    title: "Détecteur de texte IA : comment l'utiliser (et interpréter les résultats) sur SimplePlate",
    metaDescription:
      "Utilisez le détecteur de texte IA SimplePlate pour estimer si un texte semble généré. Comprenez les limites, les signaux et les bonnes pratiques, en ligne.",
    keywords: ['détecteur de texte IA', 'IA', 'SimplePlate', 'contenu', 'authenticité'],
    publishedAt: '2025-12-17',
    readingTime: '7 min',
    cover: {
      src: '/blog/detecteur-texte-ia.svg',
      alt: "Illustration : analyse d'un texte et score IA avec SimplePlate",
    },
    excerpt:
      "Les détecteurs ne sont pas infaillibles: voici comment utiliser celui de SimplePlate intelligemment, avec interprétation et actions concrètes.",
    bodyMarkdown: `## À quoi ça sert

- Relecture d'un texte avant publication
- Contrôle qualité (style trop “robotique”)
- Audit rapide d'un contenu

## Outil SimplePlate

- [Détecteur de texte IA](/tool/detecteur-texte-ia)

## Comment interpréter

- Un score élevé = signaux probabilistes, pas une preuve
- Mélangez avec une relecture humaine

## Liens internes

- Pour améliorer le style: [Humaniseur de texte](/tool/humaniseur-texte)

## À lire aussi

- [Outils IA](/blog/top-10-outils-ia)
- [SimplePlate](/blog/simpleplate-cest-quoi)
`,
    relatedSlugs: ['top-10-outils-ia', 'simpleplate-cest-quoi', 'generateur-site-web'],
  },
  {
    slug: 'pixel-vers-rem',
    h1: 'Pixel vers rem',
    title: "Pixel vers rem : convertir px→rem proprement (design system) avec SimplePlate",
    metaDescription:
      "Convertissez px en rem avec SimplePlate pour un design system scalable: base 16px, tableaux de conversion, cohérence typographique et responsive, CSS.",
    keywords: ['px to rem', 'pixel vers rem', 'design system', 'CSS', 'SimplePlate'],
    publishedAt: '2025-12-17',
    readingTime: '6 min',
    cover: {
      src: '/blog/pixel-vers-rem.svg',
      alt: "Illustration : conversion px vers rem pour CSS avec SimplePlate",
    },
    excerpt:
      "Le rem rend vos tailles plus scalables. Utilisez l'outil Pixel vers rem de SimplePlate pour garder une cohérence CSS rapide.",
    bodyMarkdown: `## Pourquoi utiliser rem

- Accessibilité (zoom)
- Mise à l'échelle cohérente
- Design system plus propre

## Outil SimplePlate

- [Pixel vers rem](/tool/pixel-vers-rem)

## Liens internes

- Pour vérifier un JSON de tokens: [Formateur JSON](/tool/formateur-json)

## À lire aussi

- [Formateur JSON](/blog/formateur-json-en-ligne)
- [Outils IA](/blog/top-10-outils-ia)
`,
    relatedSlugs: ['formateur-json-en-ligne', 'top-10-outils-ia', 'generateur-de-slug-seo'],
  },
  {
    slug: 'generateur-seo-meta',
    h1: 'Générateur SEO meta',
    title: 'Générateur SEO meta : title, meta description et Open Graph (guide + exemples)',
    metaDescription:
      "Optimisez vos pages avec un bon title, une meta description qui clique et des balises Open Graph/Twitter. Exemples + outil SimplePlate pour générer vite.",
    keywords: ['générateur SEO meta', 'meta tags', 'meta description', 'title SEO', 'open graph', 'twitter card'],
    publishedAt: '2025-12-17',
    readingTime: '9 min',
    cover: {
      src: '/blog/generateur-seo-meta.svg',
      alt: 'Illustration : génération de meta tags SEO (title, description, Open Graph)',
    },
    excerpt:
      "Un bon title + une meta description claire = plus de clics. Voici une méthode simple (avec templates) et l’outil SimplePlate pour produire vos meta tags rapidement.",
    bodyMarkdown: `## Pourquoi vos meta tags font (vraiment) la différence

Entre deux résultats proches, la différence se joue souvent sur **le clic**:
- votre **title** (promesse + mot-clé)
- votre **meta description** (raison de cliquer)
- votre **preview social** (Open Graph / Twitter)

Générez des meta tags propres en 30 secondes:
- [Générateur SEO meta](/tool/generateur-seo-meta)

## 1) Title SEO: règles simples qui marchent

Checklist:
- 1 mot-clé principal (au début si possible)
- bénéfice clair (résultat, “comment faire”, gain de temps)
- spécificité (chiffre, audience, contexte)

Templates (à adapter):
- \`{mot-clé} : {bénéfice} (guide + exemples)\`
- \`Comment {faire X} : méthode simple + checklist\`

## 2) Meta description: écrire pour le clic

Structure efficace:
1) bénéfice
2) preuve (exemples, checklist)
3) action (essayez l’outil)

Exemple:
> “Générez un title et une meta description optimisés en 1 minute. Templates + Open Graph. Essayez SimplePlate gratuitement.”

## 3) Open Graph & Twitter: votre aperçu sur les réseaux

Visez:
- image 16:9 lisible
- texte court
- cohérence avec la page

## Bonus: maillage interne utile

Deux liens qui aident souvent:
- URLs propres: [Générateur de slug](/tool/generateur-slug)
- Landing page rapide: [Générateur de site web](/tool/generateur-site-web)

## À lire aussi

- [Générateur de slug](/blog/generateur-de-slug-seo)
- [Générateur de site web](/blog/generateur-site-web)
- [Outils IA](/blog/top-10-outils-ia)
`,
    relatedSlugs: ['generateur-de-slug-seo', 'generateur-site-web', 'top-10-outils-ia'],
  },
  {
    slug: 'generateur-prompt-pro',
    h1: 'Générateur prompt pro',
    title: 'Générateur prompt pro : 12 templates qui sortent des réponses utiles (pas du blabla)',
    metaDescription:
      "Apprenez à écrire des prompts efficaces: contexte, contraintes, format, exemples. 12 templates prêts à copier + l’outil SimplePlate pour générer des prompts pro.",
    keywords: ['prompt engineering', 'générateur de prompt', 'prompt chatgpt', 'templates prompt', 'IA', 'copywriting'],
    publishedAt: '2025-12-16',
    readingTime: '10 min',
    cover: {
      src: '/blog/generateur-prompt-pro.svg',
      alt: 'Illustration : templates de prompt engineering pour obtenir de meilleures réponses IA',
    },
    excerpt:
      "La différence entre “moyen” et “excellent” avec une IA, c’est souvent le prompt. Voici une méthode simple + 12 templates pro à copier/coller.",
    bodyMarkdown: `## Prompts vagues = réponses vagues

Pour obtenir du concret, donnez:
- **contexte**
- **objectif**
- **contraintes**
- **format de sortie**
- **critères de qualité**

Générez un prompt complet automatiquement:
- [Générateur prompt pro](/tool/generateur-prompt-pro)

## La structure d’un prompt qui marche (copier/coller)

1) Rôle: “Tu es…”
2) Contexte: “Voici la situation…”
3) Objectif: “Je veux obtenir…”
4) Contraintes: “Respecte…”
5) Format: “Réponds en…”
6) Vérification: “Si info manquante, pose 3 questions.”

## 12 templates pro

### 1) Article SEO
- mot-clé: …
- public: …
- intention: …
- plan H2/H3 + FAQ + exemples

### 2) Landing page
- problème → solution → preuves → FAQ → CTA

### 3) Audit SEO rapide
- 15 actions classées par impact

### 4) Email commercial
- objection principale + CTA

### 5) Script vidéo
- hook + structure + punchlines

### 6) Post LinkedIn
- angle + storytelling + CTA soft

### 7) Fiche produit
- bénéfices + objections + mini‑FAQ

### 8) Tableau / checklist
- format Markdown

### 9) Prompt “anti-hallucination”
- “Si tu ne sais pas, dis-le. Liste les hypothèses.”

### 10) Réécriture plus naturelle
- ton + vocabulaire + variations de rythme

### 11) Génération d’exemples
- 20 exemples classés

### 12) Version courte / version longue
- 2 rendus pour choisir

## Astuce: rendre le texte plus naturel

- [Humaniseur de texte](/tool/humaniseur-texte)
- [Détecteur de texte IA](/tool/detecteur-texte-ia)

## À lire aussi

- [Humaniseur de texte IA](/blog/humaniseur-texte-ia)
- [Détecteur de texte IA](/blog/detecteur-texte-ia)
`,
    relatedSlugs: ['humaniseur-texte-ia', 'detecteur-texte-ia', 'generateur-seo-meta'],
  },
  {
    slug: 'humaniseur-texte-ia',
    h1: 'Humaniseur de texte IA',
    title: 'Humaniseur de texte IA : rendre un texte ChatGPT plus naturel (méthode + exemples)',
    metaDescription:
      "Transformez un texte “trop IA” en texte naturel: rythme, variations, exemples, vocabulaire et ton. Méthode simple + Humaniseur SimplePlate pour reformuler vite.",
    keywords: ['humaniseur de texte', 'humaniser texte chatgpt', 'reformuler texte', 'texte naturel', 'style rédaction', 'IA'],
    publishedAt: '2025-12-15',
    readingTime: '9 min',
    cover: {
      src: '/blog/humaniseur-texte-ia.svg',
      alt: 'Illustration : reformulation pour rendre un texte IA plus naturel et fluide',
    },
    excerpt:
      "Un texte peut être “correct” et pourtant sonner artificiel. Voici une checklist pour le rendre humain (sans perdre l’idée), plus l’outil SimplePlate.",
    bodyMarkdown: `## Pourquoi un texte “sonne IA”

Les signaux fréquents:
- phrases trop régulières (même longueur)
- vocabulaire trop générique
- manque d’exemples concrets

Reformulez rapidement:
- [Humaniseur de texte](/tool/humaniseur-texte)

## Checklist de réécriture (rapide)

### 1) Ajoutez du concret
Remplacez 1 phrase abstraite par:
- un exemple
- un mini-cas
- un chiffre (si vous en avez)

### 2) Variez le rythme
Mélangez phrases courtes + phrases plus longues.

### 3) Remettez du point de vue
Ajoutez:
- “si vous débutez…”
- “erreur classique: …”

### 4) Simplifiez le vocabulaire
Préférez des mots simples et précis.

## Workflow SimplePlate (en 2 minutes)

1) Générer un plan: [Générateur prompt pro](/tool/generateur-prompt-pro)
2) Humaniser: [Humaniseur](/tool/humaniseur-texte)
3) Vérifier: [Détecteur IA](/tool/detecteur-texte-ia)
4) Optimiser le snippet: [Générateur SEO meta](/tool/generateur-seo-meta)

## À lire aussi

- [Détecteur de texte IA](/blog/detecteur-texte-ia)
- [Générateur prompt pro](/blog/generateur-prompt-pro)
`,
    relatedSlugs: ['detecteur-texte-ia', 'generateur-prompt-pro', 'generateur-seo-meta'],
  },
  {
    slug: 'csv-vers-json-en-ligne',
    h1: 'CSV vers JSON',
    title: 'CSV vers JSON en ligne : convertir proprement (exemples, erreurs fréquentes, guide)',
    metaDescription:
      "Convertissez un CSV en JSON propre: délimiteurs, guillemets, types, encodage. Guide + exemples + convertisseur CSV→JSON SimplePlate en ligne.",
    keywords: ['csv vers json', 'convertisseur csv json', 'csv to json', 'json', 'api', 'dev'],
    publishedAt: '2025-12-14',
    readingTime: '8 min',
    cover: {
      src: '/blog/csv-vers-json-en-ligne.svg',
      alt: 'Illustration : conversion de données CSV vers JSON pour API et développement',
    },
    excerpt:
      "Le CSV est pratique, mais dès qu’on parle API, le JSON gagne. Voici comment convertir proprement (et éviter les erreurs classiques) avec SimplePlate.",
    bodyMarkdown: `## Quand convertir CSV → JSON

Cas typiques:
- importer des données (produits, leads, inventaire)
- préparer un payload d’API
- transformer un export Excel/Sheets

Outil:
- [CSV vers JSON](/tool/csv-vers-json)

## Les 5 erreurs fréquentes

1) mauvais séparateur (virgule vs point-virgule)
2) guillemets mal fermés
3) colonnes décalées
4) encodage (accents)
5) types (tout en string)

## Vérifier / nettoyer le JSON

Après conversion:
- [Formateur JSON](/tool/formateur-json)

## Bonus SEO: documentez votre format

- slugs propres: [Générateur de slug](/tool/generateur-slug)
- meta tags: [Générateur SEO meta](/tool/generateur-seo-meta)

## À lire aussi

- [Formateur JSON](/blog/formateur-json-en-ligne)
- [Générateur de slug](/blog/generateur-de-slug-seo)
`,
    relatedSlugs: ['formateur-json-en-ligne', 'generateur-de-slug-seo', 'generateur-seo-meta'],
  },
  {
    slug: 'analyseur-texte-compteur-mots',
    h1: 'Analyseur de texte',
    title: 'Analyseur de texte : compteur de mots, lisibilité et optimisation (guide)',
    metaDescription:
      "Analysez un texte: mots, caractères, répétitions, lisibilité et structure. Guide simple + Analyseur de texte SimplePlate pour auditer en 1 clic avant publication.",
    keywords: ['analyseur de texte', 'compteur de mots', 'nombre de caractères', 'lisibilité', 'audit contenu', 'seo contenu'],
    publishedAt: '2025-12-13',
    readingTime: '8 min',
    cover: {
      src: '/blog/analyseur-texte-compteur-mots.svg',
      alt: 'Illustration : analyse de texte (mots, caractères, lisibilité) pour améliorer un contenu',
    },
    excerpt:
      "Avant de publier, auditez votre texte: longueur, structure, répétitions et lisibilité. Voici quoi regarder + l’outil SimplePlate pour mesurer vite.",
    bodyMarkdown: `## Pourquoi analyser un texte avant publication

Deux objectifs:
- **clarté** (l’utilisateur comprend vite)
- **structure** (scannable: titres, listes, FAQ)

Outil:
- [Analyseur de texte](/tool/analyseur-texte)

## 1) Longueur: mots et caractères

Vérifiez:
- trop court: répond-il vraiment à l’intention ?
- trop long: manque de structure ?

## 2) Structure: titres, listes, étapes

Un bon contenu se lit en diagonale:
- H2/H3 utiles
- listes actionnables
- exemples

## Workflow SimplePlate

1) Créer un plan: [Générateur prompt pro](/tool/generateur-prompt-pro)
2) Humaniser: [Humaniseur](/tool/humaniseur-texte)
3) Mesurer: [Analyseur de texte](/tool/analyseur-texte)
4) Optimiser le snippet: [Générateur SEO meta](/tool/generateur-seo-meta)

## À lire aussi

- [Humaniseur de texte IA](/blog/humaniseur-texte-ia)
- [Générateur SEO meta](/blog/generateur-seo-meta)
`,
    relatedSlugs: ['humaniseur-texte-ia', 'generateur-seo-meta', 'generateur-prompt-pro'],
  },
  {
    slug: 'detecteur-arnaques-sms',
    h1: "Détecteur d'arnaques",
    title: "Détecteur d'arnaques SMS : reconnaître une arnaque et quoi faire (guide + IA)",
    metaDescription:
      "Apprenez à repérer une arnaque SMS/téléphone: signaux, exemples, erreurs à éviter. Analysez un message avec le Détecteur d’arnaques SimplePlate en ligne.",
    keywords: ['arnaque sms', 'détecteur arnaques', 'phishing', 'smishing', 'arnaque colis', 'arnaque bancaire'],
    publishedAt: '2025-12-12',
    readingTime: '9 min',
    cover: {
      src: '/blog/detecteur-arnaques-sms.svg',
      alt: "Illustration : détection d'arnaques SMS (phishing/smishing) avec analyse IA",
    },
    excerpt:
      "Les arnaques SMS deviennent crédibles. Voici une checklist simple, des exemples, et comment analyser un message avec l’outil SimplePlate.",
    bodyMarkdown: `## Les signaux qui reviennent tout le temps

1) urgence (“dernier rappel”, “compte bloqué”)
2) lien suspect (domaine proche, URL courte)
3) demande d’infos sensibles (carte, code, identifiants)
4) ton administratif trop générique

Outil:
- [Détecteur d'arnaques](/tool/detecteur-arnaques)

## Que faire si vous avez un doute

- ne cliquez pas
- ne répondez pas avec des infos personnelles
- vérifiez via le site officiel (URL tapée à la main)
- conservez une capture si besoin

## À lire aussi

- [Outils IA](/blog/top-10-outils-ia)
`,
    relatedSlugs: ['top-10-outils-ia', 'generateur-seo-meta', 'analyseur-texte-compteur-mots'],
  },
  {
    slug: 'simulateur-tjm-freelance',
    h1: 'Simulateur TJM freelance',
    title: 'Simulateur TJM freelance : calculer un tarif rentable (charges, congés, objectifs)',
    metaDescription:
      "Calculez votre TJM freelance rentable: charges, jours non facturés, objectifs et marge. Méthode claire + simulateur SimplePlate pour estimer rapidement.",
    keywords: ['simulateur tjm', 'tjm freelance', 'tarif freelance', 'auto-entrepreneur', 'salaire net', 'calcul tjm'],
    publishedAt: '2025-12-11',
    readingTime: '9 min',
    cover: {
      src: '/blog/simulateur-tjm-freelance.svg',
      alt: 'Illustration : calcul du TJM freelance (rentabilité, charges, salaire net)',
    },
    excerpt:
      "Un TJM “au feeling” finit souvent trop bas. Voici une méthode simple (jours facturés, charges, marge) + le simulateur SimplePlate.",
    bodyMarkdown: `## Le piège classique: oublier les jours non facturés

Vous ne facturez pas 220 jours/an. Il faut compter:
- prospection
- admin (factures, compta)
- congés
- formation

Outil:
- [Simulateur TJM freelance](/tool/simulateur-tjm-freelance)

## Méthode simple

1) objectif net mensuel
2) charges/impôts (selon statut)
3) jours facturés réalistes
4) marge de sécurité

## Bonus: mesurer un ROI

Pour vos actions marketing:
- [Calculatrice ROI](/tool/calculatrice-roi)

## À lire aussi

- [Générateur de facture](/blog/generateur-de-facture)
- [Calculatrice ROI marketing](/blog/calculatrice-roi-marketing)
`,
    relatedSlugs: ['generateur-de-facture', 'calculatrice-roi-marketing', 'top-10-outils-ia'],
  },
  {
    slug: 'calculatrice-roi-marketing',
    h1: 'Calculatrice ROI marketing',
    title: 'Calculatrice ROI marketing : mesurer une campagne (marge, coût, break-even) facilement',
    metaDescription:
      "Mesurez le ROI d’une campagne: coût, revenus, marge, break-even et décisions. Méthode simple + calculatrice ROI SimplePlate pour optimiser vos investissements.",
    keywords: ['calculatrice roi', 'roi marketing', 'break even', 'marge', 'rentabilité', 'acquisition'],
    publishedAt: '2025-12-10',
    readingTime: '8 min',
    cover: {
      src: '/blog/calculatrice-roi-marketing.svg',
      alt: 'Illustration : calcul du ROI marketing et du break-even pour optimiser une campagne',
    },
    excerpt:
      "Sans ROI clair, vous “espérez”. Voici comment calculer la rentabilité (marge, coûts, break-even) et décider quoi couper / amplifier.",
    bodyMarkdown: `## Le ROI: la question la plus simple (et la plus ignorée)

ROI = “est-ce que ça rapporte plus que ça coûte?”

Outil:
- [Calculatrice ROI](/tool/calculatrice-roi)

## 1) Les variables à poser

- coût total (ads + créa + outils)
- revenus attribués
- marge (si e‑commerce)
- période (7j / 30j / 90j)

## 2) Break-even: à partir de quand c’est rentable

Le break-even aide à décider:
- couper trop tôt (erreur)
- continuer une campagne perdante (erreur)

## 3) Décider: stop, itérer, scaler

Règle simple:
- ROI négatif → itérer (offre, créa, cible)
- ROI positif → scaler progressivement

## À lire aussi

- [Simulateur TJM freelance](/blog/simulateur-tjm-freelance)
- [Générateur de facture](/blog/generateur-de-facture)
`,
    relatedSlugs: ['simulateur-tjm-freelance', 'generateur-de-facture', 'top-10-outils-ia'],
  },
];

export function getBlogPostBySlug(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getBlogPosts() {
  // newest first
  return [...BLOG_POSTS].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}
