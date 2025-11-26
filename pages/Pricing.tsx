
import React from 'react';
import { useUserStore } from '../store/userStore';
import { Check, X, Crown, Zap, Shield, TrendingUp, AlertCircle, Tag } from 'lucide-react';

export const Pricing: React.FC = () => {
  const { isPro, togglePro, buyCredits } = useUserStore();

  const features = [
    { name: "Accès à tous les outils", free: true, pro: true },
    { name: "Crédits gratuits", free: "5 / semaine (non cumulable)", pro: "5 / semaine (non cumulable)" },
    { name: "Crédits payants", free: "0", pro: "100 / mois" },
    { name: "Génération d'Images IA", free: false, pro: true },
    { name: "Support Prioritaire", free: false, pro: true },
    { name: "Sans Publicité", free: false, pro: true },
  ];

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
        subtitle: "Plus cher que le PRO", 
        alert: true 
    },
    { 
        amount: 500, 
        basePrice: 49.99, 
        subtitle: "Pour les agences" 
    }
  ];

  const getPrice = (basePrice: number) => {
      return basePrice.toFixed(2);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 dark:text-white">
          Des tarifs <span className="bg-neo-green px-2 border border-black dark:border-white transform -rotate-1 inline-block shadow-[3px_3px_0px_0px_#000] dark:shadow-none text-black">stratégiques</span>.
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">L'abonnement est le moyen le plus intelligent d'économiser.</p>
      </div>

      {/* ALERT INFO RECHARGE */}
      <div className="max-w-2xl mx-auto mb-12 bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800 p-4 rounded-md flex items-start gap-3 text-blue-800 dark:text-blue-200 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
              <p className="mb-2">
                  <strong>Crédits gratuits :</strong> 5 crédits par semaine (non cumulables - maximum 5). Si vous ne les utilisez pas, ils ne s'accumulent pas.
              </p>
              <p>
                  <strong>Crédits PRO :</strong> 100 crédits payants par mois qui s'ajoutent à vos crédits payants existants. Les crédits payants ne s'expirent jamais.
              </p>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        
        {/* FREE PLAN */}
        <div className="bg-white dark:bg-gray-600 border-2 border-black dark:border-white rounded-lg shadow-neo dark:shadow-[2px_2px_0px_0px_#fff] p-8 flex flex-col relative">
          <div className="mb-6">
            <h3 className="text-2xl font-display font-bold dark:text-white">Découverte</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 h-12">Pour tester la plateforme.</p>
          </div>
          <div className="mb-8">
            <span className="text-4xl font-bold dark:text-white">Gratuit</span>
          </div>

          <ul className="space-y-4 mb-8 flex-1">
            {features.map((feat, idx) => (
              <li key={idx} className="flex items-center gap-3">
                {feat.free ? (
                   <div className="min-w-[24px] h-6 bg-neo-green/20 border border-black dark:border-white rounded-full flex items-center justify-center">
                     <Check className="w-3 h-3 text-black dark:text-white" />
                   </div>
                ) : (
                  <div className="min-w-[24px] h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-500">
                     <X className="w-3 h-3 text-gray-400" />
                   </div>
                )}
                <span className={feat.free ? 'text-black dark:text-white font-medium' : 'text-gray-400 decoration-dashed'}>
                    {typeof feat.free === 'string' ? feat.free : feat.name}
                </span>
              </li>
            ))}
          </ul>

          <button 
            disabled={!isPro} 
            onClick={isPro ? togglePro : undefined}
            className={`w-full py-4 font-bold border-2 border-black dark:border-white rounded-md transition-all ${!isPro ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-default' : 'bg-white hover:bg-gray-50 dark:bg-black dark:text-white dark:hover:bg-gray-900'}`}
          >
            {!isPro ? "Plan Actuel" : "Revenir au Gratuit"}
          </button>
        </div>

        {/* PRO PLAN */}
        <div className="bg-neo-violet border-2 border-black dark:border-gray-500 rounded-lg shadow-[8px_8px_0px_0px_#000] dark:shadow-none p-8 flex flex-col relative transform md:-translate-y-4">
           <div className="absolute top-0 right-0 bg-neo-yellow border-l-2 border-b-2 border-black px-3 py-1 font-bold text-xs uppercase tracking-wider text-black">
             Meilleure Offre
           </div>
          
          <div className="mb-6">
            <h3 className="text-2xl font-display font-bold flex items-center gap-2 text-black">
              <Crown className="w-6 h-6 fill-white text-black" /> PRO
            </h3>
            <p className="text-gray-800 mt-2 h-12 font-medium">L'option la moins chère pour 100 crédits + réductions.</p>
          </div>
          <div className="mb-8 text-black">
            <span className="text-4xl font-bold">9.99€</span>
            <span className="text-gray-800 opacity-80">/mois</span>
          </div>

          <ul className="space-y-4 mb-8 flex-1 text-black">
            {features.map((feat, idx) => (
              <li key={idx} className="flex items-center gap-3">
                {feat.pro ? (
                   <div className="min-w-[24px] h-6 bg-white rounded-full flex items-center justify-center border border-black">
                     <Check className="w-3 h-3 text-black" />
                   </div>
                ) : (
                  <X className="w-5 h-5 text-gray-400" />
                )}
                 <span className="text-black font-bold">
                    {typeof feat.pro === 'string' ? feat.pro : feat.name}
                </span>
              </li>
            ))}
          </ul>

          <button 
            onClick={() => !isPro && togglePro()}
            disabled={isPro}
            className={`w-full py-4 font-bold border-2 border-black rounded-md shadow-[4px_4px_0px_0px_#000] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${isPro ? 'bg-green-400 text-black cursor-default' : 'bg-neo-black text-white hover:bg-gray-900'}`}
          >
            {isPro ? "Vous êtes PRO" : "Passer PRO maintenant"}
          </button>
          <p className="text-center text-xs mt-3 opacity-60 text-black">Sans engagement. Annulation à tout moment.</p>
        </div>

      </div>

      {/* ADD-ONS SECTION */}
      <div className="mt-12 border-t-2 border-black dark:border-white pt-12">
          <h2 className="text-2xl font-bold mb-2 text-center dark:text-white">Recharges Ponctuelles (Sans abonnement)</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Besoin de crédits sans vous engager ?</p>
          

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {creditPacks.map((pack, idx) => (
                  <div key={idx} className={`p-6 border-2 border-black dark:border-white rounded-md flex flex-col items-center hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors relative overflow-hidden ${pack.alert ? 'bg-gray-50 dark:bg-gray-500 shadow-neo-sm dark:shadow-[2px_2px_0px_0px_#fff]' : 'bg-white dark:bg-gray-600'}`}>
                      
                      {pack.alert && (
                        <div className="absolute top-3 right-3 text-neo-red">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                      )}


                      <span className="font-bold text-xl mb-1 dark:text-white">{pack.amount} Crédits</span>
                      <span className={`text-xs font-bold mb-3 ${pack.alert ? 'text-neo-red uppercase' : 'text-gray-500 dark:text-gray-400'}`}>
                          {pack.subtitle}
                      </span>
                      
                      <div className="flex items-center gap-2 mb-6">
                          <span className="font-display font-bold text-2xl text-black dark:text-white">
                              {getPrice(pack.basePrice)}€
                          </span>
                      </div>

                      {pack.alert && !isPro && (
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-4 text-center leading-tight">
                            Astuce : Prenez l'abonnement à 9.99€, c'est plus rentable !
                        </p>
                      )}

                      <button 
                        onClick={() => buyCredits(pack.amount)} 
                        className={`w-full py-2 border-2 font-bold rounded ${pack.alert ? 'bg-neo-black dark:bg-white text-white dark:text-black border-black dark:border-white hover:bg-gray-800 dark:hover:bg-gray-200' : 'bg-white dark:bg-black border-black dark:border-white text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900'}`}
                      >
                          Acheter
                      </button>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};
