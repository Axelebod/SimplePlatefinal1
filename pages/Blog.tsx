import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { useTranslation } from '../hooks/useTranslation';
import { getBlogPosts } from '../content/blogPosts';

export const Blog: React.FC = () => {
  const { language } = useTranslation();
  const posts = React.useMemo(() => getBlogPosts(), []);

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
    <div className="max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold dark:text-white">Blog</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          {language === 'fr'
            ? "Guides pratiques pour utiliser SimplePlate (SEO, web, business, dev)."
            : 'Practical guides to use SimplePlate (SEO, web, business, dev).'}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="group bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-lg overflow-hidden shadow-neo dark:shadow-none hover:-translate-y-0.5 transition-transform"
          >
            <div className="p-5">
              <div className="flex items-center justify-between gap-4 text-xs font-bold text-gray-500 dark:text-gray-400">
                <span>{post.publishedAt}</span>
                <span>{post.readingTime}</span>
              </div>
              <h2 className="mt-2 font-display text-xl font-bold text-black dark:text-white group-hover:text-neo-violet transition-colors">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{post.excerpt}</p>
              <div className="mt-4 inline-flex items-center font-bold text-sm underline">Lire l'article</div>
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
