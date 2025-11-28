import { useEffect } from 'react';
import { ToolConfig } from '../types';

export const useToolSEO = (tool: ToolConfig | undefined) => {
  useEffect(() => {
    if (!tool) {
      document.title = "Outil non trouvé | SimplePlate";
      return;
    }

    // Reset states on tool change
    // 1. Title
    document.title = tool.seo.title;

    // Helper to update meta tags
    const updateMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Basic Metas
    updateMeta('description', tool.seo.description);
    updateMeta('keywords', tool.seo.keywords.join(', '));

    // 3. Open Graph (Social Media)
    updateMeta('og:title', tool.seo.title, 'property');
    updateMeta('og:description', tool.seo.description, 'property');
    updateMeta('og:type', 'website', 'property');
    updateMeta('og:url', window.location.href, 'property');
    updateMeta('og:image', `${window.location.origin}/og-image.png`, 'property');
    updateMeta('og:locale', 'fr_FR', 'property');
    updateMeta('og:site_name', 'SimplePlate AI', 'property');
    
    // 4. Twitter Card
    updateMeta('twitter:card', 'summary_large_image', 'name');
    updateMeta('twitter:title', tool.seo.title, 'name');
    updateMeta('twitter:description', tool.seo.description, 'name');
    updateMeta('twitter:image', `${window.location.origin}/og-image.png`, 'name');
    
    // 5. Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);

    // 6. JSON-LD Structured Data
    const scriptId = 'json-ld-tool';
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": tool.title,
      "description": tool.seo.description,
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "url": window.location.href,
      "offers": {
        "@type": "Offer",
        "price": tool.cost === 0 ? "0" : "0.10",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock"
      },
      "featureList": tool.seo.keywords.join(', '),
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "150"
      }
    };

    script.innerHTML = JSON.stringify(schemaData);
    
    // 7. FAQ Schema
    const faqScriptId = 'json-ld-faq';
    let faqScript = document.getElementById(faqScriptId);
    if (!faqScript) {
      faqScript = document.createElement('script');
      faqScript.id = faqScriptId;
      faqScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(faqScript);
    }
    
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `Combien coûte l'utilisation de ${tool.title} ?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": tool.cost === 0 
              ? `${tool.title} est entièrement gratuit et ne consomme aucun crédit.`
              : `L'utilisation de ${tool.title} coûte ${tool.cost} crédit${tool.cost > 1 ? 's' : ''} par génération.`
          }
        },
        {
          "@type": "Question",
          "name": "Les résultats sont-ils de bonne qualité ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Oui, ${tool.title} utilise les dernières technologies d'intelligence artificielle pour générer des résultats professionnels et de haute qualité.`
          }
        },
        {
          "@type": "Question",
          "name": "Mes données sont-elles sécurisées ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolument. Toutes vos données sont traitées de manière sécurisée et ne sont jamais stockées ou partagées avec des tiers."
          }
        }
      ]
    };
    
    faqScript.innerHTML = JSON.stringify(faqSchema);

    // 8. Favicon dynamique
    let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = `/icons/${tool.iconName}.svg`;

  }, [tool]);
};

