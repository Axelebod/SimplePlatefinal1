
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ToolPage } from './pages/ToolPage';
import { Pricing } from './pages/Pricing';
import { Legal } from './pages/Legal';
import { Auth } from './pages/Auth';
import { ResetPassword } from './pages/ResetPassword';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';
import { Sitemap } from './pages/Sitemap';
import { Dashboard } from './pages/Dashboard';
import { CookieConsent } from './components/CookieConsent';
import { ScrollToTop } from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tool/:slug" element={<ToolPage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/legal" element={<Legal />} />
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
        
        {/* Global Components */}
        <CookieConsent />
      </Layout>
    </Router>
  );
}

export default App;
