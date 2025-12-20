import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, Navigate, Route, Routes } from 'react-router';
import { Layout } from './components/Layout';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { NotFound } from './pages/NotFound';

/**
 * Minimal SSR entry used for prerendering blog routes at build time.
 * We intentionally avoid React.lazy/Suspense here to ensure content is rendered.
 */
export function render(url: string) {
  const app = (
    <StaticRouter location={url}>
      <Layout>
        <Routes>
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Layout>
    </StaticRouter>
  );

  return renderToString(app);
}

