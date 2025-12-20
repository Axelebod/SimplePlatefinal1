
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CookieConsent } from './components/CookieConsent';
import { ScrollToTop } from './components/ScrollToTop';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';

// Helper function pour gérer les erreurs de chargement avec retry
const lazyWithRetry = (componentImport: () => Promise<any>, retries = 3) => {
  return lazy(async () => {
    let lastError: Error | null = null;
    
    for (let i = 0; i < retries; i++) {
      try {
        const module = await componentImport();
        return module;
      } catch (error: any) {
        lastError = error;
        console.warn(`Failed to load module (attempt ${i + 1}/${retries}):`, error);
        
        // Si c'est une erreur de réseau, attendre avant de réessayer
        if (i < retries - 1 && (error?.message?.includes('fetch') || error?.message?.includes('Failed to fetch'))) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        } else {
          break;
        }
      }
    }
    
    // Si tous les essais ont échoué, re-lancer l'erreur
    throw lastError || new Error('Failed to load module after retries');
  });
};

// Lazy load des pages pour améliorer les performances (code splitting)
const Home = lazyWithRetry(() => import('./pages/Home').then(m => ({ default: m.Home })));
const ToolPage = lazyWithRetry(() => import('./pages/ToolPage').then(m => ({ default: m.ToolPage })));
const Pricing = lazyWithRetry(() => import('./pages/Pricing').then(m => ({ default: m.Pricing })));
const Legal = lazyWithRetry(() => import('./pages/Legal').then(m => ({ default: m.Legal })));
const Privacy = lazyWithRetry(() => import('./pages/Privacy').then(m => ({ default: m.Privacy })));
const Auth = lazyWithRetry(() => import('./pages/Auth').then(m => ({ default: m.Auth })));
const ResetPassword = lazyWithRetry(() => import('./pages/ResetPassword').then(m => ({ default: m.ResetPassword })));
const Contact = lazyWithRetry(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const NotFound = lazyWithRetry(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));
const Sitemap = lazyWithRetry(() => import('./pages/Sitemap').then(m => ({ default: m.Sitemap })));
const Dashboard = lazyWithRetry(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Blog = lazyWithRetry(() => import('./pages/Blog').then(m => ({ default: m.Blog })));
const BlogPost = lazyWithRetry(() => import('./pages/BlogPost').then(m => ({ default: m.BlogPost })));
const Studio = lazyWithRetry(() => import('./pages/Studio').then(m => ({ default: m.Studio })));
const StudioSubmit = lazyWithRetry(() => import('./pages/StudioSubmit').then(m => ({ default: m.StudioSubmit })));
const StudioProject = lazyWithRetry(() => import('./pages/StudioProject').then(m => ({ default: m.StudioProject })));
const About = lazyWithRetry(() => import('./pages/About').then(m => ({ default: m.About })));

// Composant de chargement simple
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-neo-white dark:bg-gray-900">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-neo-violet border-t-transparent mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <ScrollToTop />
        <Layout>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tool/:slug" element={<ToolPage />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/signup" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/sitemap" element={<Sitemap />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* SimplePlate Studio (Phase 2) */}
              <Route path="/studio" element={<Studio />} />
              <Route path="/studio/submit" element={<StudioSubmit />} />
              <Route path="/studio/project/:slug" element={<StudioProject />} />
              <Route path="/studio/project/id/:id" element={<StudioProject />} />
              {/* About/SimplePlate Page */}
              <Route path="/about" element={<About />} />
              <Route path="/simpleplate" element={<About />} />
              
              {/* 404 Catch-all */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
          
          {/* Global Components */}
          <CookieConsent />
        </Layout>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
