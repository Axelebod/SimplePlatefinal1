
import React from 'react';
import { SITE_CONFIG } from '../constants';
import { Mail, MessageSquare, HelpCircle, Bug, Lightbulb, ArrowRight } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      
      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
          On discute ?
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Une suggestion, un bug ou une idée de génie ? <br/>
          Notre équipe (et notre robot) est à l'écoute.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-12">
        
        {/* CARD CONTACT PRINCIPALE */}
        <div className="bg-neo-yellow border-2 border-black rounded-lg p-8 shadow-[8px_8px_0px_0px_#000] flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white border-2 border-black rounded-full flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-black" />
            </div>
            <h2 className="font-display font-bold text-2xl mb-2">Par Email</h2>
            <p className="text-gray-800 mb-6">
                Le moyen le plus rapide de nous joindre. Réponse sous 24h (sauf si on dort).
            </p>
            
            <a 
                href={`mailto:${SITE_CONFIG.contactEmail}`}
                className="w-full py-4 bg-black text-white font-bold text-lg rounded-md hover:bg-gray-800 transition-colors break-all"
            >
                {SITE_CONFIG.contactEmail}
            </a>
            <p className="text-xs mt-4 opacity-60">Cliquez pour ouvrir votre boîte mail</p>
        </div>

        {/* FAQ RAPIDE */}
        <div className="space-y-6">
            <div className="bg-white border-2 border-black rounded-lg p-6 shadow-neo">
                <div className="flex items-start gap-4">
                    <div className="bg-neo-blue/20 p-2 rounded border border-black shrink-0">
                        <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-1">Comment résilier ?</h3>
                        <p className="text-gray-600 text-sm">
                            Pas besoin de nous écrire ! Si vous avez pris un abonnement, vous pouvez l'annuler à tout moment depuis votre lien Stripe reçu par email.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white border-2 border-black rounded-lg p-6 shadow-neo">
                <div className="flex items-start gap-4">
                    <div className="bg-neo-red/20 p-2 rounded border border-black shrink-0">
                        <Bug className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-1">Un bug sur un outil ?</h3>
                        <p className="text-gray-600 text-sm">
                            Si un outil charge à l'infini, essayez de désactiver votre bloqueur de pub ou de rafraîchir la page. Si ça persiste, écrivez-nous !
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white border-2 border-black rounded-lg p-6 shadow-neo">
                <div className="flex items-start gap-4">
                    <div className="bg-neo-green/20 p-2 rounded border border-black shrink-0">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-1">Partenariats ?</h3>
                        <p className="text-gray-600 text-sm">
                            Vous voulez sponsoriser SimplePlate ou proposer un outil ? Envoyez un mail avec [PARTENARIAT] dans le sujet.
                        </p>
                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* SECTION SUGGESTION DISCRETE */}
      <div className="border-t-2 border-black pt-8 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50 p-6 rounded-lg border-2 border-black border-dashed">
              <div className="flex items-start gap-4">
                  <div className="p-3 bg-white border-2 border-black rounded-full">
                      <Lightbulb className="w-6 h-6 text-neo-orange" />
                  </div>
                  <div>
                      <h3 className="font-bold text-lg">Vous avez une idée d'outil ?</h3>
                      <p className="text-sm text-gray-600 max-w-md">
                          Si vous ne trouvez pas ce que vous cherchez, dites-le nous. On ajoute des nouveaux outils chaque semaine basés sur vos retours.
                      </p>
                  </div>
              </div>
              <a 
                href={`mailto:${SITE_CONFIG.contactEmail}?subject=Suggestion d'outil&body=Nom de l'outil :%0D%0ACatégorie :%0D%0ADescription :`}
                className="whitespace-nowrap px-6 py-3 bg-white text-black font-bold border-2 border-black rounded-md hover:shadow-neo-sm transition-all flex items-center gap-2"
              >
                  Suggérer un outil <ArrowRight className="w-4 h-4" />
              </a>
          </div>
      </div>

    </div>
  );
};
