// Script pour générer automatiquement le sitemap.xml
// Usage: node scripts/generate-sitemap.js

const fs = require('fs');
const path = require('path');

// Import dynamique des outils (nécessite une conversion TypeScript -> JS ou utiliser ts-node)
// Pour l'instant, on va créer un sitemap basique et vous pourrez le mettre à jour manuellement
// ou utiliser un build script qui génère le sitemap à partir de tools-config.ts

const BASE_URL = 'https://simpleplate.dev';
const CURRENT_DATE = new Date().toISOString().split('T')[0];

// Pages statiques
const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/pricing', priority: '0.9', changefreq: 'weekly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/legal', priority: '0.5', changefreq: 'monthly' },
  { path: '/sitemap', priority: '0.6', changefreq: 'monthly' },
];

// Liste des slugs d'outils (à mettre à jour depuis tools-config.ts)
// Vous pouvez extraire cette liste depuis tools-config.ts avec un script
const toolSlugs = [
  'scanner-produit-ecommerce',
  'generateur-site-web',
  'generateur-python-pro',
  'analyseur-image-ia',
  'business-plan-pro',
  'audit-smart-contract',
  'detecteur-texte-ia',
  'humaniseur-texte',
  'generateur-prompt-pro',
  'detecteur-arnaques',
  'traducteur-juridique',
  'interprete-reves',
  'explose-mon-code',
  'generateur-qr-code',
  // Ajoutez tous les autres slugs ici
];

function generateSitemap() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Pages statiques
  staticPages.forEach(page => {
    xml += `  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // Outils
  toolSlugs.forEach(slug => {
    xml += `  <url>
    <loc>${BASE_URL}/tool/${slug}</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  xml += `</urlset>`;

  // Écrire le fichier
  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf8');
  console.log(`✅ Sitemap généré: ${outputPath}`);
  console.log(`   - ${staticPages.length} pages statiques`);
  console.log(`   - ${toolSlugs.length} outils`);
}

generateSitemap();

