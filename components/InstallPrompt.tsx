
import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, X, ArrowDown } from 'lucide-react';

export const InstallPrompt: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Vérifier si l'app est déjà installée (Standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    
    // 2. Vérifier si on est sur mobile (User Agent simple)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipad|ipod|android/.test(userAgent);
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);

    // 3. Vérifier si l'utilisateur a déjà fermé la pop-up récemment
    const dismissed = localStorage.getItem('simpleplate_install_dismissed');

    if (isMobile && !isStandalone && !dismissed) {
      // Petit délai pour ne pas agresser l'utilisateur immédiatement
      const timer = setTimeout(() => {
          setIsIOS(isIosDevice);
          setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // On ne réaffiche pas avant un moment (ex: session)
    localStorage.setItem('simpleplate_install_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[150] p-4 md:hidden animate-in slide-in-from-bottom-full duration-500">
      <div className="bg-neo-violet border-2 border-black shadow-[4px_4px_0px_0px_#000] rounded-lg p-5 relative">
        
        {/* Close Button */}
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 bg-white border border-black rounded hover:bg-red-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex gap-4 items-start pr-6">
            <div className="bg-white p-2 border-2 border-black rounded-md shrink-0">
                <PlusSquare className="w-8 h-8 text-black" />
            </div>
            <div>
                <h3 className="font-display font-bold text-lg leading-tight mb-1">
                    Installez l'App 📱
                </h3>
                <p className="text-sm font-medium text-gray-900 leading-snug">
                    Pour une expérience plein écran et un accès instantané.
                </p>
            </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 bg-white/50 p-3 rounded border border-black border-dashed text-sm font-bold text-gray-800 flex items-center gap-3">
            {isIOS ? (
                <>
                    <span>1. Appuyez sur</span>
                    <Share className="w-5 h-5" />
                    <span>2. "Sur l'écran d'accueil"</span>
                </>
            ) : (
                <>
                     <span>1. Menu (3 points)</span>
                     <span>2. "Ajouter à l'accueil"</span>
                </>
            )}
        </div>

        {/* Animated Arrow pointing to the browser toolbar area */}
        {isIOS && (
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center pointer-events-none">
                <span className="text-neo-violet font-bold text-xs bg-black px-2 py-0.5 rounded mb-1">C'est ici !</span>
                <ArrowDown className="w-8 h-8 text-black animate-bounce drop-shadow-[0_2px_0_rgba(255,255,255,1)]" />
            </div>
        )}

      </div>
    </div>
  );
};
