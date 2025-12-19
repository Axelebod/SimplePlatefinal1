
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useSEO } from '../hooks/useSEO';

export const Legal: React.FC = () => {
  const { language } = useTranslation();

  useSEO({
    title: language === 'fr' ? 'Mentions légales & CGU | SimplePlate AI' : 'Legal notice & Terms | SimplePlate AI',
    description:
      language === 'fr'
        ? 'Mentions légales, conditions d’utilisation et informations RGPD de SimplePlate AI.'
        : 'Legal notice, terms of use, and GDPR information for SimplePlate AI.',
    language,
    keywords: language === 'fr' ? ['mentions légales', 'cgu', 'rgpd'] : ['legal', 'terms', 'gdpr'],
  });

  return (
    <div className="max-w-4xl mx-auto bg-white border-2 border-black p-8 rounded-lg shadow-neo my-8">
      <h1 className="font-display text-3xl font-bold mb-8">Mentions Légales & CGU</h1>

      <div className="prose max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-bold border-b-2 border-black pb-2 mb-4">1. Éditeur du site</h2>
          <p>
            Le site <strong>SimplePlate.ai</strong> est édité par [simpleplate] .<br/>
            <strong>Siège social :</strong> Cogolin<br/>
            <strong>SIRET :</strong> 00000000<br/>
            <strong>Contact :</strong> contact@simpleplate.dev
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold border-b-2 border-black pb-2 mb-4">2. Hébergement</h2>
          <p>
            Ce site est hébergé par Vercel Inc.<br/>
            440 N Barranca Ave #4133, Covina, CA 91723, USA.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold border-b-2 border-black pb-2 mb-4">3. Conditions Générales d'Utilisation (CGU)</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Accès :</strong> L'accès au site nécessite une inscription. Les fonctionnalités utilisent un système de crédits.</li>
            <li><strong>Crédits :</strong> Les utilisateurs gratuits disposent de 5 crédits gratuits par semaine (non cumulables). Les utilisateurs PRO disposent de 100 crédits payants par mois qui s'accumulent.</li>
            <li><strong>SimplePlate Studio :</strong> La plateforme communautaire SimplePlate Studio permet de soumettre des projets Micro-SaaS, obtenir des audits IA (50 crédits) et recevoir des retours. Les utilisateurs peuvent gagner 0.5 crédit par avis valide (>100 caractères), avec un maximum de 3 crédits par jour (6 avis).</li>
            <li><strong>Usage :</strong> Vous vous engagez à ne pas utiliser nos outils pour générer du contenu illégal, haineux ou diffamatoire.</li>
            <li><strong>Contenu utilisateur :</strong> Les projets soumis sur SimplePlate Studio (logos, screenshots, descriptions, liens) sont publics et peuvent être partagés. Vous garantissez avoir les droits sur tout contenu soumis.</li>
            <li><strong>Responsabilité :</strong> SimplePlate n'est pas responsable des contenus générés par l'IA ou des projets soumis par les utilisateurs. Vérifiez toujours les informations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold border-b-2 border-black pb-2 mb-4">4. Données Personnelles (RGPD)</h2>
          <p>
            Nous respectons votre vie privée. Les données entrées dans les outils ne sont pas stockées de manière permanente sur nos serveurs, elles transitent uniquement vers les API d'IA (Google Gemini) pour traitement puis sont supprimées.
          </p>
          <p className="mt-2">
            Vous disposez d'un droit d'accès, de modification et de suppression de vos données de compte.
          </p>
          <p className="mt-4">
            Pour plus d'informations, consultez notre <Link to="/privacy" className="text-neo-violet font-bold underline">Politique de Confidentialité (RGPD)</Link>.
          </p>
        </section>
      </div>
    </div>
  );
};
