import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Gestionnaire d'erreur global pour filtrer les erreurs des scripts tiers
window.addEventListener('error', (event) => {
  // Filtrer les erreurs provenant de scripts tiers (rum.js, analytics, etc.)
  const errorSource = event.filename || '';
  const errorMessage = event.message || '';
  
  // Ignorer les erreurs des scripts tiers minifiés/obfusqués
  if (
    errorSource.includes('rum.js') ||
    errorSource.includes('analytics') ||
    errorSource.includes('googlesyndication') ||
    errorSource.includes('adsbygoogle') ||
    errorSource.includes('aistudiocdn.com') ||
    errorMessage.includes('carr') || // Erreur minifiée spécifique
    errorMessage.length < 5 // Erreurs minifiées très courtes
  ) {
    // Logger silencieusement en mode développement seulement
    if (import.meta.env.DEV) {
      console.warn('Third-party script error (ignored):', {
        source: errorSource,
        message: errorMessage,
        error: event.error
      });
    }
    // Empêcher l'erreur de remonter
    event.preventDefault();
    return false;
  }
  
  // Laisser les autres erreurs remonter normalement
  return true;
});

// Gestionnaire pour les promesses rejetées non catchées
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  const reasonString = String(reason || '');
  
  // Filtrer les erreurs des scripts tiers
  if (
    reasonString.includes('rum.js') ||
    reasonString.includes('analytics') ||
    reasonString.includes('googlesyndication') ||
    reasonString.includes('adsbygoogle') ||
    reasonString.includes('carr') ||
    reasonString.length < 5
  ) {
    if (import.meta.env.DEV) {
      console.warn('Third-party promise rejection (ignored):', reason);
    }
    event.preventDefault();
    return false;
  }
  
  return true;
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);