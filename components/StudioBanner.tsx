import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useUserStore } from '../store/userStore';

export const StudioBanner: React.FC = () => {
  const { language } = useTranslation();
  const { user } = useUserStore();

  return (
    <div className="bg-gradient-to-r from-neo-violet to-neo-blue border-4 border-black dark:border-white rounded-lg p-6 md:p-8 mb-8 shadow-neo dark:shadow-[4px_4px_0px_0px_#fff] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white rounded-lg border-2 border-black flex items-center justify-center">
                <Rocket className="w-6 h-6 text-neo-violet" />
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                SimplePlate <span className="text-neo-yellow">Studio</span>
              </h2>
            </div>
            <p className="text-white/90 mb-4 text-lg">
              {language === 'fr'
                ? 'La plateforme communautaire pour les Micro-SaaS. Soumettez votre projet, obtenez un audit IA complet et recevez des retours de la communauté.'
                : 'The community platform for Micro-SaaS. Submit your project, get a complete AI audit and receive community feedback.'}
            </p>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2 text-white/90">
                <Zap className="w-4 h-4 text-neo-yellow" />
                <span className="text-sm font-bold">
                  {language === 'fr' ? 'Audit IA complet' : 'Complete AI Audit'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <TrendingUp className="w-4 h-4 text-neo-yellow" />
                <span className="text-sm font-bold">
                  {language === 'fr' ? 'Classements hebdo/jour' : 'Weekly/Daily Rankings'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Rocket className="w-4 h-4 text-neo-yellow" />
                <span className="text-sm font-bold">
                  {language === 'fr' ? 'Gagnez 0.5 crédit/avis' : 'Earn 0.5 credit/review'}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/studio"
                className="inline-flex items-center gap-2 px-6 py-3 bg-neo-yellow text-black font-bold border-2 border-black rounded-md shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                {language === 'fr' ? 'Découvrir Studio' : 'Discover Studio'}
                <ArrowRight className="w-5 h-5" />
              </Link>
              {!user && (
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neo-violet font-bold border-2 border-black rounded-md shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  {language === 'fr' ? 'Créer un compte' : 'Create Account'}
                </Link>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white/20 rounded-lg border-2 border-white/30 flex items-center justify-center">
              <Rocket className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

