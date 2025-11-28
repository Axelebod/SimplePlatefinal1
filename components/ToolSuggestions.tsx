import React from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tools } from '../tools-config';

interface ToolSuggestionsProps {
  currentToolId: string;
  onClose: () => void;
}

// Mapping des outils avec leurs suggestions complémentaires
const TOOL_SUGGESTIONS: Record<string, string[]> = {
  'ecom-product-scanner': ['invoice-generator', 'brand-name-gen', 'ecom-ad-gen', 'meta-tag-gen'],
  'website-generator': ['meta-tag-gen', 'logo-creator', 'invoice-generator', 'ecom-product-scanner'],
  'business-plan-pro': ['cv-generator', 'cover-letter-gen', 'invoice-generator', 'linkedin-post-gen'],
  'invoice-generator': ['ecom-product-scanner', 'brand-name-gen', 'cv-generator', 'website-generator'],
  'cv-generator': ['cover-letter-gen', 'business-plan-pro', 'linkedin-post-gen', 'bio-gen'],
  'cover-letter-gen': ['cv-generator', 'linkedin-post-gen', 'bio-gen', 'business-plan-pro'],
  'brand-name-gen': ['domain-name-gen', 'logo-creator', 'ecom-product-scanner', 'website-generator'],
  'ecom-ad-gen': ['hashtag-gen', 'youtube-title-gen', 'linkedin-post-gen', 'ecom-product-scanner'],
  'python-pro-gen': ['readme-gen', 'bug-fixer', 'sql-builder', 'excel-formula-explainer'],
  'ai-image-analysis': ['logo-creator', 'wallpaper-gen', 'ecom-product-scanner'],
  'homework-helper': ['grammar-fixer', 'eli5', 'text-analyzer'],
  'recipe-generator': ['meal-plan-gen', 'workout-generator'],
  'workout-generator': ['meal-plan-gen', 'recipe-generator'],
};

const SUGGESTION_MESSAGES: Record<string, string> = {
  'ecom-product-scanner': "Et si on faisait la facture pour ce produit ?",
  'website-generator': "Besoin d'un logo ou de meta tags pour votre site ?",
  'business-plan-pro': "Créez votre CV et lettre de motivation pour compléter votre dossier !",
  'invoice-generator': "Générez aussi votre CV ou votre nom de marque !",
  'cv-generator': "Complétez avec une lettre de motivation percutante !",
  'cover-letter-gen': "Créez aussi votre CV professionnel !",
  'brand-name-gen': "Trouvez un nom de domaine et créez votre logo !",
  'ecom-ad-gen': "Boostez votre visibilité avec des hashtags et posts LinkedIn !",
  'python-pro-gen': "Documentez votre code avec un README professionnel !",
  'ai-image-analysis': "Créez un logo ou un fond d'écran à partir de cette analyse !",
  'homework-helper': "Améliorez votre texte avec le correcteur et simplifiez les concepts !",
  'recipe-generator': "Créez un plan de repas complet pour la semaine !",
  'workout-generator': "Planifiez aussi vos repas pour optimiser vos résultats !",
};

export const ToolSuggestions: React.FC<ToolSuggestionsProps> = ({ currentToolId, onClose }) => {
  const navigate = useNavigate();
  const suggestedToolIds = TOOL_SUGGESTIONS[currentToolId] || [];
  const message = SUGGESTION_MESSAGES[currentToolId] || "Découvrez ces outils complémentaires !";

  if (suggestedToolIds.length === 0) {
    return null;
  }

  const suggestedTools = suggestedToolIds
    .map(id => tools.find(t => t.id === id))
    .filter(Boolean);

  const handleToolClick = (toolId: string) => {
    const tool = tools.find(t => t.id === toolId);
    if (tool) {
      navigate(`/tool/${tool.slug || tool.id}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 border-4 border-neo-black dark:border-white rounded-lg p-6 max-w-2xl w-full shadow-neo animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-neo-yellow rounded-full flex items-center justify-center border-2 border-neo-black">
              <Sparkles className="w-6 h-6 text-neo-black" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold dark:text-white">Suggestion d'outils</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {suggestedTools.map((tool) => (
            <button
              key={tool!.id}
              onClick={() => handleToolClick(tool!.id)}
              className="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-neo-violet dark:hover:border-neo-blue hover:shadow-neo transition-all text-left group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-lg dark:text-white mb-1 group-hover:text-neo-violet dark:group-hover:text-neo-blue transition-colors">
                    {tool!.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {tool!.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-neo-violet dark:text-neo-blue font-bold">
                    <span>Essayer</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
};

