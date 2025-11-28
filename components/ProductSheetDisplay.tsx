import React from 'react';
import { Download, ShoppingCart, FileText, Share2, Save } from 'lucide-react';
import { ProductSheetExporter } from './ProductSheetExporter';

interface ProductSheetDisplayProps {
  result: string;
  platform: string;
  onSave?: () => void;
  isSaved?: boolean;
  isSaving?: boolean;
}

export const ProductSheetDisplay: React.FC<ProductSheetDisplayProps> = ({ 
  result, 
  platform,
  onSave,
  isSaved = false,
  isSaving = false
}) => {
  // Parser le markdown pour extraire les sections
  const extractSection = (sectionName: string) => {
    // Essayer plusieurs formats de markdown
    const patterns = [
      new RegExp(`### ${sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?^- (.*?)$`, 'm'),
      new RegExp(`### ${sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?^\\*\\*([^*]+)\\*\\*`, 'm'),
      new RegExp(`${sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?:\\s*(.*?)(?=\\n###|\\n##|$)`, 'm'),
      new RegExp(`${sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?\\n\\n(.*?)(?=\\n###|\\n##|$)`, 'm'),
    ];
    
    for (const pattern of patterns) {
      const match = result.match(pattern);
      if (match?.[1]) {
        const content = match[1].trim();
        // Nettoyer le markdown basique
        return content.replace(/^\*\*|\*\*$/g, '').replace(/^\- /, '').trim();
      }
    }
    return '';
  };

  const extractBullets = () => {
    const patterns = [
      /### 3\. \*\*BULLET POINTS\*\*[\s\S]*?^- (.*?)$/gm,
      /### 3\. \*\*BULLET POINTS\*\*[\s\S]*?^\- (.*?)$/gm,
      /BULLET POINTS[\s\S]*?^- (.*?)$/gm,
      /Points clés[\s\S]*?^- (.*?)$/gm,
    ];
    
    for (const pattern of patterns) {
      const matches = Array.from(result.matchAll(pattern));
      if (matches.length > 0) {
        return matches.map(m => m[1]?.replace(/^- /, '').replace(/^\- /, '').trim()).filter(Boolean).slice(0, 5);
      }
    }
    // Fallback: chercher des listes markdown
    const listMatch = result.match(/### 3\. \*\*BULLET POINTS\*\*[\s\S]*?((?:^[-*] .*$\\n?)+)/m);
    if (listMatch?.[1]) {
      return listMatch[1].split('\n')
        .map(line => line.replace(/^[-*] /, '').trim())
        .filter(Boolean)
        .slice(0, 5);
    }
    return [];
  };

  // Extraction avec fallbacks multiples
  const title = extractSection('1\\. \\*\\*TITRE SEO\\*\\*') 
    || extractSection('TITRE SEO') 
    || result.match(/TITRE SEO[\\s\\S]*?^- (.*?)$/m)?.[1]?.trim() 
    || result.match(/## 📦[\\s\\S]*?TITRE SEO[\\s\\S]*?^- (.*?)$/m)?.[1]?.trim()
    || '';
    
  const shortDesc = extractSection('2\\. \\*\\*DESCRIPTION COURTE\\*\\*') 
    || extractSection('DESCRIPTION COURTE') 
    || '';
    
  const bullets = extractBullets();
  
  const longDesc = extractSection('4\\. \\*\\*DESCRIPTION LONGUE\\*\\*') 
    || extractSection('DESCRIPTION LONGUE') 
    || '';
    
  const tags = extractSection('5\\. \\*\\*MOTS-CLÉS SEO\\*\\*') 
    || extractSection('MOTS-CLÉS SEO') 
    || result.match(/MOTS-CLÉS SEO[\\s\\S]*?: (.*?)(?=\\n|$)/m)?.[1]?.trim()
    || '';
    
  const price = extractSection('6\\. \\*\\*ESTIMATION PRIX & POSITIONNEMENT\\*\\*') 
    || extractSection('ESTIMATION PRIX') 
    || '';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header avec actions */}
      <div className="flex items-center justify-between border-b-2 border-gray-200 dark:border-gray-600 pb-4">
        <h3 className="font-display text-2xl font-bold dark:text-white">Fiche Produit</h3>
        <div className="flex gap-2">
          {onSave && (
            <button
              type="button"
              onClick={(e) => {
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

      {/* Carte principale */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-black dark:border-gray-600 rounded-lg p-8 shadow-neo dark:shadow-none">
        {/* Titre */}
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold text-neo-black dark:text-white mb-2">
            {title || 'Titre du produit'}
          </h1>
          {price && (
            <p className="text-2xl font-bold text-neo-violet dark:text-neo-blue">
              {price}
            </p>
          )}
        </div>

        {/* Description courte */}
        {shortDesc && (
          <div className="mb-6">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {shortDesc}
            </p>
          </div>
        )}

        {/* Bullet points */}
        {bullets.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3 dark:text-white">Points clés</h3>
            <ul className="space-y-2">
              {bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-neo-green text-xl mt-1">✓</span>
                  <span className="text-gray-700 dark:text-gray-300 flex-1">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Description longue */}
        {longDesc && (
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3 dark:text-white">Description détaillée</h3>
            <div className="prose prose-sm max-w-none dark:prose-invert text-gray-700 dark:text-gray-300">
              <p className="whitespace-pre-line leading-relaxed">{longDesc}</p>
            </div>
          </div>
        )}

        {/* Tags */}
        {tags && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-600">
            {tags.split(',').map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-neo-yellow/30 dark:bg-neo-yellow/20 text-neo-black dark:text-white rounded-full text-sm font-bold"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Export */}
      <ProductSheetExporter result={result} platform={platform} />
    </div>
  );
};

