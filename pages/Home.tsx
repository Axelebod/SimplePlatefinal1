
import React, { useState, useMemo, useEffect } from 'react';
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
import { generateSitelinksJsonLd, STUDIO_SITELINKS, STUDIO_SITELINKS_EN } from '../utils/sitelinks';
import { setJsonLd } from '../utils/seo';
import { generateSitelinksJsonLd, STUDIO_SITELINKS, STUDIO_SITELINKS_EN } from '../utils/sitelinks';
import { setJsonLd } from '../utils/seo';

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

  // Ajouter les sitelinks pour la page d'accueil (Studio)
  useEffect(() => {
    const baseUrl = window.location.origin;
    const sitelinks = language === 'fr' ? STUDIO_SITELINKS : STUDIO_SITELINKS_EN;
    const sitelinksJsonLd = generateSitelinksJsonLd(`${baseUrl}/studio`, sitelinks, language);
    setJsonLd('json-ld-home-studio-sitelinks', sitelinksJsonLd);
    
    return () => {
      setJsonLd('json-ld-home-studio-sitelinks', null);
    };
  }, [language]);

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
      <div className="sticky top-0 md:top-20 z-40 bg-neo-white dark:bg-gray-800 border-b-2 border-black dark:border-white py-4 space-y-4 transition-all shadow-neo-sm backdrop-blur-md">
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

      {/* SEO-RICH THEMATIC SECTIONS */}
      <section className="py-12 border-t-2 border-black dark:border-white">
        <div className="max-w-6xl mx-auto space-y-8">
          <h2 className="text-center font-display text-3xl font-bold mb-8 dark:text-white">
            {language === 'fr' ? 'Outils par Catégorie' : 'Tools by Category'}
          </h2>
          
          {/* Générateur Business Plan IA */}
          <div className="bg-white dark:bg-gray-600 border-2 border-black dark:border-white rounded-lg p-6 shadow-neo dark:shadow-[2px_2px_0px_0px_#fff]">
            <h3 className="font-display text-2xl font-bold mb-3 dark:text-white">
              {language === 'fr' ? 'Générateur de Business Plan IA' : 'AI Business Plan Generator'}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {language === 'fr' 
                ? 'Créez un business plan professionnel en quelques minutes avec notre générateur de business plan IA. Analysez votre marché, définissez votre stratégie et structurez votre projet avec l\'intelligence artificielle. Parfait pour les entrepreneurs, startups et porteurs de projets Micro-SaaS.'
                : 'Create a professional business plan in minutes with our AI business plan generator. Analyze your market, define your strategy and structure your project with artificial intelligence. Perfect for entrepreneurs, startups and Micro-SaaS project leaders.'}
            </p>
            <Link 
              to="/tool/business-plan-pro" 
              className="inline-flex items-center gap-2 text-neo-violet font-bold hover:underline"
            >
              {language === 'fr' ? 'Accéder au générateur' : 'Access the generator'} →
            </Link>
          </div>

          {/* Outils de Développement Web */}
          <div className="bg-white dark:bg-gray-600 border-2 border-black dark:border-white rounded-lg p-6 shadow-neo dark:shadow-[2px_2px_0px_0px_#fff]">
            <h3 className="font-display text-2xl font-bold mb-3 dark:text-white">
              {language === 'fr' ? 'Outils de Développement Web' : 'Web Development Tools'}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {language === 'fr' 
                ? 'Collection complète d\'outils pour développeurs : formateur JSON, convertisseur CSV vers JSON, générateur UUID, générateur de slug SEO, convertisseur PX vers REM, et bien plus. Optimisez votre workflow de développement avec nos outils gratuits en ligne.'
                : 'Complete collection of developer tools: JSON formatter, CSV to JSON converter, UUID generator, SEO slug generator, PX to REM converter, and more. Optimize your development workflow with our free online tools.'}
            </p>
            <div className="flex flex-wrap gap-2">
              {tools.filter(t => t.category === 'Dev').slice(0, 5).map(tool => (
                <Link 
                  key={tool.id}
                  to={`/tool/${tool.slug || tool.id}`}
                  className="px-3 py-1 bg-neo-violet text-white text-sm font-bold rounded-md hover:bg-neo-violet/90 transition-colors"
                >
                  {tool.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Outils SEO et Copywriting */}
          <div className="bg-white dark:bg-gray-600 border-2 border-black dark:border-white rounded-lg p-6 shadow-neo dark:shadow-[2px_2px_0px_0px_#fff]">
            <h3 className="font-display text-2xl font-bold mb-3 dark:text-white">
              {language === 'fr' ? 'Outils SEO et Copywriting IA' : 'SEO and AI Copywriting Tools'}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {language === 'fr' 
                ? 'Améliorez votre référencement et votre copywriting avec nos outils IA : générateur de meta tags SEO, générateur de slug URL, correcteur de style, analyseur de texte, et outils de rédaction assistée par IA. Optimisez votre contenu pour Google et convertissez mieux vos visiteurs.'
                : 'Improve your SEO and copywriting with our AI tools: SEO meta tags generator, URL slug generator, style corrector, text analyzer, and AI-assisted writing tools. Optimize your content for Google and convert more visitors.'}
            </p>
            <div className="flex flex-wrap gap-2">
              {tools.filter(t => t.category === 'SEO' || t.title.toLowerCase().includes('seo') || t.title.toLowerCase().includes('meta')).slice(0, 5).map(tool => (
                <Link 
                  key={tool.id}
                  to={`/tool/${tool.slug || tool.id}`}
                  className="px-3 py-1 bg-neo-blue text-white text-sm font-bold rounded-md hover:bg-neo-blue/90 transition-colors"
                >
                  {tool.title}
                </Link>
              ))}
            </div>
          </div>
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
