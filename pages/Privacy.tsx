
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, FileText, Mail, Database, Cookie, UserCheck } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useSEO } from '../hooks/useSEO';

export const Privacy: React.FC = () => {
  const { language } = useTranslation();

  useSEO({
    title: language === 'fr' ? 'Politique de confidentialité (RGPD) | SimplePlate AI' : 'Privacy policy (GDPR) | SimplePlate AI',
    description:
      language === 'fr'
        ? 'Politique de confidentialité de SimplePlate AI: données collectées, finalités, conservation, sécurité et droits RGPD.'
        : 'SimplePlate AI privacy policy: collected data, purposes, retention, security, and GDPR rights.',
    language,
    keywords: language === 'fr' ? ['confidentialité', 'rgpd', 'données personnelles'] : ['privacy', 'gdpr', 'personal data'],
  });

  return (
    <div className="max-w-4xl mx-auto bg-white border-2 border-black p-8 rounded-lg shadow-neo my-8">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-neo-violet" />
        <h1 className="font-display text-3xl md:text-4xl font-bold">
          Politique de Confidentialité
        </h1>
      </div>
      <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : 25 novembre 2025</p>

      <div className="prose max-w-none space-y-10">
        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black pb-2 mb-4">1. Introduction</h2>
          <p>
            SimplePlate AI s'engage à protéger votre vie privée et vos données personnelles. 
            Cette politique de confidentialité explique comment nous collectons, utilisons, 
            stockons et protégeons vos informations conformément au Règlement Général sur la 
            Protection des Données (RGPD) et à la loi Informatique et Libertés.
          </p>
        </section>

        {/* Responsable du traitement */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black pb-2 mb-4">2. Responsable du traitement</h2>
          <p>
            Le responsable du traitement des données est SimplePlate AI.<br/>
            <strong>Contact :</strong> contact@simpleplate.dev
          </p>
        </section>

        {/* Données collectées */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black pb-2 mb-4">3. Données personnelles collectées</h2>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <UserCheck className="w-5 h-5" /> Données de compte
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Adresse email (obligatoire pour créer un compte)</li>
                <li>Identifiant utilisateur (UUID généré automatiquement)</li>
                <li>Date de création du compte</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <Database className="w-5 h-5" /> Données d'utilisation
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Historique des transactions (achats de crédits, utilisation d'outils)</li>
                <li>Nombre de crédits utilisés et restants</li>
                <li>Statut d'abonnement PRO</li>
                <li>Préférences (mode sombre/clair)</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Données de paiement
              </h3>
              <p className="text-sm">
                Les paiements sont traités par <strong>Stripe</strong>. Nous ne stockons pas vos 
                informations bancaires. Seul votre identifiant client Stripe est conservé pour 
                gérer votre abonnement.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <Eye className="w-5 h-5" /> Données techniques
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Adresse IP (collectée automatiquement par notre hébergeur)</li>
                <li>Type de navigateur et système d'exploitation</li>
                <li>Pages visitées et durée de visite</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <Lock className="w-5 h-5" /> Données des outils IA
              </h3>
              <p className="text-sm">
                Les données que vous saisissez dans les outils IA (textes, images) sont envoyées 
                à <strong>Google Gemini API</strong> pour traitement. Ces données ne sont pas 
                stockées par SimplePlate AI et sont supprimées après traitement par Google.
              </p>
            </div>
          </div>
        </section>

        {/* Finalités */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black pb-2 mb-4">4. Finalités du traitement</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Gestion de votre compte :</strong> Création, authentification, gestion des crédits</li>
            <li><strong>Fourniture des services :</strong> Accès aux outils IA et utilitaires</li>
            <li><strong>Facturation :</strong> Gestion des paiements et abonnements</li>
            <li><strong>Support client :</strong> Réponse à vos demandes et assistance</li>
            <li><strong>Amélioration du service :</strong> Analyse statistique anonymisée de l'utilisation</li>
            <li><strong>Conformité légale :</strong> Respect des obligations comptables et fiscales</li>
          </ul>
        </section>

        {/* Conservation */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black pb-2 mb-4">5. Durée de conservation</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Données de compte :</strong> Conservées pendant la durée de votre compte, puis 3 ans après suppression</li>
            <li><strong>Données de transaction :</strong> Conservées 10 ans (obligation comptable)</li>
            <li><strong>Données techniques :</strong> Conservées 13 mois maximum</li>
            <li><strong>Cookies :</strong> Voir notre <Link to="/legal" className="text-neo-violet font-bold underline">politique de cookies</Link></li>
          </ul>
        </section>

        {/* Partage */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black pb-2 mb-4">6. Partage et transfert de données</h2>
          <p className="mb-4">Vos données peuvent être partagées avec :</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Supabase :</strong> Hébergement de la base de données (UE)</li>
            <li><strong>Stripe :</strong> Traitement des paiements (UE/US, conforme RGPD)</li>
            <li><strong>Google Gemini API :</strong> Traitement des requêtes IA (US, conforme RGPD via clauses contractuelles)</li>
            <li><strong>Vercel :</strong> Hébergement de l'application (US, conforme RGPD)</li>
          </ul>
          <p className="mt-4 text-sm">
            Nous ne vendons jamais vos données à des tiers. Tous nos prestataires sont soumis 
            à des obligations strictes de confidentialité.
          </p>
        </section>

        {/* Sécurité */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black pb-2 mb-4">7. Sécurité des données</h2>
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger 
            vos données :
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Chiffrement HTTPS pour toutes les communications</li>
            <li>Authentification sécurisée (Supabase Auth)</li>
            <li>Base de données protégée par Row Level Security (RLS)</li>
            <li>Sauvegardes régulières et sécurisées</li>
            <li>Accès restreint aux données personnelles</li>
          </ul>
        </section>

        {/* Droits RGPD */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black pb-2 mb-4">8. Vos droits (RGPD)</h2>
          <p className="mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-bold mb-2">📋 Droit d'accès</h3>
              <p className="text-sm">Vous pouvez accéder à toutes vos données personnelles via votre <Link to="/dashboard" className="text-neo-violet font-bold underline">tableau de bord</Link>.</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-bold mb-2">✏️ Droit de rectification</h3>
              <p className="text-sm">Vous pouvez modifier vos informations dans votre profil ou en nous contactant.</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-bold mb-2">🗑️ Droit à l'effacement</h3>
              <p className="text-sm">Vous pouvez demander la suppression de votre compte et de vos données (sous réserve des obligations légales de conservation).</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-bold mb-2">📦 Droit à la portabilité</h3>
              <p className="text-sm">Vous pouvez récupérer vos données dans un format structuré en nous contactant.</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-bold mb-2">🚫 Droit d'opposition</h3>
              <p className="text-sm">Vous pouvez vous opposer au traitement de vos données pour des motifs légitimes.</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-bold mb-2">⏸️ Droit à la limitation</h3>
              <p className="text-sm">Vous pouvez demander la limitation du traitement de vos données dans certains cas.</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-bold mb-2">✅ Retrait du consentement</h3>
              <p className="text-sm">Vous pouvez retirer votre consentement à tout moment (pour les cookies notamment).</p>
            </div>
          </div>

          <p className="mt-4">
            Pour exercer vos droits, contactez-nous à <strong>contact@simpleplate.dev</strong> 
            ou via votre <Link to="/dashboard" className="text-neo-violet font-bold underline">tableau de bord</Link>.
          </p>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black pb-2 mb-4">9. Cookies</h2>
          <p>
            Nous utilisons des cookies pour améliorer votre expérience. Consultez notre 
            <Link to="/legal" className="text-neo-violet font-bold underline"> politique de cookies</Link> 
            pour plus d'informations.
          </p>
        </section>

        {/* Mineurs */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black pb-2 mb-4">10. Protection des mineurs</h2>
          <p>
            SimplePlate AI n'est pas destiné aux personnes de moins de 16 ans. Nous ne collectons 
            pas sciemment de données personnelles de mineurs. Si vous êtes parent et que vous 
            découvrez que votre enfant nous a fourni des données, contactez-nous immédiatement.
          </p>
        </section>

        {/* Modifications */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black pb-2 mb-4">11. Modifications de cette politique</h2>
          <p>
            Nous pouvons modifier cette politique de confidentialité. Toute modification 
            importante vous sera notifiée par email ou via une notification sur le site. 
            La date de dernière mise à jour est indiquée en haut de cette page.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-black pb-2 mb-4">12. Contact et réclamations</h2>
          <p className="mb-4">
            Pour toute question concernant cette politique ou vos données personnelles :
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Email :</strong> contact@simpleplate.dev</li>
            <li><strong>Formulaire :</strong> <Link to="/contact" className="text-neo-violet font-bold underline">Page de contact</Link></li>
          </ul>
          <p className="mt-4">
            Vous avez également le droit d'introduire une réclamation auprès de la 
            <strong> Commission Nationale de l'Informatique et des Libertés (CNIL)</strong> 
            si vous estimez que vos droits ne sont pas respectés : 
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-neo-violet font-bold underline"> www.cnil.fr</a>
          </p>
        </section>
      </div>
    </div>
  );
};

