export type Language = 'fr' | 'en';

export const DEFAULT_OG_IMAGE_PATH = '/favicon/web-app-manifest-512x512.png';

type MetaAttr = 'name' | 'property';

const JSON_LD_TYPE = 'application/ld+json';

export function updateMeta(name: string, content: string, attr: MetaAttr = 'name') {
  let element = document.querySelector(`meta[${attr}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

export function updateLink(rel: string, attrs: Record<string, string>) {
  let element = document.querySelector(`link[rel="${rel}"]${attrs.hreflang ? `[hreflang="${attrs.hreflang}"]` : ''}`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  for (const [k, v] of Object.entries(attrs)) {
    element.setAttribute(k, v);
  }
}

export function setCanonical(href: string) {
  updateLink('canonical', { href });
}

export function setRobots(opts: { index?: boolean; follow?: boolean } = {}) {
  const index = opts.index ?? true;
  const follow = opts.follow ?? true;
  updateMeta('robots', `${index ? 'index' : 'noindex'},${follow ? 'follow' : 'nofollow'}`);
}

export function setJsonLd(id: string, data: unknown | null) {
  const existing = document.getElementById(id);
  if (data === null) {
    if (existing) existing.remove();
    return;
  }

  let script = existing as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = JSON_LD_TYPE;
    document.head.appendChild(script);
  }
  script.text = JSON.stringify(data);
}

function normalizeUrl(u: URL) {
  // Keep query stable (mostly for canonical consistency)
  const params = new URLSearchParams(u.search);
  const sorted = new URLSearchParams();
  Array.from(params.keys())
    .sort()
    .forEach((k) => {
      const values = params.getAll(k);
      values.forEach((v) => sorted.append(k, v));
    });
  u.search = sorted.toString() ? `?${sorted.toString()}` : '';
  return u.toString();
}

export function buildUrlForCurrentPath(lang: Language) {
  const url = new URL(window.location.href);
  url.hash = '';
  url.searchParams.set('lang', lang);
  return normalizeUrl(url);
}

export function buildAlternateUrls() {
  const url = new URL(window.location.href);
  url.hash = '';

  const base = new URL(url.toString());
  base.searchParams.delete('lang');

  const fr = new URL(base.toString());
  fr.searchParams.set('lang', 'fr');

  const en = new URL(base.toString());
  en.searchParams.set('lang', 'en');

  // x-default: keep clean URL without lang (lets Google choose)
  const xDefault = new URL(base.toString());

  return {
    fr: normalizeUrl(fr),
    en: normalizeUrl(en),
    xDefault: normalizeUrl(xDefault),
  };
}

export function applySocialMeta(params: {
  title: string;
  description: string;
  url: string;
  image?: string;
  language: Language;
  type?: 'website' | 'article';
  publishedTime?: string; // ISO 8601
  modifiedTime?: string; // ISO 8601
}) {
  const image = params.image || `${window.location.origin}${DEFAULT_OG_IMAGE_PATH}`;

  // Open Graph
  updateMeta('og:title', params.title, 'property');
  updateMeta('og:description', params.description, 'property');
  updateMeta('og:type', params.type ?? 'website', 'property');
  updateMeta('og:url', params.url, 'property');
  updateMeta('og:image', image, 'property');
  updateMeta('og:site_name', 'SimplePlate AI', 'property');
  updateMeta('og:locale', params.language === 'en' ? 'en_US' : 'fr_FR', 'property');
  updateMeta('og:locale:alternate', params.language === 'en' ? 'fr_FR' : 'en_US', 'property');

  // Article metadata (only if relevant)
  if (params.type === 'article') {
    if (params.publishedTime) updateMeta('article:published_time', params.publishedTime, 'property');
    if (params.modifiedTime) updateMeta('article:modified_time', params.modifiedTime, 'property');
    if (params.modifiedTime) updateMeta('og:updated_time', params.modifiedTime, 'property');
  }

  // Twitter
  updateMeta('twitter:card', 'summary_large_image');
  updateMeta('twitter:title', params.title);
  updateMeta('twitter:description', params.description);
  updateMeta('twitter:image', image);
}

