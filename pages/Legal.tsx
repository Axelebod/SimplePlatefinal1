import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Legal: React.FC = () => {
  useEffect(() => {
    document.title = "Mentions Légales & CGU | SimplePlate AI";
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-neo-white dark:bg-gray-600 border-2 border-black dark:border-white p-8 rounded-lg shadow-neo dark:shadow-[2px_2px_0px_0px_#fff] my-8">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-8 dark:text-white">Mentions Légales & Conditions Générales d'Utilisation</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Dernière mise à jour : 25 novembre 2025</p>

      <div className="prose max-w-none space-y-10 dark:prose-invert">
        {/* ÉDITEUR */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black dark:border-gray-500 pb-2 mb-4 dark:text-white">1. Éditeur du site</h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>
              Le site <strong>SimplePlate.dev</strong> (ci-après "le Site") est édité et exploité par SimplePlate.
            </p>
            <p>
              <strong>Siège social :</strong> Cogolin, France<br/>
              <strong>Email :</strong> contact@simpleplate.dev<br/>
              <strong>Directeur de publication :</strong> SimplePlate
            </p>
          </div>
        </section>

        {/* HÉBERGEMENT */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black dark:border-gray-500 pb-2 mb-4 dark:text-white">2. Hébergement</h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>
              Ce site est hébergé par <strong>Vercel Inc.</strong><br/>
              440 N Barranca Ave #4133, Covina, CA 91723, États-Unis<br/>
              Site web : <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 underline">vercel.com</a>
            </p>
          </div>
        </section>

        {/* ACCEPTATION DES CGU */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black dark:border-gray-500 pb-2 mb-4 dark:text-white">3. Acceptation des Conditions Générales d'Utilisation</h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              L'accès et l'utilisation du Site impliquent l'acceptation pleine et entière des présentes Conditions Générales d'Utilisation (ci-après "CGU"). 
              Si vous n'acceptez pas ces conditions, nous vous invitons à ne pas utiliser le Site.
            </p>
            <p>
              SimplePlate se réserve le droit de modifier les présentes CGU à tout moment. Les modifications prennent effet dès leur publication sur le Site. 
              Il est de votre responsabilité de consulter régulièrement les CGU pour prendre connaissance des éventuelles modifications.
            </p>
          </div>
        </section>

        {/* ACCÈS AU SITE */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black dark:border-gray-500 pb-2 mb-4 dark:text-white">4. Accès au Site et Inscription</h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              <strong>4.1 Accès gratuit :</strong> L'accès au Site est gratuit. Cependant, certaines fonctionnalités nécessitent la création d'un compte utilisateur.
            </p>
            <p>
              <strong>4.2 Inscription :</strong> Pour utiliser les outils nécessitant des crédits, vous devez créer un compte en fournissant une adresse email valide et un mot de passe sécurisé. 
              Vous vous engagez à fournir des informations exactes, complètes et à jour.
            </p>
            <p>
              <strong>4.3 Compte personnel :</strong> Votre compte est strictement personnel et confidentiel. Vous êtes responsable de la confidentialité de vos identifiants et de toutes les activités 
              effectuées sous votre compte. En cas d'utilisation non autorisée de votre compte, vous devez immédiatement nous en informer.
            </p>
            <p>
              <strong>4.4 Âge minimum :</strong> L'utilisation du Site est réservée aux personnes âgées d'au moins 13 ans. Les mineurs de moins de 18 ans doivent obtenir l'autorisation 
              de leurs parents ou tuteurs légaux avant d'utiliser le Site.
            </p>
          </div>
        </section>

        {/* SYSTÈME DE CRÉDITS */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black dark:border-gray-500 pb-2 mb-4 dark:text-white">5. Système de Crédits</h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              <strong>5.1 Crédits gratuits :</strong> Les nouveaux utilisateurs reçoivent <strong>5 crédits gratuits par semaine</strong>. 
              Ces crédits sont non-cumulatifs : si vous n'utilisez pas vos 5 crédits dans la semaine, ils sont réinitialisés le lundi suivant. 
              Les crédits gratuits ne s'accumulent pas d'une semaine à l'autre.
            </p>
            <p>
              <strong>5.2 Crédits payants :</strong> Vous pouvez acheter des packs de crédits supplémentaires via notre système de paiement Stripe. 
              Les crédits payants sont <strong>permanents et cumulatifs</strong> : ils ne s'expirent jamais et s'ajoutent à votre solde existant.
            </p>
            <p>
              <strong>5.3 Abonnement PRO :</strong> L'abonnement PRO coûte 9,99€/mois et vous donne accès à :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>100 crédits par mois (crédits mensuels, réinitialisés chaque mois)</li>
              <li>Accès à tous les outils premium</li>
              <li>Priorité sur les nouvelles fonctionnalités</li>
            </ul>
            <p>
              <strong>5.4 Utilisation des crédits :</strong> Chaque utilisation d'un outil consomme un certain nombre de crédits selon la complexité de l'outil. 
              Les outils gratuits (0 crédit) ne consomment aucun crédit. Les crédits sont débités uniquement après la génération réussie du résultat.
            </p>
            <p>
              <strong>5.5 Non-remboursable :</strong> Les crédits achetés et les abonnements ne sont pas remboursables, sauf cas exceptionnel à notre discrétion.
            </p>
          </div>
        </section>

        {/* UTILISATION DES OUTILS */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black dark:border-gray-500 pb-2 mb-4 dark:text-white">6. Utilisation des Outils</h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              <strong>6.1 Usage autorisé :</strong> Les outils proposés sur SimplePlate sont destinés à un usage personnel et professionnel légitime. 
              Vous vous engagez à utiliser les outils conformément à leur destination et dans le respect des lois en vigueur.
            </p>
            <p>
              <strong>6.2 Usage interdit :</strong> Il est strictement interdit d'utiliser nos outils pour :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Générer du contenu illégal, diffamatoire, haineux, discriminatoire ou violant les droits d'autrui</li>
              <li>Créer du contenu à caractère pornographique, violent ou inapproprié</li>
              <li>Usurper l'identité d'une personne ou d'une entreprise</li>
              <li>Violer des droits de propriété intellectuelle (copyright, marques déposées, etc.)</li>
              <li>Spammer, harceler ou nuire à des tiers</li>
              <li>Contourner des mesures de sécurité ou accéder à des systèmes non autorisés</li>
            </ul>
            <p>
              <strong>6.3 Résultats générés :</strong> Les résultats générés par nos outils sont fournis "en l'état". SimplePlate ne garantit pas l'exactitude, 
              la complétude ou la pertinence des résultats. Vous êtes seul responsable de l'utilisation que vous faites des résultats générés.
            </p>
            <p>
              <strong>6.4 Vérification :</strong> Il est de votre responsabilité de vérifier et valider les résultats générés avant toute utilisation, 
              notamment pour les contenus juridiques, financiers ou médicaux.
            </p>
          </div>
        </section>

        {/* PROPRIÉTÉ INTELLECTUELLE */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black dark:border-gray-500 pb-2 mb-4 dark:text-white">7. Propriété Intellectuelle</h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              <strong>7.1 Contenu du Site :</strong> L'ensemble du contenu du Site (textes, images, logos, design, code source) est la propriété exclusive de SimplePlate 
              ou de ses partenaires et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.
            </p>
            <p>
              <strong>7.2 Résultats générés :</strong> Les résultats générés par nos outils vous appartiennent. Vous êtes libre de les utiliser, modifier, 
              distribuer et commercialiser selon vos besoins, y compris à des fins commerciales. Cependant, vous ne pouvez pas revendre ou redistribuer 
              l'accès aux outils eux-mêmes.
            </p>
            <p>
              <strong>7.3 Marques :</strong> Les marques, logos et signes distinctifs présents sur le Site sont la propriété de SimplePlate ou de leurs propriétaires respectifs. 
              Toute reproduction non autorisée est interdite.
            </p>
          </div>
        </section>

        {/* DONNÉES PERSONNELLES */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black dark:border-gray-500 pb-2 mb-4 dark:text-white">8. Protection des Données Personnelles (RGPD)</h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              <strong>8.1 Collecte des données :</strong> Nous collectons les données suivantes :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Données de compte :</strong> Email, mot de passe (hashé), nom d'utilisateur</li>
              <li><strong>Données d'utilisation :</strong> Historique d'utilisation des outils, crédits consommés</li>
              <li><strong>Données de paiement :</strong> Gérées par Stripe (conformément à leur politique de confidentialité)</li>
              <li><strong>Données techniques :</strong> Adresse IP, type de navigateur, pages visitées (via Google Analytics)</li>
            </ul>
            <p>
              <strong>8.2 Traitement des données :</strong> Les données que vous entrez dans les outils (textes, images) sont transmises aux API d'IA (Google Gemini) 
              pour traitement, puis <strong>supprimées immédiatement après génération</strong>. Elles ne sont jamais stockées de manière permanente sur nos serveurs.
            </p>
            <p>
              <strong>8.3 Finalités :</strong> Vos données sont utilisées pour :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Fournir et améliorer nos services</li>
              <li>Gérer votre compte et vos crédits</li>
              <li>Traiter vos paiements</li>
              <li>Analyser l'utilisation du Site (Google Analytics)</li>
              <li>Vous contacter si nécessaire</li>
            </ul>
            <p>
              <strong>8.4 Conservation :</strong> Vos données de compte sont conservées tant que votre compte est actif. 
              Vous pouvez demander la suppression de votre compte à tout moment via l'email contact@simpleplate.dev.
            </p>
            <p>
              <strong>8.5 Vos droits :</strong> Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Droit d'accès :</strong> Vous pouvez demander une copie de vos données personnelles</li>
              <li><strong>Droit de rectification :</strong> Vous pouvez corriger vos données inexactes</li>
              <li><strong>Droit à l'effacement :</strong> Vous pouvez demander la suppression de vos données</li>
              <li><strong>Droit à la portabilité :</strong> Vous pouvez récupérer vos données dans un format structuré</li>
              <li><strong>Droit d'opposition :</strong> Vous pouvez vous opposer au traitement de vos données</li>
            </ul>
            <p>
              Pour exercer ces droits, contactez-nous à : <strong>contact@simpleplate.dev</strong>
            </p>
            <p>
              <strong>8.6 Cookies :</strong> Le Site utilise des cookies techniques nécessaires au fonctionnement et des cookies analytiques (Google Analytics). 
              Vous pouvez désactiver les cookies via les paramètres de votre navigateur, mais cela peut affecter certaines fonctionnalités.
            </p>
          </div>
        </section>

        {/* RESPONSABILITÉ */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black dark:border-gray-500 pb-2 mb-4 dark:text-white">9. Responsabilité et Garanties</h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              <strong>9.1 Disponibilité :</strong> SimplePlate s'efforce d'assurer une disponibilité du Site 24/7, mais ne peut garantir un fonctionnement ininterrompu. 
              Le Site peut être temporairement indisponible pour maintenance, mises à jour ou cas de force majeure.
            </p>
            <p>
              <strong>9.2 Résultats :</strong> SimplePlate ne garantit pas l'exactitude, la fiabilité ou la pertinence des résultats générés par les outils. 
              Les résultats sont fournis "en l'état" et vous êtes seul responsable de leur utilisation.
            </p>
            <p>
              <strong>9.3 Limitation de responsabilité :</strong> SimplePlate ne pourra être tenu responsable :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Des dommages directs ou indirects résultant de l'utilisation ou de l'impossibilité d'utiliser le Site</li>
              <li>Des pertes de données, de profits ou d'opportunités commerciales</li>
              <li>De l'utilisation inappropriée des résultats générés par les outils</li>
              <li>Des interruptions de service ou dysfonctionnements techniques</li>
            </ul>
            <p>
              <strong>9.4 Force majeure :</strong> SimplePlate ne pourra être tenu responsable en cas de force majeure ou d'événements indépendants de sa volonté 
              (pannes techniques, grèves, catastrophes naturelles, etc.).
            </p>
          </div>
        </section>

        {/* PAIEMENTS */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black dark:border-gray-500 pb-2 mb-4 dark:text-white">10. Paiements et Abonnements</h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              <strong>10.1 Paiements :</strong> Les paiements sont sécurisés et traités par <strong>Stripe</strong>, notre prestataire de paiement. 
              Nous ne stockons jamais vos informations de carte bancaire. Toutes les transactions sont cryptées et sécurisées.
            </p>
            <p>
              <strong>10.2 Abonnement PRO :</strong> L'abonnement PRO est un abonnement mensuel renouvelable automatiquement. 
              Vous pouvez annuler votre abonnement à tout moment depuis votre compte ou en nous contactant. 
              L'annulation prend effet à la fin de la période de facturation en cours.
            </p>
            <p>
              <strong>10.3 Remboursements :</strong> Les crédits achetés et les abonnements ne sont généralement pas remboursables. 
              En cas de problème technique de notre côté empêchant l'utilisation du service, nous étudierons les demandes de remboursement au cas par cas.
            </p>
            <p>
              <strong>10.4 Facturation :</strong> Les factures sont disponibles dans votre espace compte et peuvent être téléchargées au format PDF.
            </p>
          </div>
        </section>

        {/* RÉSILIATION */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black dark:border-gray-500 pb-2 mb-4 dark:text-white">11. Résiliation</h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              <strong>11.1 Par l'utilisateur :</strong> Vous pouvez supprimer votre compte à tout moment en nous contactant à contact@simpleplate.dev. 
              La suppression de votre compte entraîne la perte de tous vos crédits non utilisés (sauf crédits payants qui peuvent être transférés selon conditions).
            </p>
            <p>
              <strong>11.2 Par SimplePlate :</strong> Nous nous réservons le droit de suspendre ou supprimer votre compte en cas de :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Violation des présentes CGU</li>
              <li>Utilisation frauduleuse ou abusive du Site</li>
              <li>Comportement nuisible à la communauté ou à notre réputation</li>
              <li>Inactivité prolongée (plus de 2 ans sans connexion)</li>
            </ul>
          </div>
        </section>

        {/* MODIFICATIONS */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black dark:border-gray-500 pb-2 mb-4 dark:text-white">12. Modifications du Service</h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              SimplePlate se réserve le droit de modifier, suspendre ou interrompre tout ou partie du Site à tout moment, 
              avec ou sans préavis. Nous nous efforçons d'informer les utilisateurs des modifications importantes via email ou notification sur le Site.
            </p>
          </div>
        </section>

        {/* LOI APPLICABLE */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black dark:border-gray-500 pb-2 mb-4 dark:text-white">13. Droit Applicable et Juridiction</h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              Les présentes CGU sont régies par le droit français. En cas de litige, et à défaut d'accord amiable, 
              le litige sera porté devant les tribunaux compétents de France.
            </p>
          </div>
        </section>

        {/* CONTACT */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black dark:border-gray-500 pb-2 mb-4 dark:text-white">14. Contact</h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              Pour toute question concernant les présentes CGU ou le Site, vous pouvez nous contacter :
            </p>
            <p>
              <strong>Email :</strong> <a href="mailto:contact@simpleplate.dev" className="text-blue-600 dark:text-blue-400 underline">contact@simpleplate.dev</a><br/>
              <strong>Page de contact :</strong> <Link to="/contact" className="text-blue-600 dark:text-blue-400 underline">/contact</Link><br/>
              <strong>Politique de confidentialité :</strong> <Link to="/privacy" className="text-blue-600 dark:text-blue-400 underline">/privacy</Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
