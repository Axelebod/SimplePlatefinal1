import React from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useSEO } from '../hooks/useSEO';
import { useTranslation } from '../hooks/useTranslation';
import { BLOG_POSTS, getBlogPostBySlug } from '../content/blogPosts';
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useTranslation();

  const post = React.useMemo(() => (slug ? getBlogPostBySlug(slug) : undefined), [slug]);

  useSEO({
    title: post ? post.title : language === 'fr' ? 'Article | SimplePlate AI' : 'Post | SimplePlate AI',
    description: post ? post.metaDescription : language === 'fr' ? 'Article SimplePlate.' : 'SimplePlate post.',
    language,
    keywords: post?.keywords,
    imagePath: post?.cover.src,
    jsonLdId: 'json-ld-blog-post',
    jsonLd: post
      ? {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.metaDescription,
          datePublished: post.publishedAt,
          image: post.cover.src.startsWith('http')
            ? post.cover.src
            : `${window.location.origin}${post.cover.src}`,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': window.location.href,
          },
        }
      : null,
  });

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl font-bold dark:text-white">Article introuvable</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          {language === 'fr'
            ? "L'URL ne correspond à aucun article."
            : "This URL doesn't match any post."}
        </p>
        <Link
          to="/blog"
          className="mt-6 inline-flex items-center justify-center px-5 py-3 bg-neo-black dark:bg-white text-white dark:text-black font-bold border-2 border-black dark:border-white rounded-md"
        >
          Retour au blog
        </Link>
      </div>
    );
  }

  const related = post.relatedSlugs
    .map((s) => BLOG_POSTS.find((p) => p.slug === s))
    .filter(Boolean) as typeof BLOG_POSTS;

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: language === 'fr' ? 'Accueil' : 'Home', path: '/' },
          { label: language === 'fr' ? 'Blog' : 'Blog', path: '/blog' },
          { label: post.title },
        ]}
      />

      {/* Back button */}
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 mb-6 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-neo-violet transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{language === 'fr' ? 'Retour au blog' : 'Back to blog'}</span>
      </Link>

      {/* Header */}
      <header className="mb-10 pb-8 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl md:text-5xl font-bold dark:text-white mb-4 leading-tight">
          {post.h1}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          {post.excerpt}
        </p>
        
        {/* Metadata */}
        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{post.publishedAt}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{post.readingTime}</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-3xl font-bold mt-12 mb-6 dark:text-white" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-2xl font-bold mt-10 mb-4 dark:text-white" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-xl font-bold mt-8 mb-3 dark:text-white" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="mb-6 leading-7 text-gray-700 dark:text-gray-300" {...props} />
            ),
            a: ({ node, ...props }) => (
              <a className="text-neo-violet font-semibold hover:underline" {...props} />
            ),
            strong: ({ node, ...props }) => (
              <strong className="font-bold text-black dark:text-white" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc pl-6 mb-6 space-y-2" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="text-gray-700 dark:text-gray-300 leading-7" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal pl-6 mb-6 space-y-2" {...props} />
            ),
            code: ({ node, ...props }) => (
              <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200" {...props} />
            ),
            pre: ({ node, ...props }) => (
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-6 border border-gray-200 dark:border-gray-700" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 my-6 italic text-gray-600 dark:text-gray-400" {...props} />
            ),
          }}
        >
          {post.bodyMarkdown}
        </ReactMarkdown>
      </div>

      {/* CTA */}
      <div className="mt-12 bg-gradient-to-br from-neo-yellow to-neo-green border-2 border-black dark:border-white rounded-xl p-8 shadow-neo dark:shadow-[2px_2px_0px_0px_#fff]">
        <h2 className="font-display text-3xl font-bold mb-3 dark:text-white">
          {language === 'fr' ? 'Prêt à essayer ?' : 'Ready to try?'}
        </h2>
        <p className="text-base text-gray-800 dark:text-gray-200 mb-6">
          {language === 'fr'
            ? "Ouvrez SimplePlate et utilisez l'outil adapté à votre besoin. Plus de 50 outils gratuits à votre disposition."
            : 'Open SimplePlate and use the right tool for your needs. Over 50 free tools at your disposal.'}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-neo-black dark:bg-white text-white dark:text-black font-bold border-2 border-black dark:border-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-neo-sm hover:shadow-neo"
        >
          <span>{language === 'fr' ? 'Utiliser SimplePlate' : 'Use SimplePlate'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {related.length > 0 && (
        <section className="mt-12 pt-8 border-t-2 border-black dark:border-white">
          <h2 className="font-display text-3xl font-bold dark:text-white mb-6">
            {language === 'fr' ? 'Articles liés' : 'Related Articles'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {related.map((p) => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="group bg-white dark:bg-gray-800 border-2 border-black dark:border-white rounded-xl overflow-hidden shadow-neo dark:shadow-[2px_2px_0px_0px_#fff] hover:shadow-neo-lg dark:hover:shadow-[4px_4px_0px_0px_#fff] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-1 bg-gradient-to-r from-neo-violet to-neo-blue"></div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{p.publishedAt}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{p.readingTime}</span>
                    </div>
                  </div>
                  <h3 className="font-display text-lg font-bold dark:text-white group-hover:text-neo-violet transition-colors mb-2 line-clamp-2">
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{p.excerpt}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-bold text-neo-violet group-hover:gap-3 transition-all">
                    <span>{language === 'fr' ? 'Lire' : 'Read'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
