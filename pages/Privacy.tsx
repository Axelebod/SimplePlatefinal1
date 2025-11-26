import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, FileText, Mail, Database, Cookie, UserCheck } from 'lucide-react';

export const Privacy: React.FC = () => {
  useEffect(() => {
    document.title = "Politique de Confidentialité (RGPD) | SimplePlate AI";
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 p-8 rounded-lg shadow-neo dark:shadow-none my-8">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-neo-violet dark:text-neo-blue" />
        <h1 className="font-display text-3xl md:text-4xl font-bold dark:text-white">
          Politique de Confidentialité
        </h1>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Conforme au Règlement Général sur la Protection des Données (RGPD) - UE 2016/679<br/>
        Dernière mise à jour : 25 novembre 2025
      </p>

      <div className="prose max-w-none space-y-10 dark:prose-invert">
        {/* INTRODUCTION */}
        <section className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6" />
            1. Introduction
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              SimplePlate (ci-après "nous", "notre", "le Site") s'engage à protéger votre vie privée et vos données personnelles. 
              Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos données personnelles 
              conformément au Règlement Général sur la Protection des Données (RGPD) de l'Union Européenne.
            </p>
            <p>
              En utilisant SimplePlate.dev, vous acceptez les pratiques décrites dans cette politique. 
              Si vous n'acceptez pas ces pratiques, veuillez ne pas utiliser notre service.
            </p>
          </div>
        </section>

        {/* RESPONSABLE DU TRAITEMENT */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black dark:border-gray-500 pb-2 mb-4 dark:text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6" />
            2. Responsable du Traitement des Données
          </h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>
              <strong>Responsable :</strong> SimplePlate<br/>
              <strong>Siège social :</strong> Cogolin, France<br/>
              <strong>Email :</strong> <a href="mailto:contact@simpleplate.dev" className="text-blue-600 dark:text-blue-400 underline">contact@simpleplate.dev</a>
            </p>
            <p>
              Pour toute question concernant le traitement de vos données personnelles, vous pouvez nous contacter à l'adresse ci-dessus.
            </p>
          </div>
        </section>

        {/* DONNÉES COLLECTÉES */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black dark:border-gray-500 pb-2 mb-4 dark:text-white flex items-center gap-2">
            <Database className="w-6 h-6" />
            3. Données Personnelles Collectées
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-bold text-lg mb-2 dark:text-white">3.1 Données de Compte</h3>
              <p>Lors de votre inscription, nous collectons :</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li><strong>Adresse email :</strong> Utilisée pour l'authentification et la communication</li>
                <li><strong>Mot de passe :</strong> Hashé avec bcrypt, jamais stocké en clair</li>
                <li><strong>Date de création du compte :</strong> Pour la gestion de votre compte</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 dark:text-white">3.2 Données d'Utilisation</h3>
              <p>Nous enregistrons automatiquement :</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li><strong>Historique d'utilisation :</strong> Quels outils vous utilisez et quand</li>
                <li><strong>Crédits consommés :</strong> Pour gérer votre solde de crédits</li>
                <li><strong>Statut PRO :</strong> Pour activer/désactiver les fonctionnalités premium</li>
                <li><strong>Date de dernière connexion :</strong> Pour la sécurité de votre compte</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 dark:text-white">3.3 Données de Paiement</h3>
              <p>
                Les paiements sont traités par <strong>Stripe</strong>, notre prestataire de paiement certifié PCI-DSS. 
                Nous ne stockons <strong>jamais</strong> vos informations de carte bancaire. Stripe collecte :
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Numéro de carte bancaire (crypté par Stripe)</li>
                <li>Date d'expiration</li>
                <li>Code CVV (jamais stocké)</li>
                <li>Adresse de facturation (si fournie)</li>
              </ul>
              <p className="mt-2 text-sm italic">
                Consultez la <a href="https://stripe.com/fr/privacy" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 underline">politique de confidentialité de Stripe</a> pour plus d'informations.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 dark:text-white">3.4 Données Techniques</h3>
              <p>Lors de votre visite, nous collectons automatiquement :</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li><strong>Adresse IP :</strong> Pour la sécurité et la prévention de la fraude</li>
                <li><strong>Type de navigateur et version :</strong> Pour optimiser l'expérience utilisateur</li>
                <li><strong>Système d'exploitation :</strong> Pour le support technique</li>
                <li><strong>Pages visitées :</strong> Via Google Analytics (anonymisé)</li>
                <li><strong>Durée de session :</strong> Pour améliorer nos services</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 dark:text-white">3.5 Données des Outils IA</h3>
              <p className="font-bold text-red-600 dark:text-red-400">
                ⚠️ IMPORTANT : Vos données d'entrée (textes, images) dans les outils IA
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Sont <strong>transmises</strong> aux API d'IA (Google Gemini) pour traitement</li>
                <li>Sont <strong>supprimées immédiatement</strong> après génération du résultat</li>
                <li><strong>Ne sont jamais stockées</strong> de manière permanente sur nos serveurs</li>
                <li>Ne sont <strong>jamais partagées</strong> avec des tiers (sauf Google Gemini pour le traitement)</li>
              </ul>
              <p className="mt-2">
                Les outils locaux (QR Code, calculatrices) fonctionnent <strong>100% dans votre navigateur</strong> 
                et vos données ne quittent jamais votre appareil.
              </p>
            </div>
          </div>
        </section>

        {/* FINALITÉS */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black dark:border-gray-500 pb-2 mb-4 dark:text-white flex items-center gap-2">
            <Eye className="w-6 h-6" />
            4. Finalités du Traitement
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>Nous utilisons vos données personnelles pour :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Fournir nos services :</strong> Authentification, gestion de compte, utilisation des outils IA
              </li>
              <li>
                <strong>Gérer vos crédits :</strong> Suivi de votre solde, débit lors de l'utilisation des outils
              </li>
              <li>
                <strong>Traiter les paiements :</strong> Facturation, gestion des abonnements PRO
              </li>
              <li>
                <strong>Améliorer nos services :</strong> Analyse d'utilisation (Google Analytics anonymisé), correction de bugs
              </li>
              <li>
                <strong>Communication :</strong> Répondre à vos demandes, envoyer des notifications importantes (changement de CGU, etc.)
              </li>
              <li>
                <strong>Sécurité :</strong> Prévention de la fraude, détection d'activités suspectes
              </li>
              <li>
                <strong>Obligations légales :</strong> Conservation des factures, conformité fiscale
              </li>
            </ul>
            <p className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded">
              <strong>Base légale :</strong> Le traitement de vos données repose sur votre consentement (inscription), 
              l'exécution d'un contrat (utilisation des services) et nos intérêts légitimes (amélioration des services, sécurité).
            </p>
          </div>
        </section>

        {/* CONSERVATION */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black dark:border-gray-500 pb-2 mb-4 dark:text-white flex items-center gap-2">
            <Lock className="w-6 h-6" />
            5. Durée de Conservation des Données
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Données de compte :</strong> Conservées tant que votre compte est actif. 
                Supprimées dans les <strong>30 jours</strong> après suppression de votre compte.
              </li>
              <li>
                <strong>Données d'utilisation :</strong> Conservées pendant <strong>2 ans</strong> maximum pour analyse statistique anonymisée.
              </li>
              <li>
                <strong>Données de paiement :</strong> Factures conservées pendant <strong>10 ans</strong> (obligation légale française).
              </li>
              <li>
                <strong>Données techniques (logs) :</strong> Conservées pendant <strong>90 jours</strong> maximum pour la sécurité.
              </li>
              <li>
                <strong>Données des outils IA :</strong> <strong>Supprimées immédiatement</strong> après génération du résultat.
              </li>
            </ul>
            <p className="mt-4">
              Vous pouvez demander la suppression anticipée de vos données à tout moment (voir section "Vos Droits").
            </p>
          </div>
        </section>

        {/* PARTAGE DES DONNÉES */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black dark:border-gray-500 pb-2 mb-4 dark:text-white">
            6. Partage et Transfert des Données
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-bold text-lg mb-2 dark:text-white">6.1 Prestataires de Services</h3>
              <p>Nous partageons vos données avec les prestataires suivants :</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  <strong>Supabase (Hébergement BDD) :</strong> Stockage sécurisé de vos données de compte (UE/USA, conforme RGPD)
                </li>
                <li>
                  <strong>Stripe (Paiements) :</strong> Traitement sécurisé des paiements (certifié PCI-DSS)
                </li>
                <li>
                  <strong>Google Gemini (IA) :</strong> Traitement des données d'entrée pour générer les résultats (USA, conforme RGPD via clauses contractuelles)
                </li>
                <li>
                  <strong>Google Analytics :</strong> Analyse d'audience anonymisée (données agrégées uniquement)
                </li>
                <li>
                  <strong>Vercel (Hébergement) :</strong> Hébergement du site web (logs techniques uniquement)
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 dark:text-white">6.2 Transferts Hors UE</h3>
              <p>
                Certains de nos prestataires (Google, Stripe) sont basés aux États-Unis. Ces transferts sont sécurisés via :
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Clauses contractuelles types approuvées par la Commission Européenne</li>
                <li>Certifications de conformité (Privacy Shield, etc.)</li>
                <li>Garanties de sécurité appropriées</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 dark:text-white">6.3 Pas de Vente de Données</h3>
              <p className="font-bold text-green-600 dark:text-green-400">
                ✅ Nous ne vendons JAMAIS vos données personnelles à des tiers.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 dark:text-white">6.4 Obligations Légales</h3>
              <p>
                Nous pouvons divulguer vos données si la loi l'exige (mandat judiciaire, obligation fiscale, etc.).
              </p>
            </div>
          </div>
        </section>

        {/* SÉCURITÉ */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black dark:border-gray-500 pb-2 mb-4 dark:text-white">
            7. Sécurité des Données
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Chiffrement HTTPS :</strong> Toutes les communications sont cryptées (SSL/TLS)</li>
              <li><strong>Mots de passe hashés :</strong> Utilisation de bcrypt avec salt</li>
              <li><strong>Authentification sécurisée :</strong> Via Supabase Auth (OAuth, 2FA possible)</li>
              <li><strong>Base de données sécurisée :</strong> Hébergée sur Supabase avec sauvegardes automatiques</li>
              <li><strong>Accès restreint :</strong> Seuls les administrateurs autorisés ont accès aux données</li>
              <li><strong>Surveillance :</strong> Monitoring des accès et détection d'anomalies</li>
            </ul>
            <p className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 rounded">
              <strong>⚠️ Avertissement :</strong> Aucun système n'est 100% sécurisé. 
              Nous vous recommandons d'utiliser un mot de passe fort et unique, et de ne jamais partager vos identifiants.
            </p>
          </div>
        </section>

        {/* VOS DROITS */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black dark:border-gray-500 pb-2 mb-4 dark:text-white">
            8. Vos Droits RGPD
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-bold text-lg mb-3 dark:text-white">8.1 Droit d'Accès</h3>
              <p>
                Vous pouvez demander une copie de toutes les données personnelles que nous détenons sur vous. 
                <strong> Comment :</strong> Envoyez un email à <a href="mailto:contact@simpleplate.dev" className="text-blue-600 dark:text-blue-400 underline">contact@simpleplate.dev</a> 
                avec le sujet "Demande d'accès RGPD".
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-bold text-lg mb-3 dark:text-white">8.2 Droit de Rectification</h3>
              <p>
                Vous pouvez corriger vos données inexactes ou incomplètes directement depuis votre compte ou en nous contactant.
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <h3 className="font-bold text-lg mb-3 dark:text-white">8.3 Droit à l'Effacement ("Droit à l'Oubli")</h3>
              <p>
                Vous pouvez demander la suppression de vos données personnelles. Nous supprimerons vos données dans les <strong>30 jours</strong>, 
                sauf si nous avons une obligation légale de les conserver (factures, etc.).
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h3 className="font-bold text-lg mb-3 dark:text-white">8.4 Droit à la Portabilité</h3>
              <p>
                Vous pouvez récupérer vos données dans un format structuré et couramment utilisé (JSON, CSV) pour les transférer à un autre service.
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="font-bold text-lg mb-3 dark:text-white">8.5 Droit d'Opposition</h3>
              <p>
                Vous pouvez vous opposer au traitement de vos données pour des raisons légitimes. 
                Note : Cela peut affecter votre capacité à utiliser certains services.
              </p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <h3 className="font-bold text-lg mb-3 dark:text-white">8.6 Droit à la Limitation du Traitement</h3>
              <p>
                Vous pouvez demander la limitation du traitement de vos données dans certains cas (contestation de l'exactitude, etc.).
              </p>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <h3 className="font-bold text-lg mb-3 dark:text-white">8.7 Droit de Retrait du Consentement</h3>
              <p>
                Vous pouvez retirer votre consentement à tout moment. Cela n'affecte pas la licéité du traitement effectué avant le retrait.
              </p>
            </div>

            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="font-bold mb-2 dark:text-white">Comment exercer vos droits ?</p>
              <p>
                Envoyez un email à <a href="mailto:contact@simpleplate.dev" className="text-blue-600 dark:text-blue-400 underline font-bold">contact@simpleplate.dev</a> 
                avec :
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Votre demande précise (accès, rectification, suppression, etc.)</li>
                <li>Votre adresse email de compte</li>
                <li>Une pièce d'identité (pour vérification de sécurité)</li>
              </ul>
              <p className="mt-2">
                Nous répondrons dans un délai de <strong>30 jours maximum</strong> (conformément au RGPD).
              </p>
            </div>
          </div>
        </section>

        {/* COOKIES */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black dark:border-gray-500 pb-2 mb-4 dark:text-white flex items-center gap-2">
            <Cookie className="w-6 h-6" />
            9. Cookies et Technologies Similaires
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>Nous utilisons les types de cookies suivants :</p>
            
            <div className="space-y-3">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-bold mb-2 dark:text-white">Cookies Strictement Nécessaires</h3>
                <p className="text-sm">
                  Ces cookies sont essentiels au fonctionnement du site (authentification, panier, préférences). 
                  Ils ne peuvent pas être désactivés.
                </p>
                <ul className="list-disc pl-6 text-sm mt-2">
                  <li><strong>supabase.auth.token :</strong> Session utilisateur (expire à la fermeture du navigateur)</li>
                  <li><strong>darkMode :</strong> Préférence de thème sombre/clair</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-bold mb-2 dark:text-white">Cookies Analytiques (Google Analytics)</h3>
                <p className="text-sm">
                  Ces cookies nous aident à comprendre comment vous utilisez le site (pages visitées, durée de session). 
                  Les données sont <strong>anonymisées</strong> et agrégées.
                </p>
                <p className="text-sm mt-2">
                  <strong>Vous pouvez désactiver ces cookies</strong> via les paramètres de votre navigateur ou via 
                  <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 underline"> l'outil de désactivation de Google Analytics</a>.
                </p>
              </div>
            </div>

            <p className="mt-4">
              <strong>Gestion des cookies :</strong> Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur. 
              Notez que la désactivation de certains cookies peut affecter le fonctionnement du site.
            </p>
          </div>
        </section>

        {/* MINEURS */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black dark:border-gray-500 pb-2 mb-4 dark:text-white">
            10. Protection des Mineurs
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              SimplePlate est destiné aux personnes âgées d'au moins <strong>13 ans</strong>. 
              Les mineurs de moins de 18 ans doivent obtenir l'autorisation de leurs parents ou tuteurs légaux avant d'utiliser le service.
            </p>
            <p>
              Si vous êtes parent ou tuteur et que vous découvrez que votre enfant nous a fourni des données personnelles sans votre consentement, 
              contactez-nous immédiatement à <a href="mailto:contact@simpleplate.dev" className="text-blue-600 dark:text-blue-400 underline">contact@simpleplate.dev</a> 
              pour demander la suppression de ces données.
            </p>
          </div>
        </section>

        {/* MODIFICATIONS */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black dark:border-gray-500 pb-2 mb-4 dark:text-white">
            11. Modifications de cette Politique
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              Nous pouvons modifier cette politique de confidentialité à tout moment. Les modifications seront publiées sur cette page 
              avec une mise à jour de la date de "Dernière mise à jour".
            </p>
            <p>
              En cas de modification importante, nous vous en informerons par email (si vous avez un compte) ou via une notification sur le site.
            </p>
            <p>
              Nous vous encourageons à consulter régulièrement cette page pour rester informé de nos pratiques de protection des données.
            </p>
          </div>
        </section>

        {/* CONTACT & RÉCLAMATION */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black dark:border-gray-500 pb-2 mb-4 dark:text-white flex items-center gap-2">
            <Mail className="w-6 h-6" />
            12. Contact et Réclamation
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits RGPD, contactez-nous :
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border-2 border-black dark:border-gray-600">
              <p className="font-bold mb-2 dark:text-white">SimplePlate</p>
              <p>
                <strong>Email :</strong> <a href="mailto:contact@simpleplate.dev" className="text-blue-600 dark:text-blue-400 underline font-bold">contact@simpleplate.dev</a><br/>
                <strong>Page de contact :</strong> <Link to="/contact" className="text-blue-600 dark:text-blue-400 underline">/contact</Link>
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border-l-4 border-red-400">
              <h3 className="font-bold mb-2 dark:text-white">Droit de Réclamation</h3>
              <p>
                Si vous estimez que le traitement de vos données personnelles viole le RGPD, vous avez le droit d'introduire une réclamation 
                auprès de l'autorité de contrôle compétente :
              </p>
              <p className="mt-2">
                <strong>CNIL (Commission Nationale de l'Informatique et des Libertés)</strong><br/>
                3 Place de Fontenoy - TSA 80715<br/>
                75334 PARIS CEDEX 07<br/>
                Téléphone : 01 53 73 22 22<br/>
                Site web : <a href="https://www.cnil.fr" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 underline">www.cnil.fr</a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

