import { useEffect } from 'react';
import type { Language } from '../utils/seo';
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

type UseSEOParams = {
  title: string;
  description: string;
  language: Language;
  keywords?: string[];
  noindex?: boolean;
  imagePath?: string; // absolute or path starting with /
  ogType?: 'website' | 'article';
  publishedTime?: string; // ISO 8601 (for articles)
  modifiedTime?: string; // ISO 8601 (for articles)
  jsonLd?: unknown | null;
  jsonLdId?: string;
};

export function useSEO(params: UseSEOParams) {
  useEffect(() => {
    document.title = params.title;
    updateMeta('description', params.description);

    if (params.keywords?.length) {
      updateMeta('keywords', params.keywords.join(', '));
    }

    // HTML language
    document.documentElement.lang = params.language;

    // Canonical + hreflang alternates
    const canonical = buildUrlForCurrentPath(params.language);
    setCanonical(canonical);

    const alternates = buildAlternateUrls();
    updateLink('alternate', { hreflang: 'fr', href: alternates.fr });
    updateLink('alternate', { hreflang: 'en', href: alternates.en });
    updateLink('alternate', { hreflang: 'x-default', href: alternates.xDefault });

    // Robots
    setRobots({ index: !params.noindex, follow: !params.noindex });

    // Social
    const image = params.imagePath
      ? params.imagePath.startsWith('http')
        ? params.imagePath
        : `${window.location.origin}${params.imagePath}`
      : undefined;
    applySocialMeta({
      title: params.title,
      description: params.description,
      url: canonical,
      image,
      language: params.language,
      type: params.ogType,
      publishedTime: params.publishedTime,
      modifiedTime: params.modifiedTime,
    });

    // JSON-LD (optional)
    if (params.jsonLdId) {
      setJsonLd(params.jsonLdId, params.jsonLd ?? null);
    }

    return () => {
      if (params.jsonLdId) {
        setJsonLd(params.jsonLdId, null);
      }
    };
  }, [
    params.title,
    params.description,
    params.language,
    params.noindex,
    params.imagePath,
    params.ogType,
    params.publishedTime,
    params.modifiedTime,
    params.jsonLdId,
    // keywords array identity can change; stringify to keep stable
    params.keywords ? params.keywords.join('|') : '',
    // jsonLd may be object; we rely on caller to pass stable, or accept rerenders
    params.jsonLd,
  ]);
}

