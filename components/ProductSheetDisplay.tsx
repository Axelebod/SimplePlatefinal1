import React, { useMemo, useState } from 'react';
import { Save, CheckCircle, AlertCircle, TrendingUp, Eye, Copy, Monitor } from 'lucide-react';
import { ProductSheetExporter, ParsedProductSheet } from './ProductSheetExporter';
import { ProductPreview } from './ProductPreview';

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

// Parsing amélioré et plus robuste
const getSectionBlock = (markdown: string, patterns: string[]): string => {
  for (const pattern of patterns) {
    const safe = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Essayer plusieurs formats de headers
    const regexes = [
      new RegExp(`###\\s+${safe}[\\s\\S]*?(?=\\n###\\s+|\\n##\\s+|$)`, 'i'),
      new RegExp(`##\\s+${safe}[\\s\\S]*?(?=\\n##\\s+|\\n###\\s+|$)`, 'i'),
      new RegExp(`\\*\\*${safe}\\*\\*[\\s\\S]*?(?=\\n\\*\\*|\\n###|\\n##|$)`, 'i'),
      new RegExp(`${safe}[\\s\\S]*?(?=\\n\\d+\\.|\\n###|\\n##|$)`, 'i'),
    ];
    
    for (const regex of regexes) {
      const match = markdown.match(regex);
      if (match) {
        const content = match[0]
          .replace(new RegExp(`###\\s+${safe}`, 'i'), '')
          .replace(new RegExp(`##\\s+${safe}`, 'i'), '')
          .replace(new RegExp(`\\*\\*${safe}\\*\\*`, 'i'), '')
          .replace(new RegExp(`${safe}`, 'i'), '')
          .trim();
        if (content) return content;
      }
    }
  }
  return '';
};

