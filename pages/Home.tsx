
import React, { useState, useMemo } from 'react';
import { getTools } from '../tools-config';
import { ToolCard } from '../components/ToolCard';
import { CATEGORIES, getCategoryLabel } from '../constants';
import { Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatsCounter } from '../components/StatsCounter';
import { HomeCTA } from '../components/HomeCTA';
import { TrustBadges } from '../components/TrustBadges';
import { WelcomeModal } from '../components/WelcomeModal';
import { StudioBanner } from '../components/StudioBanner';
import { useTranslation } from '../hooks/useTranslation';
import { useSEO } from '../hooks/useSEO';

export const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const { t, language } = useTranslation();
  const tools = useMemo(() => getTools(language), [language]);

  const title = t('homePage.seo.title');
  const description = t('homePage.seo.description');
  const keywordsRaw = t('homePage.seo.keywords');
  const keywords = keywordsRaw
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);

  useSEO({
    title,
    description,
    keywords,
    language,
  });

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      const matchesSearch = tool.title.toLowerCase().includes(search.toLowerCase()) || 
                            tool.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search]);

  return (
    <div className="space-y-8">
      <WelcomeModal />
      
      {/* Header */}
      <header className="text-center space-y-4 py-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="font-display text-4xl md:text-6xl font-bold dark:text-white">
          {t('homePage.hero.titleLine1')} <br className="hidden md:block" />
          <span className="bg-neo-yellow dark:bg-neo-yellow px-2 border border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] transform -rotate-1 inline-block mx-2 text-black dark:text-black">
            {t('homePage.hero.titleHighlight')}
          </span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {t('homePage.hero.subtitleLine1')} <br/>
          <span className="font-bold text-black dark:text-white">{t('homePage.hero.subtitleLine2')}</span>
        </p>
      </header>

      {/* CTA pour non-connectés */}
      <HomeCTA />

      {/* Studio Banner */}
      <StudioBanner />

      {/* Stats Counter */}
      <StatsCounter className="max-w-4xl mx-auto" />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Controls */}
      <div className="sticky top-0 md:top-20 z-40 bg-neo-white dark:bg-gray-700 border-b-2 border-black dark:border-white md:border-0 md:bg-neo-white/90 md:dark:bg-gray-700/90 backdrop-blur-sm py-4 space-y-4 transition-colors shadow-neo-sm md:shadow-none">
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder={t('homePage.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-black dark:border-white rounded-md shadow-neo dark:shadow-[2px_2px_0px_0px_#fff] focus:outline-none focus:ring-2 focus:ring-neo-violet bg-white dark:bg-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-300"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white w-5 h-5" />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-1.5 text-sm font-bold border border-black dark:border-white rounded-full transition-all ${
              selectedCategory === 'All' 
                ? 'bg-neo-black text-white shadow-neo-sm dark:bg-white dark:text-black dark:shadow-[2px_2px_0px_0px_#000]' 
                : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500'
            }`}
          >
            {t('common.all')}
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 text-sm font-bold border border-black dark:border-white rounded-full transition-all ${
                selectedCategory === cat 
                  ? 'bg-neo-black text-white shadow-neo-sm dark:bg-white dark:text-black dark:shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500'
              }`}
            >
              {getCategoryLabel(cat, language)}
            </button>
          ))}
        </div>
      </div>


      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 pb-8">
        {filteredTools.map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}

        {/* GHOST CARD */}
        <Link 
          to="/contact?subject=suggestion"
          className="group relative block h-full opacity-60 hover:opacity-100 transition-opacity"
        >
          <div className="h-full flex flex-col items-center justify-center text-center border-2 border-black dark:border-white border-dashed rounded-lg p-8 bg-transparent hover:bg-white dark:hover:bg-gray-600 transition-all cursor-pointer min-h-[200px]">
             <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 border-2 border-black dark:border-white border-dashed rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-gray-400 dark:text-gray-400" />
             </div>
             <h3 className="font-display font-bold text-lg text-gray-600 dark:text-gray-400 mb-1">
               {t('contact.suggestTool')}
             </h3>
             <p className="text-xs text-gray-500 dark:text-gray-500">
               {t('homePage.suggestToolHintLine1')} <br/>{t('homePage.suggestToolHintLine2')}
             </p>
          </div>
        </Link>
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          <p className="text-xl font-bold">{t('homePage.noToolsTitle')}</p>
          <p>{t('homePage.noToolsSubtitle')}</p>
        </div>
      )}

      {/* SOCIAL PROOF */}
      <section className="py-12 border-t-2 border-black dark:border-white">
         <h2 className="text-center font-display text-3xl font-bold mb-8 dark:text-white">{t('homePage.socialProof.title')}</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
                 { name: t('homePage.socialProof.reviews.0.name'), role: t('homePage.socialProof.reviews.0.role'), text: t('homePage.socialProof.reviews.0.text') },
                 { name: t('homePage.socialProof.reviews.1.name'), role: t('homePage.socialProof.reviews.1.role'), text: t('homePage.socialProof.reviews.1.text') },
                 { name: t('homePage.socialProof.reviews.2.name'), role: t('homePage.socialProof.reviews.2.role'), text: t('homePage.socialProof.reviews.2.text') }
             ].map((avis, i) => (
                 <div key={i} className="bg-white dark:bg-gray-600 p-6 border-2 border-black dark:border-white rounded-lg shadow-neo-sm dark:shadow-[2px_2px_0px_0px_#fff]">
                     <p className="italic text-gray-600 dark:text-gray-300 mb-4">"{avis.text}"</p>
                     <div className="flex items-center gap-2">
                         <div className="w-8 h-8 bg-neo-violet rounded-full border border-black flex items-center justify-center font-bold text-xs">{avis.name[0]}</div>
                         <div>
                             <p className="font-bold text-sm dark:text-white">{avis.name}</p>
                             <p className="text-xs text-gray-500">{avis.role}</p>
                         </div>
                     </div>
                 </div>
             ))}
         </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto pb-12">
         <h2 className="text-center font-display text-3xl font-bold mb-8 dark:text-white">{t('homePage.faq.title')}</h2>
         <div className="space-y-4">
             <details className="bg-white dark:bg-gray-600 border-2 border-black dark:border-white rounded-lg p-4 cursor-pointer group">
                 <summary className="font-bold flex justify-between items-center list-none dark:text-white">
                     {t('homePage.faq.q1.question')}
                     <span className="transform group-open:rotate-180 transition-transform">▼</span>
                 </summary>
                 <p className="mt-2 text-gray-600 dark:text-gray-300">{t('homePage.faq.q1.answer')}</p>
             </details>
             <details className="bg-white dark:bg-gray-600 border-2 border-black dark:border-white rounded-lg p-4 cursor-pointer group">
                 <summary className="font-bold flex justify-between items-center list-none dark:text-white">
                     {t('homePage.faq.q2.question')}
                     <span className="transform group-open:rotate-180 transition-transform">▼</span>
                 </summary>
                 <p className="mt-2 text-gray-600 dark:text-gray-300">{t('homePage.faq.q2.answer')}</p>
             </details>
         </div>
      </section>

    </div>
  );
};
