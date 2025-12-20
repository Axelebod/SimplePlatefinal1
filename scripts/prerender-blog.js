// Prerender blog routes into static HTML files in /dist.
// Run AFTER:
// - vite build (client) -> dist/index.html exists
// - vite build --ssr entry-server.tsx --outDir dist-ssr -> dist-ssr/entry-server.js exists
//
// Usage: node scripts/prerender-blog.js

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');
const DIST_SSR_DIR = path.join(ROOT, 'dist-ssr');

const BASE_URL = process.env.SITE_URL || 'https://simpleplate.dev';

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function replaceOrInsertTitle(html, title) {
  const next = `<title>${escapeHtml(title)}</title>`;
  if (html.includes('<title>')) {
    return html.replace(/<title>[\s\S]*?<\/title>/i, next);
  }
  return html.replace(/<\/head>/i, `${next}\n</head>`);
}

function replaceOrInsertMeta(html, attrName, attrValue, content) {
  // attrName: 'name' or 'property'
  const safeValue = escapeHtml(attrValue);
  const safeContent = escapeHtml(content);
  const re = new RegExp(`<meta\\s+[^>]*${attrName}=["']${attrValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>`, 'i');
  const tag = `<meta ${attrName}="${safeValue}" content="${safeContent}">`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace(/<\/head>/i, `${tag}\n</head>`);
}

function replaceOrInsertLinkCanonical(html, href) {
  const tag = `<link rel="canonical" href="${escapeHtml(href)}">`;
  const re = /<link\s+rel=["']canonical["'][^>]*>/i;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace(/<\/head>/i, `${tag}\n</head>`);
}

function removeExistingAlternateLinks(html) {
  return html.replace(/<link\s+rel=["']alternate["'][^>]*>\s*/gi, '');
}

function insertAlternateLinks(html, alternates) {
  // alternates: [{hreflang, href}]
  const tags = alternates
    .map((a) => `<link rel="alternate" hreflang="${escapeHtml(a.hreflang)}" href="${escapeHtml(a.href)}">`)
    .join('\n');
  return html.replace(/<\/head>/i, `${tags}\n</head>`);
}

function insertJsonLd(html, id, data) {
  // Do NOT HTML-escape JSON, it must remain valid JSON.
  // We only escape "<" to avoid ending the script tag in HTML parsing contexts.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  const tag = `<script type="application/ld+json" id="${escapeHtml(id)}">${json}</script>`;
  // Remove previous script with same id if any
  const re = new RegExp(`<script[^>]*id=["']${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][\\s\\S]*?<\\/script>\\s*`, 'i');
  const cleaned = html.replace(re, '');
  return cleaned.replace(/<\/head>/i, `${tag}\n</head>`);
}

function injectAppHtml(templateHtml, appHtml) {
  return templateHtml.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
}

function extractBlogMetaFromSource() {
  const blogPath = path.join(ROOT, 'content', 'blogPosts.ts');
  const content = fs.readFileSync(blogPath, 'utf8');

  const posts = [];

  // Best-effort extraction: slug + title + metaDescription + publishedAt + cover.src + cover.alt
  for (const m of content.matchAll(
    /\{\s*[\s\S]*?slug:\s*'([^']+)'\s*,[\s\S]*?title:\s*(['"])([\s\S]*?)\2\s*,[\s\S]*?metaDescription:\s*(['"])([\s\S]*?)\4\s*,[\s\S]*?publishedAt:\s*'([^']+)'\s*,[\s\S]*?cover:\s*\{\s*[\s\S]*?src:\s*'([^']+)'\s*,[\s\S]*?alt:\s*(['"])([\s\S]*?)\8\s*[\s\S]*?\}\s*,/g
  )) {
    posts.push({
      slug: m[1],
      title: m[3],
      metaDescription: m[5],
      publishedAt: m[6],
      coverSrc: m[7],
      coverAlt: m[9],
    });
  }

  // Fallback: capture any slug not matched above (won't have rich meta)
  const known = new Set(posts.map((p) => p.slug));
  for (const m of content.matchAll(/slug:\s*'([^']+)'/g)) {
    if (!known.has(m[1])) posts.push({ slug: m[1] });
  }

  // Unique by slug
  const bySlug = new Map();
  for (const p of posts) bySlug.set(p.slug, { ...bySlug.get(p.slug), ...p });
  return Array.from(bySlug.values()).filter(Boolean);
}

async function loadServerRenderer() {
  if (!fs.existsSync(DIST_SSR_DIR)) {
    throw new Error('dist-ssr not found. Run `vite build --ssr entry-server.tsx --outDir dist-ssr` first.');
  }

  const files = fs.readdirSync(DIST_SSR_DIR);
  const assetsDir = path.join(DIST_SSR_DIR, 'assets');
  const assetFiles = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir).map((f) => `assets/${f}`) : [];

  const candidates = [...files, ...assetFiles].filter((f) => f.endsWith('.js'));
  const entry =
    candidates.find((f) => f.includes('entry-server') && f.endsWith('.js')) || candidates.find((f) => f.endsWith('.js'));
  if (!entry) throw new Error('Could not find SSR entry in dist-ssr.');

  const mod = await import(pathToFileURL(path.join(DIST_SSR_DIR, entry)).href);
  if (typeof mod.render !== 'function') throw new Error('SSR entry does not export `render(url)`.');
  return mod.render;
}

