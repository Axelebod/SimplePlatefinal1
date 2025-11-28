import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { useUserStore } from '../store/userStore';

export const WelcomeModal: React.FC = () => {
  const { user, credits } = useUserStore();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Vérifier si l'utilisateur vient de s'inscrire (première visite)
    const hasSeenWelcome = localStorage.getItem('simpleplate_welcome_seen');
    const isNewUser = !hasSeenWelcome && credits > 0;

    if (isNewUser) {
      // Petit délai pour une meilleure UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [user, credits]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('simpleplate_welcome_seen', 'true');
  };

  const handleExplore = () => {
    handleClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 border-2 border-black dark:border-white rounded-lg shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#fff] max-w-md w-full p-6 relative animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Content */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-neo-yellow border-2 border-black dark:border-white rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-black" />
          </div>

          <h2 className="font-display text-3xl font-bold dark:text-white">
            Bienvenue sur SimplePlate ! 🎉
          </h2>

          <div className="bg-neo-green/20 border-2 border-neo-green rounded-lg p-4 my-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-6 h-6 text-neo-green" />
              <span className="text-2xl font-bold text-neo-green">
                {credits} crédit{credits > 1 ? 's' : ''} offerts
              </span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Utilisez-les pour tester nos outils IA professionnels
            </p>
          </div>

          <p className="text-gray-600 dark:text-gray-400">
            Découvrez <strong className="text-black dark:text-white">50+ outils</strong> pour coder, écrire et créer instantanément.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleExplore}
              className="flex-1 px-6 py-3 bg-neo-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white rounded-md font-bold shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff] transition-all flex items-center justify-center gap-2"
            >
              Explorer les outils
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                handleClose();
                navigate('/pricing');
              }}
              className="flex-1 px-6 py-3 bg-white dark:bg-gray-700 text-black dark:text-white border-2 border-black dark:border-white rounded-md font-bold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Voir les tarifs
            </button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">
            Vous pouvez fermer cette fenêtre à tout moment
          </p>
        </div>
      </div>
    </div>
  );
};

