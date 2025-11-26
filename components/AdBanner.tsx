import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { Link } from 'react-router-dom';
import { Zap, Coffee, Crown, Skull, Rocket, HeartOff, Ghost } from 'lucide-react';
import { SITE_CONFIG } from '../constants';

interface AdBannerProps {
    location: 'header' | 'footer' | 'sidebar' | 'home-middle' | 'home-bottom';
}

// --- LISTE DES PUBS MAISON DRÔLES ---
const FUN_ADS = [
    {
        id: 'coffee',
        color: 'bg-neo-yellow',
        icon: Coffee,
        title: "Moins cher qu'un café.",
        text: "Sérieux, 9.99€ pour 50 outils IA ? Certains vous vole, pas nous.",
        cta: "Arrêter de me ruiner en latte",
        borderColor: "border-black"
    },
    {
        id: 'slow',
        color: 'bg-neo-red',
        icon: Zap,
        title: "Vous aimez attendre ?",
        text: "Moi non plus. Les membres PRO passent en priorité. Les autres... bon courage.",
        cta: "Passer à la vitesse lumière",
        borderColor: "border-black"
    },
    {
        id: 'ugly',
        color: 'bg-white',
        icon: Ghost,
        title: "Cette bannière est moche.",
        text: "Le seul moyen de la faire disparaître, c'est de passer PRO. C'est du chantage ? Oui.",
        cta: "Supprimer cette horreur",
        borderColor: "border-black"
    },
    {
        id: 'developer',
        color: 'bg-neo-blue',
        icon: HeartOff,
        title: "Nourrissez le dév.",
        text: "Le développeur de ce site ne mange que des pâtes. Aidez-le à acheter de la sauce.",
        cta: "Offrir de la sauce bolo",
        borderColor: "border-black"
    },
    {
        id: 'elon',
        color: 'bg-black',
        textColor: 'text-white',
        icon: Rocket,
        title: "Devenez le Tony Stark du Web.",
        text: "Avec 100 crédits IA, vous allez coder plus vite que votre ombre. (Armure non incluse).",
        cta: "Activer mes super-pouvoirs",
        borderColor: "border-white"
    }
];

// Configuration AdSense (récupérée depuis constants.ts)
const ADSENSE_CLIENT_ID = SITE_CONFIG.adsense.clientId;
const ADSENSE_SLOT_ID = SITE_CONFIG.adsense.slotId;