function buildAlternateUrls(pathname) {
  // Keep consistent with current app (query-based lang)
  return [
    { hreflang: 'fr', href: `${BASE_URL}${pathname}?lang=fr` },
    { hreflang: 'en', href: `${BASE_URL}${pathname}?lang=en` },
    { hreflang: 'x-default', href: `${BASE_URL}${pathname}` },
  ];
}

function blogIndexHead() {
  const title = 'Blog | SimplePlate AI';
  const description =
    "Articles SimplePlate: SEO, outils IA, productivité, web et business. Guides pratiques pour utiliser SimplePlate et gagner du temps.";
  const url = `${BASE_URL}/blog?lang=fr`;
  return {
    title,
    description,
    canonical: url,
    alternates: buildAlternateUrls('/blog'),
    og: { type: 'website', url },
  };
}

function blogPostHead(post) {
  const title = post.title || 'Article | SimplePlate AI';
  const description = post.metaDescription || 'Article SimplePlate.';
  const pathname = `/blog/${post.slug}`;
  const canonical = `${BASE_URL}${pathname}?lang=fr`;
  const image = post.coverSrc ? (post.coverSrc.startsWith('http') ? post.coverSrc : `${BASE_URL}${post.coverSrc}`) : undefined;
  const publishedTime = post.publishedAt ? new Date(`${post.publishedAt}T00:00:00.000Z`).toISOString() : undefined;

  const jsonLdBlogPosting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished: publishedTime || post.publishedAt,
    dateModified: publishedTime || post.publishedAt,
    image: image ? [image] : undefined,
    inLanguage: 'fr',
    author: { '@type': 'Organization', name: 'SimplePlate' },
    publisher: {
      '@type': 'Organization',
      name: 'SimplePlate AI',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/favicon/web-app-manifest-512x512.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
  };

  const jsonLdBreadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${BASE_URL}/?lang=fr` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog?lang=fr` },
      { '@type': 'ListItem', position: 3, name: title, item: canonical },
    ],
  };

  return {
    title,
    description,
    canonical,
    alternates: buildAlternateUrls(pathname),
    og: { type: 'article', url: canonical, image, publishedTime, modifiedTime: publishedTime },
    jsonLd: [jsonLdBlogPosting, jsonLdBreadcrumbs],
  };
}

function applyHead(templateHtml, head) {
  let html = templateHtml;

  html = replaceOrInsertTitle(html, head.title);
  html = replaceOrInsertMeta(html, 'name', 'description', head.description);
  html = replaceOrInsertLinkCanonical(html, head.canonical);

  // OpenGraph/Twitter defaults (override)
  html = replaceOrInsertMeta(html, 'property', 'og:title', head.title);
  html = replaceOrInsertMeta(html, 'property', 'og:description', head.description);
  html = replaceOrInsertMeta(html, 'property', 'og:type', head.og?.type || 'website');
  html = replaceOrInsertMeta(html, 'property', 'og:url', head.og?.url || head.canonical);
  if (head.og?.image) html = replaceOrInsertMeta(html, 'property', 'og:image', head.og.image);
  if (head.og?.type === 'article' && head.og?.publishedTime) {
    html = replaceOrInsertMeta(html, 'property', 'article:published_time', head.og.publishedTime);
    html = replaceOrInsertMeta(html, 'property', 'article:modified_time', head.og.modifiedTime || head.og.publishedTime);
    html = replaceOrInsertMeta(html, 'property', 'og:updated_time', head.og.modifiedTime || head.og.publishedTime);
  }

  html = replaceOrInsertMeta(html, 'name', 'twitter:title', head.title);
  html = replaceOrInsertMeta(html, 'name', 'twitter:description', head.description);
  if (head.og?.image) html = replaceOrInsertMeta(html, 'name', 'twitter:image', head.og.image);

  // hreflang
  html = removeExistingAlternateLinks(html);
  html = insertAlternateLinks(html, head.alternates || []);

  // JSON-LD (optional)
  if (head.jsonLd) {
    html = insertJsonLd(html, 'json-ld-prerender', head.jsonLd);
  }

  return html;
}

async function main() {
  if (!fs.existsSync(DIST_DIR)) throw new Error('dist not found. Run `vite build` first.');

  const templatePath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(templatePath)) throw new Error('dist/index.html not found. Run `vite build` first.');
  const template = fs.readFileSync(templatePath, 'utf8');

  const render = await loadServerRenderer();
  const posts = extractBlogMetaFromSource();

  const routes = [
    { url: '/blog?lang=fr', outDir: path.join(DIST_DIR, 'blog'), head: blogIndexHead() },
    ...posts
      .filter((p) => p.slug)
      .map((p) => ({
        url: `/blog/${p.slug}?lang=fr`,
        outDir: path.join(DIST_DIR, 'blog', p.slug),
        head: blogPostHead(p),
      })),
  ];

  for (const r of routes) {
    const appHtml = render(r.url);
    let html = injectAppHtml(template, appHtml);
    html = applyHead(html, r.head);

    ensureDir(r.outDir);
    fs.writeFileSync(path.join(r.outDir, 'index.html'), html, 'utf8');
  }

  // eslint-disable-next-line no-console
  console.log(`✅ Prerendered ${routes.length} blog pages into ${DIST_DIR}/blog`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

