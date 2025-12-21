import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { useTranslation } from '../hooks/useTranslation';
import { getBlogPosts } from '../content/blogPosts';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="font-display text-5xl md:text-6xl font-bold dark:text-white mb-4">
          {language === 'fr' ? 'Blog SimplePlate' : 'SimplePlate Blog'}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {language === 'fr'
            ? "Guides pratiques, astuces SEO, et conseils pour utiliser SimplePlate et booster votre productivité."
            : 'Practical guides, SEO tips, and advice to use SimplePlate and boost your productivity.'}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {posts.map((post, index) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="group relative bg-white dark:bg-gray-800 border-2 border-black dark:border-white rounded-xl overflow-hidden shadow-neo dark:shadow-[2px_2px_0px_0px_#fff] hover:shadow-neo-lg dark:hover:shadow-[4px_4px_0px_0px_#fff] hover:-translate-y-1 transition-all duration-300 flex flex-col"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient accent bar */}
            <div className="h-2 bg-gradient-to-r from-neo-violet via-neo-blue to-neo-green"></div>
            
            <div className="p-6 flex-1 flex flex-col">
              {/* Metadata */}
              <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{post.publishedAt}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.readingTime}</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="font-display text-xl font-bold text-black dark:text-white group-hover:text-neo-violet transition-colors mb-3 line-clamp-2">
                {post.title}
              </h2>

              {/* Excerpt */}
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 flex-1">
                {post.excerpt}
              </p>

              {/* Read more */}
              <div className="flex items-center gap-2 font-bold text-sm text-neo-violet group-hover:gap-3 transition-all">
                <span>{language === 'fr' ? 'Lire l\'article' : 'Read article'}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-neo-yellow to-neo-green border-2 border-black dark:border-white rounded-xl p-8 shadow-neo dark:shadow-[2px_2px_0px_0px_#fff] text-center">
        <h2 className="font-display text-3xl font-bold mb-3 dark:text-white">
          {language === 'fr' ? 'Passez à l\'action' : 'Take Action'}
        </h2>
        <p className="text-base text-gray-800 dark:text-gray-200 mb-6 max-w-2xl mx-auto">
          {language === 'fr'
            ? "Choisissez un outil SimplePlate et générez votre contenu en quelques secondes. Plus de 50 outils gratuits à votre disposition."
            : 'Choose a SimplePlate tool and generate your content in seconds. Over 50 free tools at your disposal.'}
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-neo-black dark:bg-white text-white dark:text-black font-bold border-2 border-black dark:border-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-neo-sm hover:shadow-neo"
        >
          {language === 'fr' ? 'Découvrir les outils' : 'Discover Tools'}
        </Link>
      </section>
    </div>
  );
};
