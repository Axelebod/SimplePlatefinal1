
import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('simpleplate_consent');
    if (!consent) {
      // Petit délai pour ne pas agresser l'utilisateur direct
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('simpleplate_consent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('simpleplate_consent', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[200] p-4 md:p-6 animate-in slide-in-from-bottom-full duration-500">
      <div className="max-w-4xl mx-auto bg-neo-yellow border-2 border-black shadow-[4px_4px_0px_0px_#000] rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-start gap-4">
          <div className="bg-white p-2 border-2 border-black rounded-full shrink-0">
            <Cookie className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg">On aime les cookies 🍪</h3>
            <p className="text-sm text-gray-800 leading-tight mt-1">
              Nous utilisons des cookies pour analyser le trafic et améliorer votre expérience. 
              Pas de vente de données, promis.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleDecline}
            className="flex-1 md:flex-none px-6 py-2 font-bold text-sm border-2 border-black rounded-md bg-white hover:bg-gray-100 transition-colors"
          >
            Refuser
          </button>
          <button 
            onClick={handleAccept}
            className="flex-1 md:flex-none px-6 py-2 font-bold text-sm border-2 border-black rounded-md bg-neo-black text-white shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
          >
            Accepter
          </button>
        </div>

      </div>
    </div>
  );
};
