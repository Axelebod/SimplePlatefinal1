import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Rocket, Sparkles, ArrowRight, Check, Users, TrendingUp, Code, Palette, FileText } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useSEO } from '../hooks/useSEO';
import { getTools } from '../tools-config';

export const About: React.FC = () => {
  const { t, language } = useTranslation();
  const tools = React.useMemo(() => getTools(language), [language]);

  useSEO({
    title: language === 'fr' 
      ? 'SimplePlate - La boîte à outils IA + Studio Communautaire'
      : 'SimplePlate - AI Toolbox + Community Studio',
    description: language === 'fr'
      ? '50+ outils IA professionnels + SimplePlate Studio : plateforme communautaire pour découvrir, auditer et promouvoir des Micro-SaaS. Audit IA complet, classements, avis communautaires.'
      : '50+ professional AI tools + SimplePlate Studio: community platform to discover, audit and promote Micro-SaaS. Complete AI audits, rankings, community reviews.',
    language,
    keywords: language === 'fr'
      ? ['SimplePlate', 'outils IA', 'SimplePlate Studio', 'Micro-SaaS', 'audit IA', 'communauté', 'startup', 'outils développeur']
      : ['SimplePlate', 'AI tools', 'SimplePlate Studio', 'Micro-SaaS', 'AI audit', 'community', 'startup', 'developer tools'],
    jsonLdId: 'json-ld-about',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'SimplePlate',
      url: window.location.origin,
      description: language === 'fr'
        ? 'Plateforme d\'outils IA et communauté pour Micro-SaaS'
        : 'AI tools platform and Micro-SaaS community',
      sameAs: [
        'https://www.simpleplate.dev',
      ],
    },
  });

  const stats = [
    { label: language === 'fr' ? 'Outils disponibles' : 'Available tools', value: tools.length, icon: Sparkles },
    { label: language === 'fr' ? 'Catégories' : 'Categories', value: 5, icon: Code },
    { label: language === 'fr' ? 'Gratuit' : 'Free', value: language === 'fr' ? 'Oui' : 'Yes', icon: Zap },
  ];

  const features = [
    {
      icon: Code,
      title: language === 'fr' ? 'Outils Dev' : 'Dev Tools',
      description: language === 'fr' 
        ? 'Formateur JSON, CSV vers JSON, générateur de slug, convertisseur px→rem'
        : 'JSON formatter, CSV to JSON, slug generator, px→rem converter',
    },
    {
      icon: FileText,
      title: language === 'fr' ? 'Business' : 'Business',
      description: language === 'fr'
        ? 'Générateur de CV, factures, business plans, prompts professionnels'
        : 'CV generator, invoices, business plans, professional prompts',
    },
    {
      icon: Palette,
      title: language === 'fr' ? 'Design' : 'Design',
      description: language === 'fr'
        ? 'Générateur de site web, analyse de couleurs, QR codes'
        : 'Website generator, color analysis, QR codes',
    },
    {
      icon: TrendingUp,
      title: language === 'fr' ? 'SEO & Marketing' : 'SEO & Marketing',
      description: language === 'fr'
        ? 'Générateur SEO meta, analyseur de texte, hashtags'
        : 'SEO meta generator, text analyzer, hashtags',
    },
  ];

  const benefits = [
    language === 'fr' ? 'Aucune installation requise' : 'No installation required',
    language === 'fr' ? 'Interface simple et rapide' : 'Simple and fast interface',
    language === 'fr' ? 'Résultats instantanés' : 'Instant results',
    language === 'fr' ? 'Système de crédits flexible' : 'Flexible credit system',
    language === 'fr' ? 'Support multilingue (FR/EN)' : 'Multilingual support (FR/EN)',
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* Hero Section */}
      <header className="text-center mb-16">
        <div className="inline-block mb-6">
          <div className="w-20 h-20 bg-neo-violet rounded-lg border-4 border-black dark:border-white flex items-center justify-center shadow-neo dark:shadow-[4px_4px_0px_0px_#fff]">
            <span className="text-white font-bold text-3xl">SP</span>
          </div>
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold dark:text-white mb-4">
          Simple<span className="text-neo-violet">Plate</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          {language === 'fr'
            ? 'La boîte à outils IA pour créer, écrire et produire plus vite. 50+ outils professionnels en un seul endroit.'
            : 'The AI toolbox to create, write and produce faster. 50+ professional tools in one place.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-neo-black dark:bg-white text-white dark:text-black font-bold border-2 border-black dark:border-white rounded-md shadow-neo dark:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            {language === 'fr' ? 'Découvrir les outils' : 'Discover tools'}
          </Link>
          <Link
            to="/studio"
            className="px-6 py-3 bg-neo-violet text-white font-bold border-2 border-neo-violet rounded-md shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <Rocket className="w-5 h-5" />
            {language === 'fr' ? 'SimplePlate Studio' : 'SimplePlate Studio'}
          </Link>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-gray-600 border-2 border-black dark:border-white rounded-lg p-6 shadow-neo dark:shadow-[2px_2px_0px_0px_#fff] text-center"
            >
              <Icon className="w-8 h-8 mx-auto mb-3 text-neo-violet" />
              <div className="text-3xl font-bold dark:text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 font-bold">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Features */}
      <section className="mb-16">
        <h2 className="font-display text-3xl md:text-4xl font-bold dark:text-white text-center mb-12">
          {language === 'fr' ? 'Ce que vous pouvez faire' : 'What you can do'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-gray-600 border-2 border-black dark:border-white rounded-lg p-6 shadow-neo dark:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-neo-yellow border-2 border-black dark:border-white rounded-md flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-neo-yellow border-2 border-black rounded-lg p-8 md:p-12 mb-16 shadow-neo">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-8">
          {language === 'fr' ? 'Pourquoi SimplePlate ?' : 'Why SimplePlate?'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <Check className="w-5 h-5 text-black flex-shrink-0" />
              <span className="font-bold text-black">{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SimplePlate Studio Section */}
      <section className="bg-white dark:bg-gray-600 border-2 border-black dark:border-white rounded-lg p-8 md:p-12 mb-16 shadow-neo dark:shadow-[2px_2px_0px_0px_#fff]">
        <div className="flex items-center gap-3 mb-6">
          <Rocket className="w-8 h-8 text-neo-violet" />
          <h2 className="font-display text-3xl md:text-4xl font-bold dark:text-white">
            SimplePlate <span className="text-neo-violet">Studio</span>
          </h2>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          {language === 'fr'
            ? 'La plateforme communautaire pour les Micro-SaaS. Soumettez votre projet, obtenez un audit IA complet et recevez des retours de la communauté.'
            : 'The community platform for Micro-SaaS. Submit your project, get a complete AI audit and receive community feedback.'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-500 border-2 border-black dark:border-white rounded-lg p-4">
            <div className="text-2xl font-bold dark:text-white mb-1">1</div>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-bold">
              {language === 'fr' ? 'Soumettez votre projet' : 'Submit your project'}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-500 border-2 border-black dark:border-white rounded-lg p-4">
            <div className="text-2xl font-bold dark:text-white mb-1">2</div>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-bold">
              {language === 'fr' ? 'Obtenez un audit IA' : 'Get an AI audit'}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-500 border-2 border-black dark:border-white rounded-lg p-4">
            <div className="text-2xl font-bold dark:text-white mb-1">3</div>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-bold">
              {language === 'fr' ? 'Recevez des retours' : 'Receive feedback'}
            </p>
          </div>
        </div>
        <Link
          to="/studio"
          className="inline-flex items-center gap-2 px-6 py-3 bg-neo-violet text-white font-bold border-2 border-neo-violet rounded-md shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          {language === 'fr' ? 'Découvrir Studio' : 'Discover Studio'}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* CTA Final */}
      <section className="text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold dark:text-white mb-4">
          {language === 'fr' ? 'Prêt à commencer ?' : 'Ready to start?'}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          {language === 'fr'
            ? 'Rejoignez des milliers d\'utilisateurs qui utilisent SimplePlate pour gagner du temps et être plus productifs.'
            : 'Join thousands of users who use SimplePlate to save time and be more productive.'}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-neo-black dark:bg-white text-white dark:text-black font-bold border-2 border-black dark:border-white rounded-md shadow-neo dark:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-lg"
        >
          {language === 'fr' ? 'Explorer les outils' : 'Explore tools'}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  );
};

