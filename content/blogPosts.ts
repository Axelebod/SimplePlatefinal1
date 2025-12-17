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
];

export function getBlogPostBySlug(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getBlogPosts() {
  // newest first
  return [...BLOG_POSTS].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}
