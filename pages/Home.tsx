
import React, { useState, useMemo, useEffect } from 'react';
import { tools } from '../tools-config';
import { ToolCard } from '../components/ToolCard';
import { CATEGORIES, CATEGORY_LABELS } from '../constants';
import { Search, Plus } from 'lucide-react';
import { AdBanner } from '../components/AdBanner';
import { Link } from 'react-router-dom';
import { StatsCounter } from '../components/StatsCounter';
import { HomeCTA } from '../components/HomeCTA';
import { TrustBadges } from '../components/TrustBadges';
import { WelcomeModal } from '../components/WelcomeModal';

export const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');

  // ----------------------------------------------------
  // HOMEPAGE SEO INJECTION (PRODUCTION READY)
  // ----------------------------------------------------
  useEffect(() => {
    document.title = "SimplePlate AI - 50+ Outils IA Professionnels (Dev, Image, Business)";
    
    const updateMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const description = "Plateforme SaaS avec 50+ outils IA professionnels : Générateur de Business Plan, Convertisseurs, Analyse d'image, et bien plus. Système de crédits et abonnement PRO disponible.";
    
    updateMeta('description', description);
    updateMeta('keywords', "outils ia professionnels, générateur texte ia, outils dev en ligne, saas français, intelligence artificielle, crédits ia, abonnement pro");

    // Open Graph
    updateMeta('og:title', "SimplePlate AI - La Boîte à Outils Ultime", 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:type', 'website', 'property');
    updateMeta('og:url', window.location.href, 'property');
    updateMeta('og:site_name', 'SimplePlate AI', 'property');

    // JSON-LD for Website (Google Rich Snippets)
    const scriptId = 'json-ld-home';
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "SimplePlate AI",
      "url": window.location.origin,
      "description": description,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${window.location.origin}/#/?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };
    script.innerHTML = JSON.stringify(schemaData);

  }, []);

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
          Boostez votre <br className="hidden md:block" />
          <span className="bg-neo-yellow dark:bg-neo-yellow px-2 border border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] transform -rotate-1 inline-block mx-2 text-black dark:text-black">
            productivité
          </span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          50+ outils IA et utilitaires pour coder, écrire et créer instantanément. <br/>
          <span className="font-bold text-black dark:text-white">Rapide. Professionnel. Français. 🇫🇷</span>
        </p>
      </header>

      {/* CTA pour non-connectés */}
      <HomeCTA />

      {/* Stats Counter */}
      <StatsCounter className="max-w-4xl mx-auto" />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Controls */}
      <div className="sticky top-20 z-40 bg-neo-white/90 dark:bg-gray-700/90 backdrop-blur-sm py-4 space-y-4 transition-colors">
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Rechercher un outil (ex: 'Juridique', 'Image')..."
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
            Tous
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
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* PUB DISCRETE */}
      <div className="max-w-2xl mx-auto">
         <AdBanner location="home-middle" />
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
               Suggérer un outil
             </h3>
             <p className="text-xs text-gray-500 dark:text-gray-500">
               Il manque quelque chose ? <br/>Dites-le nous.
             </p>
          </div>
        </Link>
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          <p className="text-xl font-bold">Aucun outil trouvé.</p>
          <p>Essayez un autre mot clé (ex: "PDF", "Image", "Calcul").</p>
        </div>
      )}

      {/* SOCIAL PROOF */}
      <section className="py-12 border-t-2 border-black dark:border-white">
         <h2 className="text-center font-display text-3xl font-bold mb-8 dark:text-white">Ils adorent SimplePlate</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
                 { name: "Thomas", role: "Développeur", text: "Le générateur de Regex m'a sauvé la vie 3 fois cette semaine. Indispensable." },
                 { name: "Sarah", role: "Entrepreneuse", text: "J'ai fait mon Business Plan en 10 minutes avec l'IA. C'est bluffant." },
                 { name: "Kevin", role: "Étudiant", text: "L'outil pour humaniser les textes est parfait pour mes devoirs. Merci !" }
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
         <h2 className="text-center font-display text-3xl font-bold mb-8 dark:text-white">Questions Fréquentes</h2>
         <div className="space-y-4">
             <details className="bg-white dark:bg-gray-600 border-2 border-black dark:border-white rounded-lg p-4 cursor-pointer group">
                 <summary className="font-bold flex justify-between items-center list-none dark:text-white">
                     Comment fonctionnent les crédits ?
                     <span className="transform group-open:rotate-180 transition-transform">▼</span>
                 </summary>
                 <p className="mt-2 text-gray-600 dark:text-gray-300">Chaque utilisateur reçoit 5 crédits gratuits par semaine (non cumulables). Les outils coûtent entre 0 et 3 crédits selon leur complexité. Pour un usage intensif, l'abonnement PRO (9.99€/mois) offre 100 crédits payants mensuels qui s'accumulent.</p>
             </details>
             <details className="bg-white dark:bg-gray-600 border-2 border-black dark:border-white rounded-lg p-4 cursor-pointer group">
                 <summary className="font-bold flex justify-between items-center list-none dark:text-white">
                     Mes données sont-elles privées ?
                     <span className="transform group-open:rotate-180 transition-transform">▼</span>
                 </summary>
                 <p className="mt-2 text-gray-600 dark:text-gray-300">Absolument. Les outils locaux (Calculatrices, Convertisseurs) tournent sur VOTRE navigateur. Les outils IA envoient les données à Google pour traitement et ne sont pas stockés.</p>
             </details>
         </div>
      </section>

      {/* PUB DISCRETE */}
      <div className="max-w-4xl mx-auto pb-10">
          <AdBanner location="home-bottom" />
      </div>
    </div>
  );
};
