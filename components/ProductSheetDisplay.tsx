import React, { useMemo } from 'react';
import { Save } from 'lucide-react';
import { ProductSheetExporter, ParsedProductSheet } from './ProductSheetExporter';

interface ProductSheetDisplayProps {
  result: string;
  platform: string;
  onSave?: () => void;
  isSaved?: boolean;
  isSaving?: boolean;
}

const cleanLine = (line: string) =>
  line
    .replace(/^\s*[-*]\s*/, '')
    .replace(/^\d+\.\s*/, '')
    .replace(/^\*\*/, '')
    .replace(/\*\*$/, '')
    .trim();

const getSectionBlock = (markdown: string, label: string) => {
  const safe = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`###\\s+${safe}[\\s\\S]*?(?=\\n###\\s+\\d|\\n##\\s|$)`, 'i');
  const match = markdown.match(regex);
  if (!match) return '';
  return match[0].replace(new RegExp(`###\\s+${safe}`, 'i'), '').trim();
};

const parseSheet = (markdown: string, platform: string): ParsedProductSheet => {
  const block = (index: number, title: string) => getSectionBlock(markdown, `${index}\\. \\*\\*${title}\\*\\*`);

  const titleBlock = block(1, 'TITRE SEO');
  const shortBlock = block(2, 'DESCRIPTION COURTE');
  const bulletBlock = block(3, 'BULLET POINTS');
  const longBlock = block(4, 'DESCRIPTION LONGUE');
  const tagsBlock = block(5, 'MOTS-CLÉS SEO');
  const priceBlock = block(6, 'ESTIMATION PRIX & POSITIONNEMENT');

  const bulletPoints = bulletBlock
    ? bulletBlock
        .split('\n')
        .map(cleanLine)
        .filter(Boolean)
        .slice(0, 10)
    : [];

  const seoKeywords = tagsBlock
    ? tagsBlock
        .split(/[,|\n]/)
        .map(tag => tag.trim())
        .filter(Boolean)
    : [];

  return {
    title: cleanLine(titleBlock.split('\n')[0] || ''),
    shortDescription: cleanLine(shortBlock),
    bulletPoints,
    longDescription: longBlock.trim(),
    seoKeywords,
    price: cleanLine(priceBlock),
    platform,
    rawMarkdown: markdown,
  };
};

export const ProductSheetDisplay: React.FC<ProductSheetDisplayProps> = ({
  result,
  platform,
  onSave,
  isSaved = false,
  isSaving = false,
}) => {
  const sheet = useMemo(() => parseSheet(result, platform), [result, platform]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b-2 border-gray-200 dark:border-gray-600 pb-4">
        <h3 className="font-display text-2xl font-bold dark:text-white">Fiche Produit</h3>
        <div className="flex gap-2">
          {onSave && (
            <button
              type="button"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                onSave();
              }}
              disabled={isSaved || isSaving}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-2 ${
                isSaved
                  ? 'bg-neo-green text-black cursor-not-allowed'
                  : isSaving
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                  : 'bg-neo-violet text-white hover:bg-purple-500'
              }`}
              title={isSaved ? 'Déjà sauvegardé' : 'Sauvegarder ce résultat'}
            >
              <Save className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              {isSaving ? 'Sauvegarde...' : isSaved ? 'Sauvegardé' : 'Sauvegarder'}
            </button>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-black dark:border-gray-600 rounded-lg p-8 shadow-neo dark:shadow-none">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold text-neo-black dark:text-white mb-2">
            {sheet.title || 'Titre du produit'}
          </h1>
          {sheet.price && <p className="text-2xl font-bold text-neo-violet dark:text-neo-blue">{sheet.price}</p>}
        </div>

        {sheet.shortDescription && (
          <div className="mb-6">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{sheet.shortDescription}</p>
          </div>
        )}

        {sheet.bulletPoints.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3 dark:text-white">Points clés</h3>
            <ul className="space-y-2">
              {sheet.bulletPoints.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-neo-green text-xl mt-1">✓</span>
                  <span className="text-gray-700 dark:text-gray-300 flex-1">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {sheet.longDescription && (
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3 dark:text-white">Description détaillée</h3>
            <div className="prose prose-sm max-w-none dark:prose-invert text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {sheet.longDescription}
            </div>
          </div>
        )}

        {sheet.seoKeywords.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-600">
            {sheet.seoKeywords.map((tag, idx) => (
              <span
                key={`${tag}-${idx}`}
                className="px-3 py-1 bg-neo-yellow/30 dark:bg-neo-yellow/20 text-neo-black dark:text-white rounded-full text-sm font-bold"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <ProductSheetExporter sheet={sheet} />
    </div>
  );
};