export const AdBanner: React.FC<AdBannerProps> = ({ location }) => {
  const { isPro } = useUserStore();
  const [ad, setAd] = useState(FUN_ADS[0]);
  const [showAdSense, setShowAdSense] = useState(false);
  const [adSenseLoaded, setAdSenseLoaded] = useState(false);

  // Rotation aléatoire au montage
  useEffect(() => {
      const randomAd = FUN_ADS[Math.floor(Math.random() * FUN_ADS.length)];
      setAd(randomAd);
      
      // LOGIQUE DE BASCULE : 50% AdSense, 50% Pubs maison (si AdSense configuré)
      if (ADSENSE_CLIENT_ID && ADSENSE_SLOT_ID && Math.random() < 0.5) {
          setShowAdSense(true);
          
          // Le script AdSense est déjà chargé dans index.html, on attend juste qu'il soit prêt
          // Vérifier si le script est déjà chargé (depuis index.html)
          if ((window as any).adsbygoogle) {
              setAdSenseLoaded(true);
          } else {
              // Attendre que le script se charge (il est dans index.html)
              const checkInterval = setInterval(() => {
                  if ((window as any).adsbygoogle) {
                      setAdSenseLoaded(true);
                      clearInterval(checkInterval);
                  }
              }, 100);
              
              // Timeout après 5 secondes
              setTimeout(() => {
                  clearInterval(checkInterval);
                  if ((window as any).adsbygoogle) {
                      setAdSenseLoaded(true);
                  }
              }, 5000);
          }
      }
  }, []);

  // Initialiser AdSense après le rendu
  useEffect(() => {
      if (showAdSense && adSenseLoaded && ADSENSE_CLIENT_ID && ADSENSE_SLOT_ID) {
          // Petit délai pour s'assurer que l'élément est dans le DOM
          const timer = setTimeout(() => {
              const adElement = document.querySelector(`#adsense-${location} .adsbygoogle`);
              if (adElement && (window as any).adsbygoogle) {
                  try {
                      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
                  } catch (e) {
                      console.error('AdSense push error:', e);
                  }
              }
          }, 100);
          
          return () => clearTimeout(timer);
      }
  }, [showAdSense, adSenseLoaded, location]);

  // Si l'utilisateur est PRO, on n'affiche STRICTEMENT RIEN.
  if (isPro) return null;

  // --- RENDER ADSENSE (Si activé et configuré) ---
  if (showAdSense && ADSENSE_CLIENT_ID && ADSENSE_SLOT_ID) {
      return (
          <div className="w-full flex justify-center my-4 overflow-hidden min-h-[100px] bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-white rounded-lg">
              <div className="w-full" id={`adsense-${location}`}>
                  <ins 
                      className="adsbygoogle"
                      style={{display:'block'}}
                      data-ad-client={ADSENSE_CLIENT_ID}
                      data-ad-slot={ADSENSE_SLOT_ID}
                      data-ad-format="auto"
                      data-full-width-responsive="true"
                  ></ins>
              </div>
          </div>
      );
  }

  // --- RENDER FUN INTERNAL ADS ---
  
  // Style différent pour la Sidebar (Vertical)
  if (location === 'sidebar') {
      return (
        <div className={`rounded-lg my-6 p-5 border-2 ${ad.borderColor} ${ad.color} shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all group relative overflow-hidden`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
            
            <div className="relative z-10 flex flex-col items-start">
                <div className={`p-2 border-2 ${ad.borderColor} bg-white rounded-full mb-3 group-hover:rotate-12 transition-transform`}>
                    <ad.icon className="w-6 h-6 text-black" />
                </div>
                <p className={`font-display font-bold text-xl leading-tight mb-2 ${ad.textColor || 'text-black'}`}>
                    {ad.title}
                </p>
                <p className={`text-sm mb-4 font-medium leading-snug ${ad.textColor ? 'text-gray-300' : 'text-gray-700'}`}>
                    {ad.text}
                </p>
                <Link to="/pricing" className={`w-full py-2 px-3 text-center text-xs font-bold uppercase tracking-wider border-2 ${ad.borderColor} bg-white text-black rounded hover:bg-gray-100 transition-colors`}>
                    {ad.cta} &rarr;
                </Link>
            </div>
        </div>
      );
  }

  // Style pour les bannières horizontales (Header, Footer, Home)
  return (
    <div className={`w-full my-6 md:my-8 rounded-lg border-2 ${ad.borderColor} ${ad.color} shadow-[4px_4px_0px_0px_#000] dark:shadow-none relative overflow-hidden group`}>
        
        {/* Glitch Effect on Hover */}
        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-4 md:p-6 gap-4 text-center md:text-left">
            
            <div className="flex items-center gap-4">
                <div className={`hidden md:flex p-3 border-2 ${ad.borderColor} bg-white rounded-full shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <ad.icon className="w-6 h-6 text-black" />
                </div>
                <div>
                    <h3 className={`font-display font-bold text-lg md:text-xl ${ad.textColor || 'text-black'}`}>
                        {ad.title}
                    </h3>
                    <p className={`text-sm md:text-base font-medium max-w-xl ${ad.textColor ? 'text-gray-300' : 'text-gray-800'}`}>
                        {ad.text}
                    </p>
                </div>
            </div>

            <Link 
                to="/pricing"
                className={`whitespace-nowrap px-6 py-3 font-bold border-2 ${ad.borderColor} rounded bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all`}
            >
                {ad.cta}
            </Link>
        </div>
        
        {/* Petit label "Sponsorisé" pour la blague */}
        <div className="absolute top-2 right-2 text-[8px] uppercase font-bold opacity-30 tracking-widest">
            Publicité Honnête
        </div>
    </div>
  );
};
