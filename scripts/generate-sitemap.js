// Script to generate public/sitemap.xml (no TS runtime needed)
// Usage: node scripts/generate-sitemap.js

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.SITE_URL || 'https://simpleplate.dev';
const CURRENT_DATE = new Date().toISOString().split('T')[0];

const LANGS = /** @type {const} */ (['fr', 'en']);

// Pages statiques indexables
const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/pricing', priority: '0.9', changefreq: 'weekly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/legal', priority: '0.5', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.5', changefreq: 'monthly' },
  { path: '/sitemap', priority: '0.3', changefreq: 'monthly' },
];

const withLang = (pathname, lang) => {
  const url = new URL(pathname, BASE_URL);
  url.searchParams.set('lang', lang);
  return url.toString();
};

const xDefaultUrl = (pathname) => new URL(pathname, BASE_URL).toString();

// Same algorithm as tools-config.ts
const createFrenchSlug = (title) =>
  title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

function extractToolSlugsFromSource() {
  const toolsConfigPath = path.join(__dirname, '../tools-config.ts');
  const content = fs.readFileSync(toolsConfigPath, 'utf8');

  const slugs = new Set();

  // 1) Literal slugs: slug: '...'
  for (const m of content.matchAll(/slug:\s*'([^']+)'/g)) {
    slugs.add(m[1]);
  }

  // 2) createSimpleTool('id', 'Title', ...) => slug computed from title
  for (const m of content.matchAll(/createSimpleTool\s*\(\s*'[^']+'\s*,\s*'([^']+)'/g)) {
    slugs.add(createFrenchSlug(m[1]));
  }

  return Array.from(slugs).filter(Boolean).sort();
}

function renderUrlNode({ loc, lastmod, changefreq, priority, alternates }) {
  const altLinks = alternates
    .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`)
    .join('\n');

  return `  <url>
    <loc>${loc}</loc>
${altLinks ? `${altLinks}\n` : ''}    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function generateSitemap() {
  const toolSlugs = extractToolSlugsFromSource();

  const entries = [];

  const addPath = (pathname, changefreq, priority) => {
    for (const lang of LANGS) {
      const loc = withLang(pathname, lang);
      entries.push(
        renderUrlNode({
          loc,
          lastmod: CURRENT_DATE,
          changefreq,
          priority,
          alternates: [
            { hreflang: 'fr', href: withLang(pathname, 'fr') },
            { hreflang: 'en', href: withLang(pathname, 'en') },
            { hreflang: 'x-default', href: xDefaultUrl(pathname) },
          ],
        })
      );
    }
  };

  // Static pages
  for (const page of staticPages) {
    addPath(page.path, page.changefreq, page.priority);
  }

  // Tool pages
  for (const slug of toolSlugs) {
    addPath(`/tool/${slug}`, 'weekly', '0.8');
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;

  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf8');
  // eslint-disable-next-line no-console
  console.log(`✅ Sitemap generated: ${outputPath}`);
  // eslint-disable-next-line no-console
  console.log(`   - ${staticPages.length} static pages x ${LANGS.length} langs`);
  // eslint-disable-next-line no-console
  console.log(`   - ${toolSlugs.length} tools x ${LANGS.length} langs`);
}

generateSitemap();

