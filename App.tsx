
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CookieConsent } from './components/CookieConsent';
import { ScrollToTop } from './components/ScrollToTop';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy load des pages pour améliorer les performances (code splitting)
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const ToolPage = lazy(() => import('./pages/ToolPage').then(m => ({ default: m.ToolPage })));
const Pricing = lazy(() => import('./pages/Pricing').then(m => ({ default: m.Pricing })));
const Legal = lazy(() => import('./pages/Legal').then(m => ({ default: m.Legal })));
const Privacy = lazy(() => import('./pages/Privacy').then(m => ({ default: m.Privacy })));
const Auth = lazy(() => import('./pages/Auth').then(m => ({ default: m.Auth })));
const ResetPassword = lazy(() => import('./pages/ResetPassword').then(m => ({ default: m.ResetPassword })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));
const Sitemap = lazy(() => import('./pages/Sitemap').then(m => ({ default: m.Sitemap })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));

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
      <Router>
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
              <Route path="/sitemap" element={<Sitemap />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* 404 Catch-all */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
          
          {/* Global Components */}
          <CookieConsent />
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
