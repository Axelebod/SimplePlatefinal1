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
    const title = isEn ? `${tool.title} | SimplePlate AI` : tool.seo.title;
    // Enrichir la description avec plus de mots-clés et bénéfices
    const baseDescription = isEn ? tool.description : tool.seo.description;
    const enrichedDescription = isEn 
      ? `${baseDescription} Free online ${tool.category.toLowerCase()} tool. Professional results, instant generation. Use ${tool.title} to boost productivity and save time.`
      : `${baseDescription} Outil ${tool.category.toLowerCase()} gratuit en ligne. Résultats professionnels, génération instantanée. Utilisez ${tool.title} pour booster votre productivité et gagner du temps.`;
    const description = enrichedDescription.length > 160 ? baseDescription : enrichedDescription; // Limiter à 160 caractères pour SEO
    const keywords = isEn ? [tool.title, 'AI tool', 'generator', tool.category, 'SimplePlate AI', 'free online tool', 'productivity'] : tool.seo.keywords;

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

    // JSON-LD structured data (avoid fake ratings/offers)
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

