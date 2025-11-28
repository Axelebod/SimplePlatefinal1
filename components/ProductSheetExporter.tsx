import React from 'react';
import { Download, FileText, ShoppingCart } from 'lucide-react';

export interface ParsedProductSheet {
  title: string;
  shortDescription: string;
  bulletPoints: string[];
  longDescription: string;
  seoKeywords: string[];
  price: string;
  platform: string;
  rawMarkdown: string;
}

interface ProductSheetExporterProps {
  sheet: ParsedProductSheet;
}

export const ProductSheetExporter: React.FC<ProductSheetExporterProps> = ({ sheet }) => {
  const buildBody = () => {
    const bullets = sheet.bulletPoints.map(point => `• ${point}`).join('\n');
    return `${sheet.shortDescription}\n\n${bullets}\n\n${sheet.longDescription}`;
  };

  const exportToShopify = () => {
    const rows = [
      ['Title', 'Body (HTML)', 'Vendor', 'Product Type', 'Tags', 'Published'],
      [
        sheet.title || 'Titre produit',
        buildBody(),
        'SimplePlate Brand',
        sheet.platform,
        sheet.seoKeywords.join(', '),
        'TRUE',
      ],
    ];

    const csv = rows
      .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopify-products-import.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToAmazon = () => {
    const content = `TITRE AMAZON:
${sheet.title || 'Titre produit'}

BULLET POINTS:
${sheet.bulletPoints.map((m, i) => `${i + 1}. ${m}`).join('\n')}

DESCRIPTION LONGUE:
${sheet.longDescription}

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
    const payload = {
      title: sheet.title,
      shortDescription: sheet.shortDescription,
      bulletPoints: sheet.bulletPoints,
      longDescription: sheet.longDescription,
      seoKeywords: sheet.seoKeywords,
      estimatedPrice: sheet.price,
      platform: sheet.platform,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-sheet.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!sheet.rawMarkdown) return null;

  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg">
      <h4 className="font-bold text-sm mb-3 dark:text-white flex items-center gap-2">
        <ShoppingCart className="w-4 h-4" />
        Export Fiche Produit
      </h4>
      <div className="flex flex-wrap gap-2">
        {(sheet.platform === 'Shopify' || sheet.platform.includes('Les deux')) && (
          <button
            onClick={exportToShopify}
            className="px-3 py-2 bg-neo-blue text-white rounded-md text-sm font-bold hover:bg-blue-500 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Shopify CSV
          </button>
        )}
        {(sheet.platform === 'Amazon' || sheet.platform.includes('Les deux')) && (
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

