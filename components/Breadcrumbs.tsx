import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const { language } = useTranslation();

  return (
    <nav className="flex items-center gap-2 text-sm mb-4" aria-label="Breadcrumb">
      <Link 
        to="/" 
        className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-neo-violet transition-colors"
        aria-label={language === 'fr' ? 'Accueil' : 'Home'}
      >
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400" aria-hidden="true" />
          {item.path ? (
            <Link
              to={item.path}
              className="text-gray-600 dark:text-gray-400 hover:text-neo-violet transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-black dark:text-white font-bold" aria-current="page">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

