import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, Search } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { useTranslation } from '../hooks/useTranslation';
import { getBlogPosts } from '../content/blogPosts';

export const Blog: React.FC = () => {
  const { language } = useTranslation();
  const posts = React.useMemo(() => getBlogPosts(), []);
  const [query, setQuery] = React.useState('');

  const visiblePosts = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => {
      const haystack = `${p.title} ${p.h1} ${p.excerpt} ${p.keywords.join(' ')}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [posts, query]);

  const featured = visiblePosts[0];
  const rest = featured ? visiblePosts.slice(1) : [];

  useSEO({
    title: language === 'fr' ? 'Blog | SimplePlate AI' : 'Blog | SimplePlate AI',
    description:
      language === 'fr'
        ? "Articles SimplePlate: SEO, outils IA, productivité, web et business. Guides pratiques pour utiliser SimplePlate et gagner du temps."
        : 'SimplePlate blog: SEO, AI tools, productivity, web and business. Practical guides to use SimplePlate and move faster.',
    language,
    keywords:
      language === 'fr'
        ? ['blog', 'SimplePlate', 'outils IA', 'SEO', 'productivité']
        : ['blog', 'SimplePlate', 'AI tools', 'SEO', 'productivity'],
  });

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <div className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-xl shadow-neo dark:shadow-none overflow-hidden">
          <div className="p-6 md:p-10">
            <h1 className="font-display text-4xl md:text-6xl font-bold dark:text-white">Blog</h1>
            <p className="mt-3 text-gray-700 dark:text-gray-300 max-w-2xl">
              {language === 'fr'
                ? "Guides SEO + contenus actionnables pour produire plus vite (et mieux) avec SimplePlate."
                : 'SEO guides + actionable content to ship faster (and better) with SimplePlate.'}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" aria-hidden="true" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={language === 'fr' ? 'Rechercher un article (SEO, landing, IA...)' : 'Search posts (SEO, landing, AI...)'}
                  className="w-full pl-10 pr-3 py-3 bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-600 rounded-md font-medium text-black dark:text-white placeholder:text-gray-500"
                />
              </div>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-neo-black dark:bg-white text-white dark:text-black font-bold border-2 border-black dark:border-white rounded-md hover:opacity-90 transition-opacity"
              >
                {language === 'fr' ? 'Utiliser un outil' : 'Use a tool'}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
              {language === 'fr'
                ? `${visiblePosts.length} article${visiblePosts.length > 1 ? 's' : ''}`
                : `${visiblePosts.length} post${visiblePosts.length > 1 ? 's' : ''}`}
            </div>
          </div>
        </div>
      </header>

      {featured && (
        <section className="mb-10">
          <Link
            to={`/blog/${featured.slug}`}
            className="group block bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-xl overflow-hidden shadow-neo dark:shadow-none hover:-translate-y-0.5 transition-transform"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr]">
              <div className="bg-neo-yellow border-b-2 lg:border-b-0 lg:border-r-2 border-black dark:border-gray-600 p-6">
                <div className="aspect-[16/9] w-full bg-white/70 rounded-lg border-2 border-black overflow-hidden flex items-center justify-center">
                  <img src={featured.cover.src} alt={featured.cover.alt} className="w-full h-full object-contain" loading="lazy" />
                </div>
              </div>
              <div className="p-6 lg:p-8">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold text-gray-600 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    {featured.publishedAt}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                    {featured.readingTime}
                  </span>
                </div>
                <h2 className="mt-3 font-display text-2xl md:text-3xl font-bold text-black dark:text-white group-hover:text-neo-violet transition-colors">
                  {featured.title}
                </h2>
                <p className="mt-3 text-gray-700 dark:text-gray-300">{featured.excerpt}</p>
                <div className="mt-5 inline-flex items-center gap-2 font-bold underline">
                  {language === 'fr' ? "Lire l'article" : 'Read the post'}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {featured.keywords.slice(0, 3).map((k) => (
                    <span
                      key={k}
                      className="px-2 py-1 text-xs font-bold bg-white dark:bg-gray-900 border border-black dark:border-gray-600 rounded-md text-black dark:text-white"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rest.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="group bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-xl overflow-hidden shadow-neo dark:shadow-none hover:-translate-y-0.5 transition-transform"
          >
            <div className="bg-neo-yellow/60 dark:bg-gray-900 border-b-2 border-black dark:border-gray-600 p-4">
              <div className="aspect-[16/9] w-full bg-white/70 dark:bg-gray-800 rounded-lg border-2 border-black dark:border-gray-600 overflow-hidden flex items-center justify-center">
                <img src={post.cover.src} alt={post.cover.alt} className="w-full h-full object-contain" loading="lazy" />
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between gap-4 text-xs font-bold text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  {post.publishedAt}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  {post.readingTime}
                </span>
              </div>
              <h3 className="mt-2 font-display text-xl font-bold text-black dark:text-white group-hover:text-neo-violet transition-colors">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{post.excerpt}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.keywords.slice(0, 2).map((k) => (
                  <span
                    key={k}
                    className="px-2 py-1 text-xs font-bold bg-white dark:bg-gray-900 border border-black dark:border-gray-600 rounded-md text-black dark:text-white"
                  >
                    {k}
                  </span>
                ))}
              </div>
              <div className="mt-4 inline-flex items-center gap-2 font-bold text-sm underline">
                {language === 'fr' ? "Lire l'article" : 'Read'}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <section className="mt-10 bg-neo-yellow border-2 border-black rounded-lg p-6 shadow-neo">
        <h2 className="font-display text-2xl font-bold">Passez à l'action</h2>
        <p className="mt-2 text-sm text-gray-800">
          {language === 'fr'
            ? "Choisissez un outil et générez votre contenu en quelques secondes."
            : 'Pick a tool and generate your output in seconds.'}
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center justify-center px-5 py-3 bg-neo-black text-white font-bold border-2 border-black rounded-md hover:bg-gray-800 transition-colors"
        >
          Utiliser SimplePlate
        </Link>
      </section>
    </div>
  );
};
