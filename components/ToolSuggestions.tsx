import React from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getTools } from '../tools-config';
import { useTranslation } from '../hooks/useTranslation';

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

const SUGGESTION_MESSAGES_EN: Record<string, string> = {
  'ecom-product-scanner': 'Want to generate an invoice for this product?',
  'website-generator': 'Need a logo or meta tags for your website?',
  'business-plan-pro': 'Create your CV and cover letter to complete your package!',
  'invoice-generator': 'Generate your CV or brand name too!',
  'cv-generator': 'Pair it with a strong cover letter!',
  'cover-letter-gen': 'Create a professional CV too!',
  'brand-name-gen': 'Find a domain name and create your logo!',
  'ecom-ad-gen': 'Boost visibility with hashtags and LinkedIn posts!',
  'python-pro-gen': 'Document your code with a professional README!',
  'ai-image-analysis': 'Create a logo or wallpaper from this analysis!',
  'homework-helper': 'Improve your text and simplify concepts!',
  'recipe-generator': 'Build a complete meal plan for the week!',
  'workout-generator': 'Plan your meals to optimize results!',
};

export const ToolSuggestions: React.FC<ToolSuggestionsProps> = ({ currentToolId, onClose }) => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const tools = React.useMemo(() => getTools(language), [language]);
  const suggestedToolIds = TOOL_SUGGESTIONS[currentToolId] || [];
  const message =
    (language === 'fr' ? SUGGESTION_MESSAGES : SUGGESTION_MESSAGES_EN)[currentToolId] ||
    t('toolSuggestions.defaultMessage');

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
    <div className="w-full bg-gradient-to-r from-neo-yellow to-yellow-300 dark:from-purple-900 dark:to-purple-800 border-2 border-neo-black dark:border-white rounded-lg p-4 shadow-neo animate-in slide-in-from-top duration-300 mb-6">
      <div className="flex items-start justify-between gap-4">
        {/* Left side - Icon and message */}
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border-2 border-neo-black dark:border-white shrink-0">
            <Sparkles className="w-5 h-5 text-neo-black dark:text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg font-bold dark:text-white mb-1">{t('toolSuggestions.title')}</h3>
            <p className="text-sm text-gray-800 dark:text-gray-200 mb-3">{message}</p>
            
            {/* Tools as horizontal scrollable list */}
            <div className="flex flex-wrap gap-2">
              {suggestedTools.map((tool) => (
                <button
                  key={tool!.id}
                  onClick={() => handleToolClick(tool!.id)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border-2 border-neo-black dark:border-white rounded-md hover:shadow-neo-sm transition-all group flex items-center gap-2 text-sm font-bold"
                >
                  <span className="dark:text-white">{tool!.title}</span>
                  <ArrowRight className="w-4 h-4 text-neo-violet dark:text-neo-blue group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-md transition-colors shrink-0"
          aria-label={t('common.close')}
        >
          <X className="w-5 h-5 text-neo-black dark:text-white" />
        </button>
      </div>
    </div>
  );
};

