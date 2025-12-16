
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Ghost } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useSEO } from '../hooks/useSEO';

export const NotFound: React.FC = () => {
  const { t, language } = useTranslation();

  useSEO({
    title: language === 'fr' ? 'Page introuvable | SimplePlate AI' : 'Page not found | SimplePlate AI',
    description:
      language === 'fr'
        ? "Cette page n'existe pas (404)."
        : 'This page does not exist (404).',
    language,
    noindex: true,
  });
  
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      
      <div className="relative mb-8">
         <div className="absolute inset-0 bg-neo-red rounded-full blur-xl opacity-20 animate-pulse"></div>
         <Ghost className="w-32 h-32 text-black relative z-10" />
      </div>

      <h1 className="font-display text-8xl font-bold mb-2 tracking-tighter">{t('notFound.title')}</h1>
      <h2 className="text-2xl font-bold bg-neo-yellow px-4 border-2 border-black transform -rotate-1 inline-block mb-6">
        {t('notFound.subtitle')}
      </h2>
      
      <p className="text-gray-600 max-w-md mb-8 text-lg">
        {t('notFound.message')}
      </p>

      <Link 
        to="/"
        className="px-8 py-4 bg-neo-black text-white font-bold border-2 border-black rounded-md shadow-[4px_4px_0px_0px_#d8b4fe] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#d8b4fe] transition-all flex items-center gap-2"
      >
        <Home className="w-5 h-5" />
        {t('notFound.backHome')}
      </Link>
    </div>
  );
};
