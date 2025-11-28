import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useUserStore } from '../store/userStore';

export const HomeCTA: React.FC = () => {
  const { user } = useUserStore();

  // Ne pas afficher si l'utilisateur est connecté
  if (user) return null;

  return (
    <div className="bg-gradient-to-r from-neo-violet to-neo-blue border-2 border-black dark:border-white rounded-lg p-6 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-center md:text-left">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-2 justify-center md:justify-start">
            <Sparkles className="w-6 h-6" />
            Commencez gratuitement
          </h2>
          <p className="text-white/90 font-medium">
            5 crédits offerts dès l'inscription • Aucune carte bancaire requise
          </p>
        </div>
        <Link
          to="/signup"
          className="px-6 py-3 bg-neo-yellow border-2 border-black rounded-md font-bold text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center gap-2 whitespace-nowrap"
        >
          Créer mon compte
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

