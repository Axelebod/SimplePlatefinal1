
import React from 'react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { ToolConfig } from '../types';
import { CATEGORY_COLORS, getCategoryLabel } from '../constants';
import { useTranslation } from '../hooks/useTranslation';

interface ToolCardProps {
  tool: ToolConfig;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { t, language } = useTranslation();
  const Icon = (LucideIcons as any)[tool.iconName] || LucideIcons.Sparkles;
  const bgClass = CATEGORY_COLORS[tool.category] || 'bg-gray-100';
  const categoryLabel = getCategoryLabel(tool.category, language);

  return (
    <Link 
      to={`/tool/${tool.slug || tool.id}`}
      className="group relative block h-full focus:outline-none focus:ring-2 focus:ring-neo-violet focus:ring-offset-2 rounded-lg"
      aria-label={`${t('common.open')}: ${tool.title}. ${tool.description}`}
    >
      <div className={`
        h-full flex flex-col justify-between
        border-2 border-black dark:border-white rounded-lg p-3 md:p-5
        transition-all duration-200
        shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]
        dark:shadow-[2px_2px_0px_0px_#fff] dark:hover:shadow-none dark:hover:translate-x-[2px] dark:hover:translate-y-[2px]
        bg-white dark:bg-gray-600
      `}>
        
        <div>
            <div className="flex justify-between items-start mb-2 md:mb-4">
            <div className={`w-8 h-8 md:w-12 md:h-12 ${bgClass} border border-black dark:border-white rounded-md flex items-center justify-center shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]`}>
                <Icon className="w-4 h-4 md:w-6 md:h-6 text-black" />
            </div>
            </div>

            <h3 className="font-display font-bold text-sm md:text-lg leading-tight mb-1 md:mb-2 group-hover:text-neo-violet dark:group-hover:text-neo-violet transition-colors text-black dark:text-white">
            {tool.title}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm leading-relaxed mb-2 md:mb-4 line-clamp-2 md:line-clamp-none">
            {tool.description}
            </p>
        </div>

        <div className="mt-auto pt-2 md:pt-4 border-t border-dashed border-gray-300 dark:border-white flex justify-between items-center text-[10px] md:text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-white">
          <span className="truncate">{categoryLabel}</span>
          <span className="ml-1">
            {tool.cost} {tool.cost > 1 ? t('tools.credits') : t('tools.credit')}
          </span>
        </div>
      </div>
    </Link>
  );
};