const parseSheet = (markdown: string, platform: string): ParsedProductSheet => {
  // Patterns multiples pour chaque section (plus robuste)
  const titlePatterns = [
    '1\\.\\s*\\*\\*TITRE SEO\\*\\*',
    'TITRE SEO',
    'Titre SEO',
    'Titre',
    '1\\.\\s*TITRE',
  ];
  
  const shortPatterns = [
    '2\\.\\s*\\*\\*DESCRIPTION COURTE\\*\\*',
    'DESCRIPTION COURTE',
    'Description Courte',
    'Meta Description',
    '2\\.\\s*DESCRIPTION',
  ];
  
  const bulletPatterns = [
    '3\\.\\s*\\*\\*BULLET POINTS\\*\\*',
    'BULLET POINTS',
    'Bullet Points',
    'Points Clés',
    '3\\.\\s*BULLET',
  ];
  
  const longPatterns = [
    '4\\.\\s*\\*\\*DESCRIPTION LONGUE\\*\\*',
    'DESCRIPTION LONGUE',
    'Description Longue',
    'Description Détaillée',
    '4\\.\\s*DESCRIPTION',
  ];
  
  const tagsPatterns = [
    '5\\.\\s*\\*\\*MOTS-CLÉS SEO\\*\\*',
    'MOTS-CLÉS SEO',
    'Mots-clés SEO',
    'Keywords',
    '5\\.\\s*MOTS',
  ];
  
  const pricePatterns = [
    '6\\.\\s*\\*\\*ESTIMATION PRIX',
    'ESTIMATION PRIX',
    'Prix',
    'Positionnement',
    '6\\.\\s*PRIX',
  ];

  const titleBlock = getSectionBlock(markdown, titlePatterns);
  const shortBlock = getSectionBlock(markdown, shortPatterns);
  const bulletBlock = getSectionBlock(markdown, bulletPatterns);
  const longBlock = getSectionBlock(markdown, longPatterns);
  const tagsBlock = getSectionBlock(markdown, tagsPatterns);
  const priceBlock = getSectionBlock(markdown, pricePatterns);

  // Extraction améliorée des bullet points
  const bulletPoints = bulletBlock
    ? bulletBlock
        .split(/\n/)
        .map(line => {
          // Nettoyer les différents formats de listes
          let cleaned = line
            .replace(/^[-*•]\s*/, '')
            .replace(/^\d+[.)]\s*/, '')
            .replace(/^\*\*/, '')
            .replace(/\*\*$/, '')
            .trim();
          return cleaned;
        })
        .filter(line => line.length > 0 && !line.match(/^#{1,3}\s/)) // Exclure les headers
        .slice(0, 10)
    : [];

  // Extraction améliorée des mots-clés
  const seoKeywords = tagsBlock
    ? tagsBlock
        .split(/[,|\n•]/)
        .map(tag => tag.trim().replace(/^[-*]\s*/, '').replace(/^\d+[.)]\s*/, ''))
        .filter(tag => tag.length > 0 && !tag.match(/^#{1,3}\s/))
    : [];

  // Extraction du titre (première ligne non vide)
  const title = titleBlock
    ? cleanLine(titleBlock.split('\n').find(line => line.trim()) || '')
    : markdown.split('\n').find(line => line.trim() && !line.startsWith('#'))?.trim() || 'Produit';

  return {
    title: title || 'Produit',
    shortDescription: cleanLine(shortBlock) || '',
    bulletPoints,
    longDescription: longBlock.trim() || '',
    seoKeywords,
    price: cleanLine(priceBlock) || '',
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
  const [showPreview, setShowPreview] = useState(true);
  const [editedSheet, setEditedSheet] = useState<ParsedProductSheet | null>(null);
  const parsedSheet = useMemo(() => parseSheet(result, platform), [result, platform]);
  const sheet = editedSheet || parsedSheet;
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Calcul de la qualité de la fiche (score SEO)
  const qualityScore = useMemo(() => {
    let score = 0;
    if (sheet.title && sheet.title.length >= 30 && sheet.title.length <= 80) score += 25;
    if (sheet.shortDescription && sheet.shortDescription.length >= 120 && sheet.shortDescription.length <= 160) score += 20;
    if (sheet.bulletPoints.length >= 3 && sheet.bulletPoints.length <= 5) score += 20;
    if (sheet.longDescription && sheet.longDescription.length >= 300) score += 20;
    if (sheet.seoKeywords.length >= 10) score += 15;
    return Math.min(100, score);
  }, [sheet]);

  const copySection = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleTextChange = (field: string, value: string) => {
    setEditedSheet(prev => {
      const updated = prev || { ...parsedSheet };
      if (field === 'title') {
        updated.title = value;
      } else if (field === 'shortDescription') {
        updated.shortDescription = value;
      } else if (field === 'longDescription') {
        updated.longDescription = value;
      } else if (field === 'bulletPoints') {
        try {
          updated.bulletPoints = JSON.parse(value);
        } catch {
          // Si ce n'est pas du JSON valide, ignorer
        }
      }
      return { ...updated };
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header avec toggle Preview/Éditeur */}
      <div className="flex items-center justify-between border-b-2 border-gray-200 dark:border-gray-600 pb-4">
        <div className="flex items-center gap-4">
          <h3 className="font-display text-2xl font-bold dark:text-white">Fiche Produit</h3>
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600">
            <TrendingUp className="w-4 h-4 text-neo-green" />
            <span className="text-xs font-bold">
              Qualité SEO: <span className={qualityScore >= 80 ? 'text-neo-green' : qualityScore >= 60 ? 'text-neo-yellow' : 'text-neo-red'}>{qualityScore}%</span>
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Toggle Preview/Éditeur */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md p-1 border border-gray-300 dark:border-gray-600">
            <button
              onClick={() => setShowPreview(true)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-2 ${
                showPreview
                  ? 'bg-white dark:bg-gray-600 shadow-sm text-black dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={() => setShowPreview(false)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-2 ${
                !showPreview
                  ? 'bg-white dark:bg-gray-600 shadow-sm text-black dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" />
              Éditeur
            </button>
          </div>
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

      {/* Preview ou Éditeur */}
      {showPreview ? (
        <ProductPreview 
          sheet={sheet} 
          onTextChange={handleTextChange}
          editable={true}
        />
      ) : (
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-black dark:border-gray-600 rounded-lg p-8 shadow-neo dark:shadow-none">
        {/* Titre avec copie */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-display font-bold text-neo-black dark:text-white">
                {sheet.title || 'Titre du produit'}
              </h1>
              {sheet.title && (
                <button
                  onClick={() => copySection(sheet.title, 'title')}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  title="Copier le titre"
                >
                  {copiedSection === 'title' ? (
                    <CheckCircle className="w-4 h-4 text-neo-green" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              )}
            </div>
            {sheet.price && (
              <p className="text-2xl font-bold text-neo-violet dark:text-neo-blue">{sheet.price}</p>
            )}
            {/* Validation titre */}
            {sheet.title && (
              <div className="mt-2 flex items-center gap-2 text-xs">
                {sheet.title.length >= 30 && sheet.title.length <= 80 ? (
                  <span className="flex items-center gap-1 text-neo-green font-bold">
                    <CheckCircle className="w-3 h-3" />
                    Longueur optimale ({sheet.title.length} caractères)
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-neo-red font-bold">
                    <AlertCircle className="w-3 h-3" />
                    {sheet.title.length < 30 ? 'Trop court' : 'Trop long'} ({sheet.title.length} caractères)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {sheet.shortDescription && (
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="font-bold text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide">Description Courte</h3>
              <button
                onClick={() => copySection(sheet.shortDescription, 'short')}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                title="Copier la description"
              >
                {copiedSection === 'short' ? (
                  <CheckCircle className="w-4 h-4 text-neo-green" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{sheet.shortDescription}</p>
            {/* Validation description */}
            <div className="mt-2 flex items-center gap-2 text-xs">
              {sheet.shortDescription.length >= 120 && sheet.shortDescription.length <= 160 ? (
                <span className="flex items-center gap-1 text-neo-green font-bold">
                  <CheckCircle className="w-3 h-3" />
                  Longueur optimale pour SEO ({sheet.shortDescription.length} caractères)
                </span>
              ) : (
                <span className="flex items-center gap-1 text-neo-yellow font-bold">
                  <AlertCircle className="w-3 h-3" />
                  {sheet.shortDescription.length < 120 ? 'Recommandé: 120-160 caractères' : 'Un peu long'} ({sheet.shortDescription.length} caractères)
                </span>
              )}
            </div>
          </div>
        )}

        {sheet.bulletPoints.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg dark:text-white">Points clés</h3>
              <button
                onClick={() => copySection(sheet.bulletPoints.join('\n• '), 'bullets')}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                title="Copier tous les points"
              >
                {copiedSection === 'bullets' ? (
                  <CheckCircle className="w-4 h-4 text-neo-green" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
            <ul className="space-y-2">
              {sheet.bulletPoints.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3 group">
                  <span className="text-neo-green text-xl mt-1 flex-shrink-0">✓</span>
                  <span className="text-gray-700 dark:text-gray-300 flex-1">{bullet}</span>
                  <button
                    onClick={() => copySection(bullet, `bullet-${idx}`)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all"
                    title="Copier ce point"
                  >
                    {copiedSection === `bullet-${idx}` ? (
                      <CheckCircle className="w-3 h-3 text-neo-green" />
                    ) : (
                      <Copy className="w-3 h-3 text-gray-500" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
            {/* Validation bullet points */}
            <div className="mt-2 text-xs">
              {sheet.bulletPoints.length >= 3 && sheet.bulletPoints.length <= 5 ? (
                <span className="flex items-center gap-1 text-neo-green font-bold">
                  <CheckCircle className="w-3 h-3" />
                  Nombre optimal de points ({sheet.bulletPoints.length}/5)
                </span>
              ) : (
                <span className="flex items-center gap-1 text-neo-yellow font-bold">
                  <AlertCircle className="w-3 h-3" />
                  Recommandé: 3-5 points ({sheet.bulletPoints.length} actuellement)
                </span>
              )}
            </div>
          </div>
        )}

        {sheet.longDescription && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg dark:text-white">Description détaillée</h3>
              <button
                onClick={() => copySection(sheet.longDescription, 'long')}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                title="Copier la description complète"
              >
                {copiedSection === 'long' ? (
                  <CheckCircle className="w-4 h-4 text-neo-green" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
            <div className="prose prose-sm max-w-none dark:prose-invert text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {sheet.longDescription}
            </div>
            {/* Validation description longue */}
            <div className="mt-2 text-xs">
              {sheet.longDescription.length >= 300 ? (
                <span className="flex items-center gap-1 text-neo-green font-bold">
                  <CheckCircle className="w-3 h-3" />
                  Description complète ({Math.round(sheet.longDescription.length / 100) * 100} caractères)
                </span>
              ) : (
                <span className="flex items-center gap-1 text-neo-yellow font-bold">
                  <AlertCircle className="w-3 h-3" />
                  Recommandé: minimum 300 caractères ({sheet.longDescription.length} actuellement)
                </span>
              )}
            </div>
          </div>
        )}

        {sheet.seoKeywords.length > 0 && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Mots-clés SEO ({sheet.seoKeywords.length})
              </h3>
              <button
                onClick={() => copySection(sheet.seoKeywords.join(', '), 'keywords')}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                title="Copier tous les mots-clés"
              >
                {copiedSection === 'keywords' ? (
                  <CheckCircle className="w-4 h-4 text-neo-green" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sheet.seoKeywords.map((tag, idx) => (
                <span
                  key={`${tag}-${idx}`}
                  className="px-3 py-1 bg-neo-yellow/30 dark:bg-neo-yellow/20 text-neo-black dark:text-white rounded-full text-sm font-bold"
                >
                  {tag}
                </span>
              ))}
            </div>
            {/* Validation mots-clés */}
            <div className="mt-2 text-xs">
              {sheet.seoKeywords.length >= 10 ? (
                <span className="flex items-center gap-1 text-neo-green font-bold">
                  <CheckCircle className="w-3 h-3" />
                  Nombre optimal de mots-clés ({sheet.seoKeywords.length})
                </span>
              ) : (
                <span className="flex items-center gap-1 text-neo-yellow font-bold">
                  <AlertCircle className="w-3 h-3" />
                  Recommandé: minimum 10 mots-clés ({sheet.seoKeywords.length} actuellement)
                </span>
              )}
            </div>
          </div>
        )}
        </div>
      )}

      {/* Export - Utilise toujours les textes de la preview (editedSheet ou parsedSheet) */}
      <ProductSheetExporter sheet={sheet} />
    </div>
  );
};

