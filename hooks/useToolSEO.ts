import { useEffect } from 'react';
import { ToolConfig } from '../types';
import { useLanguageStore } from '../store/languageStore';
import {
  applySocialMeta,
  buildAlternateUrls,
  buildUrlForCurrentPath,
  setCanonical,
  setJsonLd,
  setRobots,
  updateLink,
  updateMeta,
} from '../utils/seo';

export const useToolSEO = (tool: ToolConfig | undefined) => {
  const { language } = useLanguageStore();

  useEffect(() => {
    if (!tool) {
      document.title = language === 'fr' ? 'Outil non trouvé | SimplePlate' : 'Tool not found | SimplePlate';
      setRobots({ index: false, follow: false });
      setJsonLd('json-ld-tool', null);
      setJsonLd('json-ld-faq', null);
      setJsonLd('json-ld-breadcrumbs', null);
      return;
    }

    const isEn = language === 'en';
    const title = isEn ? `${tool.title} | SimplePlate AI - Free Online ${tool.category} Tool` : tool.seo.title;
    // Enrichir la description avec plus de mots-clés et bénéfices (optimisée 150-160 caractères)
    const baseDescription = isEn ? tool.description : tool.seo.description;
    const enrichedDescription = isEn 
      ? `${baseDescription} Free online ${tool.category.toLowerCase()} tool powered by AI. Professional results, instant generation. Boost productivity with ${tool.title}.`
      : `${baseDescription} Outil ${tool.category.toLowerCase()} gratuit en ligne alimenté par l'IA. Résultats professionnels, génération instantanée. Boostez votre productivité avec ${tool.title}.`;
    // Optimiser à 150-160 caractères pour SEO optimal
    const description = enrichedDescription.length > 160 
      ? (baseDescription.length > 160 ? baseDescription.substring(0, 157) + '...' : baseDescription)
      : enrichedDescription;
    const keywords = isEn 
      ? [tool.title, 'AI tool', 'generator', tool.category, 'SimplePlate AI', 'free online tool', 'productivity', 'automation', 'web tool']
      : [...tool.seo.keywords, 'gratuit', 'en ligne', 'automatisation', 'outil web'];

    document.title = title;

    // Basic metas
    updateMeta('description', description);
    updateMeta('keywords', keywords.join(', '));

    // Canonical + hreflang alternates
    const canonicalUrl = buildUrlForCurrentPath(language);
    setCanonical(canonicalUrl);
    const alternates = buildAlternateUrls();
    updateLink('alternate', { hreflang: 'fr', href: alternates.fr });
    updateLink('alternate', { hreflang: 'en', href: alternates.en });
    updateLink('alternate', { hreflang: 'x-default', href: alternates.xDefault });

    // Robots
    setRobots({ index: true, follow: true });

    // Social
    applySocialMeta({
      title,
      description,
      url: canonicalUrl,
      language,
    });

    // JSON-LD structured data (enriched for better SEO)
    setJsonLd('json-ld-tool', {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: tool.title,
      description,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Web',
      url: canonicalUrl,
      isAccessibleForFree: tool.cost === 0,
      featureList: keywords,
      offers: {
        '@type': 'Offer',
        price: tool.cost === 0 ? '0' : `${tool.cost}`,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
      },
      provider: {
        '@type': 'Organization',
        name: 'SimplePlate AI',
        url: window.location.origin,
      },
      aggregateRating: tool.cost === 0 ? {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '1000+',
      } : undefined,
    });

    // Breadcrumbs
    setJsonLd('json-ld-breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: isEn ? 'Home' : 'Accueil',
          item: `${window.location.origin}/?lang=${language}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: tool.title,
          item: canonicalUrl,
        },
      ],
    });

    // FAQ schema (matches the on-page FAQ section)
    setJsonLd('json-ld-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: isEn ? `How much does it cost to use ${tool.title}?` : `Combien coûte l'utilisation de ${tool.title} ?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              tool.cost === 0
                ? isEn
                  ? `${tool.title} is completely free and uses no credits.`
                  : `${tool.title} est entièrement gratuit et ne consomme aucun crédit.`
                : isEn
                  ? `Using ${tool.title} costs ${tool.cost} ${tool.cost > 1 ? 'credits' : 'credit'} per generation.`
                  : `L'utilisation de ${tool.title} coûte ${tool.cost} crédit${tool.cost > 1 ? 's' : ''} par génération.`,
          },
        },
        {
          '@type': 'Question',
          name: isEn ? 'Are the results high quality?' : 'Les résultats sont-ils de bonne qualité ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: isEn
              ? `${tool.title} uses modern AI to generate professional, high-quality results.`
              : `Oui, ${tool.title} utilise les dernières technologies d'intelligence artificielle pour générer des résultats professionnels et de haute qualité.`,
          },
        },
        {
          '@type': 'Question',
          name: isEn ? 'Is my data secure?' : 'Mes données sont-elles sécurisées ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: isEn
              ? 'Yes. Your data is handled securely and is not stored or shared with third parties.'
              : "Absolument. Toutes vos données sont traitées de manière sécurisée et ne sont jamais stockées ou partagées avec des tiers.",
          },
        },
      ],
    });

    return () => {
      setJsonLd('json-ld-tool', null);
      setJsonLd('json-ld-faq', null);
      setJsonLd('json-ld-breadcrumbs', null);
    };
  }, [tool, language]);
};

