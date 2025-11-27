import React from 'react';
import { Download, FileText, ShoppingCart } from 'lucide-react';

interface ProductSheetExporterProps {
  result: string;
  platform: string;
}

export const ProductSheetExporter: React.FC<ProductSheetExporterProps> = ({ result, platform }) => {
  const exportToShopify = () => {
    // Parser le markdown pour extraire les données
    const titleMatch = result.match(/### 1\. \*\*TITRE SEO\*\*[\s\S]*?^- (.*?)$/m);
    const descMatch = result.match(/### 2\. \*\*DESCRIPTION COURTE\*\*[\s\S]*?^- (.*?)$/m);
    const bulletsMatch = result.match(/### 3\. \*\*BULLET POINTS\*\*[\s\S]*?^- (.*?)$/gm);
    const longDescMatch = result.match(/### 4\. \*\*DESCRIPTION LONGUE\*\*[\s\S]*?^- (.*?)$/s);
    const tagsMatch = result.match(/### 5\. \*\*MOTS-CLÉS SEO\*\*[\s\S]*?^- (.*?)$/m);
    
    const csv = [
      ['Title', 'Body (HTML)', 'Vendor', 'Product Type', 'Tags', 'Published'],
      [
        titleMatch?.[1] || 'Titre produit',
        `${descMatch?.[1] || ''}\n\n${bulletsMatch?.map((m: string) => m.replace(/^- /, '')).join('\n') || ''}\n\n${longDescMatch?.[1] || ''}`,
        'Vendor',
        'Product Type',
        tagsMatch?.[1]?.split(',').map((t: string) => t.trim()).join(', ') || '',
        'TRUE'
      ]
    ].map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopify-products-import.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToAmazon = () => {
    // Format Amazon (format texte structuré)
    const titleMatch = result.match(/### 1\. \*\*TITRE SEO\*\*[\s\S]*?^- (.*?)$/m);
    const bulletsMatch = result.match(/### 3\. \*\*BULLET POINTS\*\*[\s\S]*?^- (.*?)$/gm);
    const longDescMatch = result.match(/### 4\. \*\*DESCRIPTION LONGUE\*\*[\s\S]*?^- (.*?)$/s);
    
    const content = `TITRE AMAZON:
${titleMatch?.[1] || 'Titre produit'}

BULLET POINTS:
${bulletsMatch?.map((m: string, i: number) => `${i + 1}. ${m.replace(/^- /, '')}`).join('\n') || ''}

DESCRIPTION LONGUE:
${longDescMatch?.[1] || ''}

---
Généré par SimplePlate AI - ${new Date().toLocaleDateString('fr-FR')}
`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'amazon-product-listing.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const titleMatch = result.match(/### 1\. \*\*TITRE SEO\*\*[\s\S]*?^- (.*?)$/m);
    const descMatch = result.match(/### 2\. \*\*DESCRIPTION COURTE\*\*[\s\S]*?^- (.*?)$/m);
    const bulletsMatch = result.match(/### 3\. \*\*BULLET POINTS\*\*[\s\S]*?^- (.*?)$/gm);
    const longDescMatch = result.match(/### 4\. \*\*DESCRIPTION LONGUE\*\*[\s\S]*?^- (.*?)$/s);
    const tagsMatch = result.match(/### 5\. \*\*MOTS-CLÉS SEO\*\*[\s\S]*?^- (.*?)$/m);
    const priceMatch = result.match(/### 6\. \*\*ESTIMATION PRIX\*\*[\s\S]*?^- (.*?)$/m);
    
    const json = {
      title: titleMatch?.[1] || '',
      shortDescription: descMatch?.[1] || '',
      bulletPoints: bulletsMatch?.map((m: string) => m.replace(/^- /, '').trim()) || [],
      longDescription: longDescMatch?.[1] || '',
      tags: tagsMatch?.[1]?.split(',').map((t: string) => t.trim()) || [],
      estimatedPrice: priceMatch?.[1] || '',
      platform: platform,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-sheet.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!result) return null;

  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg">
      <h4 className="font-bold text-sm mb-3 dark:text-white flex items-center gap-2">
        <ShoppingCart className="w-4 h-4" />
        Export Fiche Produit
      </h4>
      <div className="flex flex-wrap gap-2">
        {(platform === 'Shopify' || platform === 'Les deux (Shopify + Amazon)') && (
          <button
            onClick={exportToShopify}
            className="px-3 py-2 bg-neo-blue text-white rounded-md text-sm font-bold hover:bg-blue-500 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Shopify CSV
          </button>
        )}
        {(platform === 'Amazon' || platform === 'Les deux (Shopify + Amazon)') && (
          <button
            onClick={exportToAmazon}
            className="px-3 py-2 bg-neo-orange text-white rounded-md text-sm font-bold hover:bg-orange-500 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Amazon TXT
          </button>
        )}
        <button
          onClick={exportToJSON}
          className="px-3 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-md text-sm font-bold hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Export JSON
        </button>
      </div>
    </div>
  );
};

