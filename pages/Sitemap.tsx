
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTools } from '../tools-config';
import { CATEGORIES, CATEGORY_COLORS, getCategoryLabel } from '../constants';
import { Home, CreditCard, Shield, LogIn, Map, Mail } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export const Sitemap: React.FC = () => {
  const { t, language } = useTranslation();
  const tools = React.useMemo(() => getTools(language), [language]);
  
  useEffect(() => {
      document.title = t('sitemap.pageTitle');
  }, [t]);

  // Liens principaux du site
  const mainLinks = [
      { to: "/", label: t('sitemap.links.home'), icon: Home, color: "bg-neo-white" },
      { to: "/pricing", label: t('sitemap.links.pricing'), icon: CreditCard, color: "bg-neo-green" },
      { to: "/login", label: t('sitemap.links.member'), icon: LogIn, color: "bg-neo-yellow" },
      { to: "/contact", label: t('sitemap.links.contact'), icon: Mail, color: "bg-neo-blue" },
      { to: "/legal", label: t('sitemap.links.legal'), icon: Shield, color: "bg-gray-200" },
      { to: "/privacy", label: t('sitemap.links.privacy'), icon: Shield, color: "bg-gray-200" },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      
      {/* HEADER */}
      <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-white border-2 border-black shadow-neo rounded-full mb-6">
              <Map className="w-8 h-8 text-black" />
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
            {t('sitemap.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('sitemap.subtitleLine1')} <br/>
            <span className="font-bold text-black">{tools.length} {t('sitemap.toolsCountLabel')}</span> {t('sitemap.subtitleLine2')}
          </p>
      </div>

      {/* QUICK LINKS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {mainLinks.map((link) => (
              <Link 
                key={link.label}
                to={link.to} 
                className={`
                    flex flex-col items-center justify-center p-6 
                    border-2 border-black rounded-lg ${link.color}
                    shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] 
                    transition-all group
                `}
              >
                  <link.icon className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="font-bold font-display text-lg">{link.label}</span>
              </Link>
          ))}
      </div>

      {/* TOOLS CATEGORIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        {CATEGORIES.map(category => {
            const catTools = tools.filter(t => t.category === category);
            if (catTools.length === 0) return null;

            const headerColor = CATEGORY_COLORS[category] || 'bg-gray-200';

            return (
                <div key={category} className="bg-white border-2 border-black rounded-lg shadow-neo overflow-hidden">
                    {/* Category Header */}
                    <div className={`${headerColor} p-4 border-b-2 border-black flex justify-between items-center`}>
                        <h2 className="font-display font-bold text-xl uppercase tracking-wider">
                            {getCategoryLabel(category, language)}
                        </h2>
                        <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded-full">
                            {catTools.length}
                        </span>
                    </div>
                    
                    {/* Tools List */}
                    <div className="divide-y-2 divide-gray-100">
                        {catTools.map(tool => (
                            <Link 
                                key={tool.id}
                                to={`/tool/${tool.slug || tool.id}`} 
                                className="block p-4 hover:bg-gray-50 transition-colors group"
                            >
                                <div className="flex justify-between items-start">
                                    <span className="font-bold text-sm group-hover:text-neo-violet group-hover:underline decoration-2 transition-all">
                                        {tool.title}
                                    </span>
                                    {tool.isPremium && (
                                        <span className="ml-2 text-[10px] bg-neo-black text-white px-1.5 py-0.5 rounded font-bold uppercase">PRO</span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                    {tool.description}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            );
        })}
      </div>
      
      <div className="mt-16 text-center">
          <Link to="/" className="inline-block px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors">
              {t('sitemap.backHome')}
          </Link>
      </div>

    </div>
  );
};
