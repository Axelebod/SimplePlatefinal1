
import React from 'react';
import { SITE_CONFIG } from '../constants';
import { Mail, MessageSquare, HelpCircle, Bug, Lightbulb, ArrowRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useSEO } from '../hooks/useSEO';

export const Contact: React.FC = () => {
  const { t, language } = useTranslation();

  useSEO({
    title: language === 'fr' ? 'Contact SimplePlate | Support, Bugs, Partenariats & Suggestions' : 'Contact SimplePlate | Support, Bugs, Partnerships & Suggestions',
    description:
      language === 'fr'
        ? 'Contactez SimplePlate AI pour toute question, signalement de bug, demande de partenariat ou suggestion d'outil. Réponse sous 24h. Support gratuit et réactif.'
        : 'Contact SimplePlate AI for any questions, bug reports, partnership requests or tool suggestions. Response within 24h. Free and responsive support.',
    language,
    keywords: language === 'fr' 
      ? ['contact SimplePlate', 'support SimplePlate', 'bug SimplePlate', 'partenariat', 'suggestion outil', 'aide SimplePlate']
      : ['contact SimplePlate', 'SimplePlate support', 'SimplePlate bug', 'partnership', 'tool suggestion', 'SimplePlate help'],
    jsonLdId: 'json-ld-contact',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: language === 'fr' ? 'Contact SimplePlate' : 'Contact SimplePlate',
      description: language === 'fr'
        ? 'Page de contact SimplePlate AI pour support, bugs, partenariats et suggestions'
        : 'SimplePlate AI contact page for support, bugs, partnerships and suggestions',
      mainEntity: {
        '@type': 'Organization',
        name: 'SimplePlate AI',
        email: SITE_CONFIG.contactEmail,
        url: window.location.origin,
      },
    },
  });
  
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      
      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
          {t('contact.title')}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t('contact.subtitle')}
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
                        <h3 className="font-bold text-lg mb-1">{t('contact.howToCancel')}</h3>
                        <p className="text-gray-600 text-sm">
                            {t('contact.cancelInfo')}
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
                        <h3 className="font-bold text-lg mb-1">{t('contact.bugTitle')}</h3>
                        <p className="text-gray-600 text-sm">
                            {t('contact.bugInfo')}
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
                        <h3 className="font-bold text-lg mb-1">{t('contact.partnershipTitle')}</h3>
                        <p className="text-gray-600 text-sm">
                            {t('contact.partnershipInfo')}
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
                      <h3 className="font-bold text-lg">{t('contact.toolIdea')}</h3>
                      <p className="text-sm text-gray-600 max-w-md">
                          {t('contact.toolIdeaDesc')}
                      </p>
                  </div>
              </div>
              <a 
                href={`mailto:${SITE_CONFIG.contactEmail}?subject=Suggestion d'outil&body=Nom de l'outil :%0D%0ACatégorie :%0D%0ADescription :`}
                className="whitespace-nowrap px-6 py-3 bg-white text-black font-bold border-2 border-black rounded-md hover:shadow-neo-sm transition-all flex items-center gap-2"
              >
                  {t('contact.suggestTool')} <ArrowRight className="w-4 h-4" />
              </a>
          </div>
      </div>

    </div>
  );
};
