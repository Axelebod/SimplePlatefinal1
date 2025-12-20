import React from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Calendar, Clock, Link as LinkIcon } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { useTranslation } from '../hooks/useTranslation';
import { BLOG_POSTS, getBlogPostBySlug } from '../content/blogPosts';

function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function nodeToText(node: React.ReactNode): string {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join('');
  if (React.isValidElement(node)) return nodeToText(node.props.children);
  return '';
}

function toIsoDate(dateYYYYMMDD: string) {
  // "2025-12-17" -> "2025-12-17T00:00:00.000Z"
  const d = new Date(`${dateYYYYMMDD}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

function extractToc(markdown: string) {
  const items: Array<{ level: 2 | 3; text: string; id: string }> = [];
  const lines = markdown.split('\n');
  let inCode = false;
  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;

    const m = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!m) continue;
    const level = m[1].length as 2 | 3;
    const text = m[2].trim();
    if (!text) continue;
    items.push({ level, text, id: slugifyHeading(text) });
  }
  return items;
}

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useTranslation();
  const [copied, setCopied] = React.useState(false);

  const post = React.useMemo(() => (slug ? getBlogPostBySlug(slug) : undefined), [slug]);
  const toc = React.useMemo(() => (post ? extractToc(post.bodyMarkdown) : []), [post]);
  const publishedIso = post ? toIsoDate(post.publishedAt) : undefined;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore (clipboard may be blocked)
    }
  };

  useSEO({
    title: post ? post.title : language === 'fr' ? 'Article | SimplePlate AI' : 'Post | SimplePlate AI',
    description: post ? post.metaDescription : language === 'fr' ? 'Article SimplePlate.' : 'SimplePlate post.',
    language,
    keywords: post?.keywords,
    imagePath: post?.cover.src,
    ogType: post ? 'article' : 'website',
    publishedTime: publishedIso,
    modifiedTime: publishedIso,
    jsonLdId: 'json-ld-blog-post',
    jsonLd: post
      ? (() => {
          const absoluteCover = post.cover.src.startsWith('http')
            ? post.cover.src
            : `${window.location.origin}${post.cover.src}`;
          const canonical = window.location.href;

          return [
            {
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.metaDescription,
              datePublished: publishedIso ?? post.publishedAt,
              dateModified: publishedIso ?? post.publishedAt,
              image: [absoluteCover],
              keywords: post.keywords.join(', '),
              inLanguage: language,
              author: {
                '@type': 'Organization',
                name: 'SimplePlate',
              },
              publisher: {
                '@type': 'Organization',
                name: 'SimplePlate AI',
                logo: {
                  '@type': 'ImageObject',
                  url: `${window.location.origin}/favicon/web-app-manifest-512x512.png`,
                },
              },
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': canonical,
              },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: language === 'fr' ? 'Accueil' : 'Home',
                  item: `${window.location.origin}/?lang=${language}`,
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Blog',
                  item: `${window.location.origin}/blog?lang=${language}`,
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: post.title,
                  item: canonical,
                },
              ],
            },
          ];
        })()
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
    <article className="max-w-6xl mx-auto">
      <nav className="mb-6 flex items-center justify-between gap-4">
        <Link to="/blog" className="font-bold underline text-sm text-gray-600 dark:text-gray-300">
          ← Blog
        </Link>
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-md font-bold text-sm text-black dark:text-white hover:-translate-y-0.5 transition-transform"
          type="button"
          title={language === 'fr' ? 'Copier le lien' : 'Copy link'}
        >
          <LinkIcon className="w-4 h-4" aria-hidden="true" />
          {copied ? (language === 'fr' ? 'Copié' : 'Copied') : language === 'fr' ? 'Partager' : 'Share'}
        </button>
      </nav>

      <header className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-xl shadow-neo dark:shadow-none overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr]">
          <div className="bg-neo-yellow/70 border-b-2 lg:border-b-0 lg:border-r-2 border-black dark:border-gray-600 p-6">
            <div className="aspect-[16/9] w-full bg-white/70 rounded-lg border-2 border-black overflow-hidden flex items-center justify-center">
              <img src={post.cover.src} alt={post.cover.alt} className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="p-6 lg:p-8">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold text-gray-600 dark:text-gray-300">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                {post.publishedAt}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-4 h-4" aria-hidden="true" />
                {post.readingTime}
              </span>
            </div>

            {/* H1 = mot-clé principal */}
            <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold dark:text-white">{post.h1}</h1>
            <p className="mt-3 text-gray-700 dark:text-gray-300">{post.excerpt}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {post.keywords.slice(0, 5).map((k) => (
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
      </header>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 items-start">
        <div className="min-w-0">
          <div className="prose prose-sm max-w-none markdown-body dark:prose-invert">
            <ReactMarkdown
              components={{
                h2: ({ children, ...props }) => {
                  const text = nodeToText(children);
                  const id = slugifyHeading(text);
                  return (
                    <h2 id={id} className="scroll-mt-28" {...props}>
                      {children}
                    </h2>
                  );
                },
                h3: ({ children, ...props }) => {
                  const text = nodeToText(children);
                  const id = slugifyHeading(text);
                  return (
                    <h3 id={id} className="scroll-mt-28" {...props}>
                      {children}
                    </h3>
                  );
                },
              }}
            >
              {post.bodyMarkdown}
            </ReactMarkdown>
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
        </div>

        {/* TOC */}
        {toc.length > 0 && (
          <aside className="hidden lg:block sticky top-24">
            <div className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-xl shadow-neo dark:shadow-none p-5">
              <div className="font-display font-bold text-lg dark:text-white">
                {language === 'fr' ? 'Sommaire' : 'Contents'}
              </div>
              <div className="mt-3 flex flex-col gap-2">
                {toc.map((item) => (
                  <a
                    key={`${item.level}-${item.id}`}
                    href={`#${item.id}`}
                    className={`text-sm font-bold underline hover:text-neo-violet transition-colors ${
                      item.level === 3 ? 'ml-3 text-gray-600 dark:text-gray-300' : 'text-black dark:text-white'
                    }`}
                  >
                    {item.text}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold dark:text-white">Articles liés</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((p) => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="group bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-xl overflow-hidden shadow-neo dark:shadow-none hover:-translate-y-0.5 transition-transform"
              >
                <div className="bg-neo-yellow/60 dark:bg-gray-900 border-b-2 border-black dark:border-gray-600 p-3">
                  <div className="aspect-[16/9] w-full bg-white/70 dark:bg-gray-800 rounded-lg border-2 border-black dark:border-gray-600 overflow-hidden flex items-center justify-center">
                    <img src={p.cover.src} alt={p.cover.alt} className="w-full h-full object-contain" loading="lazy" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-4 text-xs font-bold text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-4 h-4" aria-hidden="true" />
                      {p.publishedAt}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-4 h-4" aria-hidden="true" />
                      {p.readingTime}
                    </span>
                  </div>
                  <div className="mt-2 font-bold dark:text-white group-hover:text-neo-violet transition-colors">
                    {p.title}
                  </div>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">{p.excerpt}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
