
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { Zap, Menu, X, LogIn, LogOut, User as UserIcon, Moon, Sun, ArrowUp, LayoutDashboard, Clock, Languages, Rocket } from 'lucide-react';
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
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-neo-violet to-neo-blue rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="font-display font-bold text-white text-sm">SP</span>
              </div>
              <span className="font-display font-bold text-xl tracking-tight group-hover:text-neo-violet transition-colors dark:text-white">
                SimplePlate
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {/* Navigation Links */}
              <div className="flex items-center gap-1">
                <Link 
                  to="/studio" 
                  className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-neo-violet dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                >
                  <Rocket className="w-4 h-4" />
                  {language === 'fr' ? 'Studio' : 'Studio'}
                </Link>
                <Link 
                  to="/pricing" 
                  className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-neo-violet dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {t('nav.pricing')}
                </Link>
                <Link 
                  to="/blog" 
                  className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-neo-violet dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Blog
                </Link>
              </div>

              {/* Separator */}
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>

              {/* User Section */}
              {user ? (
                <>
                  {/* Credits Display */}
                  <Link 
                    to="/pricing"
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                    title={t('nav.buyCredits')}
                  >
                    <Zap className="w-4 h-4 text-neo-orange" />
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm dark:text-white">{credits}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">crédits</span>
                    </div>
                  </Link>

                  {/* User Profile */}
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-neo-violet to-neo-blue rounded-full flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium dark:text-white hidden lg:block max-w-[120px] truncate">
                      {user.username || user.email.split('@')[0]}
                    </span>
                  </Link>
                </>
              ) : (
                <Link 
                  to="/login"
                  className="px-4 py-2 bg-neo-violet text-white font-semibold rounded-lg hover:bg-neo-violet/90 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  <LogIn className="w-4 h-4" />
                  {t('nav.login')}
                </Link>
              )}

              {/* Language Toggle */}
              <button 
                onClick={handleToggleLanguage} 
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title={language === 'fr' ? 'Switch to English' : 'Passer en français'}
                aria-label={language === 'fr' ? 'Passer en anglais' : 'Switch to French'}
              >
                <Languages className="w-5 h-5" />
              </button>

              {/* Dark Mode Toggle */}
              <button 
                onClick={toggleDarkMode} 
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title={isDarkMode ? "Passer en mode clair" : "Passer en mode nuit"}
                aria-label={isDarkMode ? (language === 'fr' ? 'Désactiver le mode sombre' : 'Disable dark mode') : (language === 'fr' ? 'Activer le mode sombre' : 'Enable dark mode')}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <button 
                onClick={toggleDarkMode} 
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={isDarkMode ? (language === 'fr' ? 'Désactiver le mode sombre' : 'Disable dark mode') : (language === 'fr' ? 'Activer le mode sombre' : 'Enable dark mode')}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={handleToggleLanguage}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title={language === 'fr' ? 'Switch to English' : 'Passer en français'}
                aria-label={language === 'fr' ? 'Passer en anglais' : 'Switch to French'}
              >
                <Languages className="w-5 h-5" />
              </button>
              <button 
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? (language === 'fr' ? 'Fermer le menu' : 'Close menu') : (language === 'fr' ? 'Ouvrir le menu' : 'Open menu')}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="px-4 py-4 space-y-3">
              {user ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-800">
                    <div className="w-10 h-10 bg-gradient-to-br from-neo-violet to-neo-blue rounded-full flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm dark:text-white">{user.username || user.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{credits} crédits</p>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <LayoutDashboard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="font-medium dark:text-white">Tableau de bord</span>
                  </Link>
                  <Link 
                    to="/studio" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Rocket className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="font-medium dark:text-white">Studio</span>
                  </Link>
                  <Link 
                    to="/pricing" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Zap className="w-5 h-5 text-neo-orange" />
                    <span className="font-medium dark:text-white">Acheter des crédits</span>
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Se déconnecter</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/studio" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Rocket className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="font-medium dark:text-white">Studio</span>
                  </Link>
                  <Link 
                    to="/pricing" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span className="font-medium dark:text-white">{t('nav.pricing')}</span>
                  </Link>
                  <Link 
                    to="/blog" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span className="font-medium dark:text-white">Blog</span>
                  </Link>
                  <Link 
                    to="/login" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="block w-full px-4 py-2.5 bg-neo-violet text-white font-semibold rounded-lg hover:bg-neo-violet/90 transition-colors text-center mt-2"
                  >
                    {t('nav.login')}
                  </Link>
                </>
              )}
            </div>
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
            <Link to="/studio" className="flex items-center gap-1">
              <Rocket className="w-3 h-3" />
              Studio
            </Link>
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
