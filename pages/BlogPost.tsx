import React from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useSEO } from '../hooks/useSEO';
import { useTranslation } from '../hooks/useTranslation';
import { BLOG_POSTS, getBlogPostBySlug } from '../content/blogPosts';

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
    <article className="max-w-3xl mx-auto">
      <nav className="mb-6">
        <Link to="/blog" className="font-bold underline text-sm text-gray-600 dark:text-gray-300">
          ← Blog
        </Link>
      </nav>

      {/* H1 = mot-clé principal */}
      <h1 className="font-display text-4xl md:text-5xl font-bold dark:text-white">{post.h1}</h1>
      <p className="mt-3 text-gray-600 dark:text-gray-300">{post.excerpt}</p>

      <div className="mt-6 overflow-hidden rounded-lg border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-800 shadow-neo dark:shadow-none">
        <img src={post.cover.src} alt={post.cover.alt} className="w-full h-auto" />
      </div>

      <div className="mt-8 prose prose-sm max-w-none markdown-body dark:prose-invert">
        <ReactMarkdown>{post.bodyMarkdown}</ReactMarkdown>
      </div>

      {/* CTA */}
      <div className="mt-10 bg-neo-yellow border-2 border-black rounded-lg p-6 shadow-neo">
        <h2 className="font-display text-2xl font-bold">Prêt à essayer ?</h2>
        <p className="mt-2 text-sm text-gray-800">
          {language === 'fr'
            ? "Ouvrez SimplePlate et utilisez l'outil adapté à votre besoin."
            : 'Open SimplePlate and use the right tool for your needs.'}
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center justify-center px-5 py-3 bg-neo-black text-white font-bold border-2 border-black rounded-md hover:bg-gray-800 transition-colors"
        >
          Utiliser SimplePlate
        </Link>
      </div>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold dark:text-white">Articles liés</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((p) => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-lg p-4 shadow-neo dark:shadow-none hover:-translate-y-0.5 transition-transform"
              >
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400">{p.readingTime}</div>
                <div className="mt-1 font-bold dark:text-white">{p.title}</div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">{p.excerpt}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
