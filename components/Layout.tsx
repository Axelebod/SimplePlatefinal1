
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { Zap, Menu, X, LogIn, LogOut, User as UserIcon, Moon, Sun, ArrowUp, LayoutDashboard, Clock, Languages } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';
import { useTranslation } from '../hooks/useTranslation';
import { SimpleBot } from './SimpleBot';
import { InstallPrompt } from './InstallPrompt';
import { SITE_CONFIG } from '../constants';
import { supabase } from '../lib/supabaseClient';
import { setJsonLd } from '../utils/seo';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, credits, creditsFree, creditsPaid, buyCredits, logout, isDarkMode, toggleDarkMode, refreshCredits } = useUserStore();
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();

  // Rafraîchir les crédits depuis Supabase quand l'utilisateur est connecté
  useEffect(() => {
    if (user) {
      refreshCredits();
    }
  }, [user, refreshCredits]);

  // Gestion du Dark Mode (Application de la classe 'dark' sur <html>)
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sync language <-> URL (?lang=fr|en) and <html lang="">
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlLang = params.get('lang');
    if (urlLang === 'fr' || urlLang === 'en') {
      if (urlLang !== language) {
        setLanguage(urlLang);
      }
    } else {
      // Ensure URL carries a language (helps SEO + hreflang consistency)
      params.set('lang', language);
      navigate({ pathname: location.pathname, search: `?${params.toString()}` }, { replace: true });
    }
    document.documentElement.lang = language;
  }, [location.pathname, location.search, language, navigate, setLanguage]);

  const handleToggleLanguage = () => {
    const next = language === 'fr' ? 'en' : 'fr';
    setLanguage(next);
    const params = new URLSearchParams(location.search);
    params.set('lang', next);
    navigate({ pathname: location.pathname, search: `?${params.toString()}` }, { replace: true });
  };

  // Global structured data (site-wide)
  useEffect(() => {
    setJsonLd('json-ld-website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'SimplePlate AI',
      url: window.location.origin,
      inLanguage: language,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${window.location.origin}/?q={search_term_string}&lang=${language}`,
        'query-input': 'required name=search_term_string',
      },
    });
  }, [language]);

  // Gestion du Scroll To Top
  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // GOOGLE ANALYTICS INJECTION
  useEffect(() => {
      if (SITE_CONFIG.gaMeasurementId && !window.location.href.includes('localhost')) {
          // Dynamically inject GA script
          const scriptId = 'ga-script';
          if (!document.getElementById(scriptId)) {
              const script1 = document.createElement('script');
              script1.async = true;
              script1.src = `https://www.googletagmanager.com/gtag/js?id=${SITE_CONFIG.gaMeasurementId}`;
              script1.id = scriptId;
              document.head.appendChild(script1);

              const script2 = document.createElement('script');
              script2.innerHTML = `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${SITE_CONFIG.gaMeasurementId}');
              `;
              document.head.appendChild(script2);
          }
      }
  }, []);

  // Track page views
  useEffect(() => {
      if (typeof (window as any).gtag === 'function' && SITE_CONFIG.gaMeasurementId) {
           (window as any).gtag('config', SITE_CONFIG.gaMeasurementId, {
              page_path: location.pathname + location.search
           });
      }
  }, [location]);

  const handleLogout = () => {
      logout();
      navigate('/login');
      setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neo-white dark:bg-gray-900 transition-colors duration-300">
      <nav className="sticky top-0 z-50 bg-neo-white/90 dark:bg-gray-900/90 backdrop-blur border-b-2 border-black dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            {/* LOGO */}
            <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-neo-yellow border-2 border-black dark:border-gray-500 rounded-sm translate-x-1 translate-y-1 group-hover:translate-x-1.5 group-hover:translate-y-1.5 transition-transform"></div>
                <div className="absolute inset-0 bg-neo-black dark:bg-gray-700 border-2 border-black dark:border-gray-500 rounded-sm flex items-center justify-center z-10">
                    <span className="font-display font-bold text-white dark:text-white text-xl tracking-tighter">SP</span>
                </div>
            </div>
            <span className="font-display font-bold text-2xl tracking-tight group-hover:text-neo-violet transition-colors hidden sm:block dark:text-white">
              SimplePlate
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
             {/* Language Toggle */}
             <button 
                onClick={handleToggleLanguage} 
                className="p-2 border-2 border-black dark:border-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-2 text-black dark:text-white font-bold flex items-center gap-1"
                title={language === 'fr' ? 'Switch to English' : 'Passer en français'}
             >
                 <Languages className="w-5 h-5" />
                 <span className="text-xs">{language.toUpperCase()}</span>
             </button>

             {/* Dark Mode Toggle */}
             <button 
                onClick={toggleDarkMode} 
                className="p-2 border-2 border-black dark:border-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-2 text-black dark:text-white"
                title={isDarkMode ? "Passer en mode clair" : "Passer en mode nuit"}
             >
                 {isDarkMode ? <Sun className="w-5 h-5 text-neo-yellow" /> : <Moon className="w-5 h-5" />}
             </button>

             <Link 
               to="/pricing" 
               className="font-bold hover:underline hover:text-neo-violet mr-2 dark:text-white"
             >
               {t('nav.pricing')}
             </Link>

             {user ? (
                 <>
                    <Link 
                        to="/pricing"
                        className="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-700 border border-black dark:border-gray-500 rounded-md shadow-[2px_2px_0px_0px_#000] dark:shadow-none active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                        title={t('nav.buyCredits')}
                    >
                        <Zap className="w-4 h-4 text-neo-orange fill-current" />
                        <div className="flex flex-col items-start leading-tight">
                            <span className="font-bold dark:text-white text-sm">{credits} Total</span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                {creditsFree} gratuits + {creditsPaid} payants
                            </span>
                            {creditsFree < 5 && timeRemaining && (
                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <Clock className="w-3 h-3" aria-hidden="true" />
                                    <span>Reset: {timeRemaining}</span>
                                </div>
                            )}
                        </div>
                    </Link>

                    
                    <div className="ml-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700 flex items-center gap-3">
                        <Link to="/dashboard" className="flex items-center gap-2 group hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded transition-colors">
                            <div className="flex flex-col items-end leading-none">
                                <span className="text-xs font-bold dark:text-gray-300 group-hover:text-neo-violet transition-colors">{user.email.split('@')[0]}</span>
                            </div>
                            <div className="bg-black dark:bg-white rounded-full p-1">
                                <UserIcon className="w-3 h-3 text-white dark:text-black" />
                            </div>
                        </Link>
                    </div>
                 </>
             ) : (
                 <Link 
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 bg-neo-black dark:bg-white text-white dark:text-black font-bold border-2 border-black dark:border-white rounded-md hover:shadow-[4px_4px_0px_0px_#fde047] dark:hover:shadow-[4px_4px_0px_0px_#fde047] hover:text-neo-yellow dark:hover:text-neo-violet transition-all"
                 >
                    <LogIn className="w-4 h-4" />
                    {t('nav.login')}
                 </Link>
             )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <button 
                onClick={toggleDarkMode} 
                className="p-2 text-black dark:text-white"
            >
                 {isDarkMode ? <Sun className="w-5 h-5 text-neo-yellow" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
                onClick={handleToggleLanguage}
                className="p-2 text-black dark:text-white font-bold"
                title={language === 'fr' ? 'Switch to English' : 'Passer en français'}
            >
                <Languages className="w-5 h-5" />
            </button>
            <button 
                className="p-2 text-black dark:text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-neo-white dark:bg-gray-900 border-b-2 border-black dark:border-gray-600 p-4 flex flex-col gap-4 shadow-neo dark:shadow-none z-50">
             {user ? (
                 <>
                    <div className="flex items-center gap-2 pb-4 border-b border-gray-200 dark:border-gray-700">
                         <div className="w-8 h-8 bg-neo-blue rounded-full flex items-center justify-center border border-black">
                            <UserIcon className="w-4 h-4 text-black" />
                         </div>
                         <span className="font-bold dark:text-white">{user.email}</span>
                    </div>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 p-3 border border-black dark:border-gray-600 rounded-md bg-neo-yellow text-black font-bold">
                        <LayoutDashboard className="w-4 h-4" /> Mon Tableau de Bord
                    </Link>
                    <div className="p-3 border border-black dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold dark:text-white">Crédits: {credits}</span>
                            <Link to="/pricing" onClick={() => setIsMenuOpen(false)} className="text-sm underline text-neo-blue font-bold">Recharger</Link>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            {creditsFree} gratuits (hebdo) + {creditsPaid} payants
                        </div>
                        {creditsFree < 5 && timeRemaining && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-2">
                                <Clock className="w-3 h-3" aria-hidden="true" />
                                <span>Reset crédits gratuits: {timeRemaining}</span>
                            </div>
                        )}
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            {creditsFree} gratuits (hebdo) + {creditsPaid} payants
                            {creditsFree < 5 && timeRemaining && (
                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    <Clock className="w-3 h-3" aria-hidden="true" />
                                    <span>Reset crédits gratuits: {timeRemaining}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="block p-3 text-center font-bold bg-neo-black dark:bg-white text-white dark:text-black rounded-md">
                        Voir les Outils
                    </Link>
                    <button onClick={handleLogout} className="block w-full p-3 text-center font-bold border-2 border-neo-red text-neo-red rounded-md bg-white dark:bg-gray-800 mt-2">
                        Se déconnecter
                    </button>
                 </>
             ) : (
                 <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block p-3 text-center font-bold bg-neo-black dark:bg-white text-white dark:text-black rounded-md shadow-[2px_2px_0px_0px_#000] dark:shadow-none">
                        Se connecter / S'inscrire
                    </Link>
                    <Link to="/pricing" onClick={() => setIsMenuOpen(false)} className="block p-3 font-bold border border-black dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-center dark:text-white">
                        {t('nav.pricing')}
                    </Link>
                 </>
             )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black dark:border-gray-700 py-8 bg-white dark:bg-gray-800 mt-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
          <div>
             <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <div className="w-6 h-6 bg-neo-black dark:bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">SP</span>
                </div>
                <p className="font-display font-bold text-lg dark:text-white">SimplePlate AI</p>
             </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              La boîte à outils ultime pour le web moderne.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-bold underline dark:text-gray-300">
            <Link to="/contact" className="hover:text-neo-violet">Nous Contacter</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/legal">Mentions Légales</Link>
            <Link to="/pricing">{t('nav.pricing')}</Link>
            <Link to="/sitemap">Plan du Site</Link>
          </div>
        </div>
      </footer>

      {/* SCROLL TO TOP BUTTON */}
      {showScrollTop && (
        <button 
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 z-[90] p-3 bg-white dark:bg-gray-800 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] rounded-md hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] transition-all animate-in fade-in zoom-in duration-300"
            title="Remonter en haut"
        >
            <ArrowUp className="w-6 h-6 text-black dark:text-white" />
        </button>
      )}

      {/* SIMPLE BOT INTEGRATION */}
      <SimpleBot />
      
      {/* PWA INSTALL PROMPT (MOBILE ONLY) */}
      <InstallPrompt />
    </div>
  );
};
