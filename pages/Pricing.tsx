import React from 'react';
import { useUserStore } from '../store/userStore';
import { Zap, AlertCircle, Tag } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useSEO } from '../hooks/useSEO';

export const Pricing: React.FC = () => {
  const { buyCredits } = useUserStore();
  const { t, language } = useTranslation();

  useSEO({
    title: language === 'fr' ? 'Tarifs & Crédits | SimplePlate AI' : 'Pricing & Credits | SimplePlate AI',
    description:
      language === 'fr'
        ? "Achetez des packs de crédits et utilisez 50+ outils IA (texte, image, dev, business). Paiement sécurisé via Stripe."
        : 'Buy credit packs and use 50+ AI tools (text, image, dev, business). Secure payments via Stripe.',
    language,
    keywords:
      language === 'fr'
        ? ['tarifs', 'crédits', 'outils IA', 'générateur IA', 'Stripe', 'SimplePlate AI']
        : ['pricing', 'credits', 'AI tools', 'AI generator', 'Stripe', 'SimplePlate AI'],
  });

  const creditPacks = [
    { 
        amount: 1, 
        basePrice: 1.00, 
        subtitle: "Pour tester" 
    },
    { 
        amount: 50, 
        basePrice: 8.99, 
        subtitle: "Soit 0.18€ / crédit" 
    },
    { 
        amount: 100, 
        basePrice: 14.99, 
        subtitle: "Soit 0.15€ / crédit" 
    },
    { 
        amount: 500, 
        basePrice: 49.99, 
        subtitle: "Soit 0.10€ / crédit - Pour les agences" 
    }
  ];

  const getPrice = (basePrice: number) => {
      return basePrice.toFixed(2);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 dark:text-white">
          {t('pricing.title')} <span className="bg-neo-green px-2 border border-black dark:border-white transform -rotate-1 inline-block shadow-[3px_3px_0px_0px_#000] dark:shadow-none text-black">{t('pricing.titleHighlight')}</span>.
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">{t('pricing.subtitle')}</p>
      </div>

      {/* ALERT INFO RECHARGE */}
      <div className="max-w-2xl mx-auto mb-12 bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800 p-4 rounded-md flex items-start gap-3 text-blue-800 dark:text-blue-200 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
              <p className="mb-2">
                  <strong>{t('pricing.freeCredits')} :</strong> {t('pricing.freeCreditsDesc')}
              </p>
              <p>
                  <strong>{t('pricing.paidCredits')} :</strong> {t('pricing.paidCreditsDesc')}
              </p>
          </div>
      </div>

      {/* CREDIT PACKS */}
      <div className="mt-12">
          <h2 className="text-2xl font-bold mb-2 text-center dark:text-white">{t('pricing.creditPacks')}</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">{t('pricing.creditPacksDesc')}</p>
          

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {creditPacks.map((pack, idx) => (
                  <div key={idx} className={`p-6 border-2 border-black dark:border-white rounded-lg flex flex-col items-center hover:bg-gray-50 dark:hover:bg-gray-500 transition-all relative overflow-hidden bg-white dark:bg-gray-600 shadow-neo dark:shadow-[2px_2px_0px_0px_#fff]`}>
                      
                      {idx === 2 && (
                        <div className="absolute top-3 right-3 bg-neo-yellow border-2 border-black px-2 py-1 rounded text-xs font-bold">
                            Populaire
                        </div>
                      )}

                      <Zap className="w-8 h-8 text-neo-orange mb-3" />
                      <span className="font-bold text-xl mb-1 dark:text-white">{pack.amount} Crédits</span>
                      <span className="text-xs font-bold mb-3 text-gray-500 dark:text-gray-400">
                          {pack.subtitle}
                      </span>
                      
                      <div className="flex items-center gap-2 mb-6">
                          <span className="font-display font-bold text-3xl text-black dark:text-white">
                              {getPrice(pack.basePrice)}€
                          </span>
                      </div>

                      <button 
                        onClick={() => buyCredits(pack.amount)} 
                        className="w-full py-3 border-2 border-black dark:border-white font-bold rounded-lg bg-neo-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                      >
                          {t('pricing.buy')}
                      </button>
                  </div>
              ))}
          </div>
      </div>

      {/* INFO SECTION */}
      <div className="mt-12 bg-gray-50 dark:bg-gray-800 border-2 border-black dark:border-white rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 dark:text-white">{t('pricing.howItWorks')}</h3>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-neo-violet text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                  <p><strong>{t('pricing.step1')}</strong> - {t('pricing.step1Desc')}</p>
              </div>
              <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-neo-violet text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                  <p><strong>{t('pricing.step2')}</strong> - {t('pricing.step2Desc')}</p>
              </div>
              <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-neo-violet text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                  <p><strong>{t('pricing.step3')}</strong> - {t('pricing.step3Desc')}</p>
              </div>
          </div>
      </div>
    </div>
  );
};
