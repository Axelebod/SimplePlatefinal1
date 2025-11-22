
import React from 'react';

export const Legal: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white border-2 border-black p-8 rounded-lg shadow-neo my-8">
      <h1 className="font-display text-3xl font-bold mb-8">Mentions Légales & CGU</h1>

      <div className="prose max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-bold border-b-2 border-black pb-2 mb-4">1. Éditeur du site</h2>
          <p>
            Le site <strong>SimplePlate.ai</strong> est édité par [simpleplate] .<br/>
            <strong>Siège social :</strong> 239 chemin du carry, cogolin.<br/>
            <strong>SIRET :</strong> 123 456 789 00012<br/>
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
            <li><strong>Crédits :</strong> Les utilisateurs gratuits disposent de 5 crédits par mois. Les utilisateurs PRO disposent de 100 crédits par mois.</li>
            <li><strong>Usage :</strong> Vous vous engagez à ne pas utiliser nos outils pour générer du contenu illégal, haineux ou diffamatoire.</li>
            <li><strong>Responsabilité :</strong> SimplePlate n'est pas responsable des contenus générés par l'IA. Vérifiez toujours les informations.</li>
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
        </section>
      </div>
    </div>
  );
};
