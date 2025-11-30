// Script pour générer les favicons PNG à partir du SVG
// Nécessite sharp: npm install sharp

const fs = require('fs');
const path = require('path');

// Pour l'instant, créons des placeholders
// L'utilisateur devra utiliser un outil en ligne comme https://realfavicongenerator.net/

const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'favicon-192x192.png' },
  { size: 512, name: 'favicon-512x512.png' }
];

console.log('Pour générer les favicons PNG, utilisez:');
console.log('1. https://realfavicongenerator.net/');
console.log('2. Uploadez le fichier public/favicon.svg');
console.log('3. Téléchargez tous les formats générés');
console.log('4. Placez-les dans le dossier public/');
console.log('\nFormats nécessaires:');
sizes.forEach(({ size, name }) => {
  console.log(`- ${name} (${size}x${size})`);
});

