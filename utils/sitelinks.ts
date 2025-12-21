/**
 * Configuration des sitelinks pour Google Search
 * Les sitelinks apparaissent sous le résultat principal dans les SERP
 */

export interface Sitelink {
  name: string;
  url: string;
}

export const STUDIO_SITELINKS: Sitelink[] = [
  { name: 'Soumettre un projet', url: '/studio/submit' },
  { name: 'Voir les projets', url: '/studio' },
  { name: 'Classement', url: '/studio' },
  { name: 'À propos', url: '/about' },
];

export const STUDIO_SITELINKS_EN: Sitelink[] = [
  { name: 'Submit Project', url: '/studio/submit' },
  { name: 'View Projects', url: '/studio' },
  { name: 'Leaderboard', url: '/studio' },
  { name: 'About', url: '/about' },
];

// Outils principaux avec leurs sitelinks
export const MAIN_TOOLS_SITELINKS: Record<string, { fr: Sitelink[]; en: Sitelink[] }> = {
  'business-plan-pro': {
    fr: [
      { name: 'Générer un business plan', url: '/tool/business-plan-pro' },
      { name: 'Modèles de business plan', url: '/tool/business-plan-pro' },
      { name: 'Analyse de marché', url: '/tool/business-plan-pro' },
      { name: 'Stratégie marketing', url: '/tool/business-plan-pro' },
    ],
    en: [
      { name: 'Generate business plan', url: '/tool/business-plan-pro' },
      { name: 'Business plan templates', url: '/tool/business-plan-pro' },
      { name: 'Market analysis', url: '/tool/business-plan-pro' },
      { name: 'Marketing strategy', url: '/tool/business-plan-pro' },
    ],
  },
  'json-formatter': {
    fr: [
      { name: 'Formatter JSON', url: '/tool/formateur-json' },
      { name: 'Valider JSON', url: '/tool/formateur-json' },
      { name: 'Minifier JSON', url: '/tool/formateur-json' },
      { name: 'Convertir JSON', url: '/tool/formateur-json' },
    ],
    en: [
      { name: 'Format JSON', url: '/tool/formateur-json' },
      { name: 'Validate JSON', url: '/tool/formateur-json' },
      { name: 'Minify JSON', url: '/tool/formateur-json' },
      { name: 'Convert JSON', url: '/tool/formateur-json' },
    ],
  },
  'seo-meta-generator': {
    fr: [
      { name: 'Générer meta tags', url: '/tool/generateur-seo-meta' },
      { name: 'Optimiser SEO', url: '/tool/generateur-seo-meta' },
      { name: 'Open Graph', url: '/tool/generateur-seo-meta' },
      { name: 'Twitter Cards', url: '/tool/generateur-seo-meta' },
    ],
    en: [
      { name: 'Generate meta tags', url: '/tool/generateur-seo-meta' },
      { name: 'Optimize SEO', url: '/tool/generateur-seo-meta' },
      { name: 'Open Graph', url: '/tool/generateur-seo-meta' },
      { name: 'Twitter Cards', url: '/tool/generateur-seo-meta' },
    ],
  },
  'ai-image-analysis': {
    fr: [
      { name: 'Analyser image IA', url: '/tool/analyse-image-ia' },
      { name: 'Détecter IA', url: '/tool/analyse-image-ia' },
      { name: 'Reverse prompt', url: '/tool/analyse-image-ia' },
      { name: 'Analyse technique', url: '/tool/analyse-image-ia' },
    ],
    en: [
      { name: 'Analyze AI image', url: '/tool/analyse-image-ia' },
      { name: 'Detect AI', url: '/tool/analyse-image-ia' },
      { name: 'Reverse prompt', url: '/tool/analyse-image-ia' },
      { name: 'Technical analysis', url: '/tool/analyse-image-ia' },
    ],
  },
  'website-generator': {
    fr: [
      { name: 'Créer site web', url: '/tool/generateur-site-web' },
      { name: 'Générer HTML', url: '/tool/generateur-site-web' },
      { name: 'Templates site', url: '/tool/generateur-site-web' },
      { name: 'Code HTML/CSS', url: '/tool/generateur-site-web' },
    ],
    en: [
      { name: 'Create website', url: '/tool/generateur-site-web' },
      { name: 'Generate HTML', url: '/tool/generateur-site-web' },
      { name: 'Website templates', url: '/tool/generateur-site-web' },
      { name: 'HTML/CSS code', url: '/tool/generateur-site-web' },
    ],
  },
};

/**
 * Génère le JSON-LD pour les sitelinks d'un WebSite
 */
export function generateSitelinksJsonLd(
  baseUrl: string,
  sitelinks: Sitelink[],
  language: 'fr' | 'en' = 'fr'
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}#website`,
    url: baseUrl,
    name: language === 'fr' ? 'SimplePlate AI' : 'SimplePlate AI',
    inLanguage: language,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    // Sitelinks via mainEntity
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: sitelinks.map((link, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: link.name,
        url: `${baseUrl}${link.url}`,
      })),
    },
  };
}

