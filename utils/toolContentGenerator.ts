// Générateur de contenu SEO personnalisé et humain pour chaque outil

import { ToolConfig } from '../types';

export const generateToolSEOContent = (tool: ToolConfig) => {
  // Contenu personnalisé basé sur l'ID de l'outil
  const personalizedContent: Record<string, {
    intro: string;
    howTo: string[];
    useCases: Array<{ title: string; description: string }>;
    benefits: Array<{ title: string; description: string }>;
  }> = {
    'ecom-product-scanner': {
      intro: `Vous avez une photo de produit mais pas de description ? ${tool.title} transforme n'importe quelle photo en fiche produit Shopify ou Amazon prête à l'emploi. Plus besoin de passer des heures à rédiger des descriptions : l'IA analyse votre image et génère un titre accrocheur, des bullet points vendeurs et une description marketing optimisée pour le SEO. Parfait pour les dropshippers et les vendeurs e-commerce qui veulent lancer leurs produits rapidement.`,
      howTo: [
        `Prenez ou uploadez une photo claire de votre produit. Même une photo prise avec votre téléphone fonctionne ! L'IA est capable d'analyser les détails visuels.`,
        `Optionnellement, précisez votre niche cible (ex: "Sportifs", "Parents", "Luxe") pour que la description soit adaptée à votre audience.`,
        `Cliquez sur "Générer" et récupérez votre fiche produit complète avec titre SEO, description courte, bullet points et mots-clés.`
      ],
      useCases: [
        { title: 'Dropshippers', description: 'Lancez vos produits sur AliExpress en quelques minutes avec des descriptions professionnelles qui convertissent.' },
        { title: 'Vendeurs Amazon FBA', description: 'Créez des fiches produits optimisées pour Amazon qui boostent votre classement dans les résultats de recherche.' },
        { title: 'Boutiques Shopify', description: 'Générez des descriptions produits engageantes qui augmentent votre taux de conversion et vos ventes.' }
      ],
      benefits: [
        { title: 'Gain de temps énorme', description: 'Économisez 2-3 heures par produit. Ce qui prenait une journée peut maintenant se faire en 10 minutes.' },
        { title: 'Descriptions optimisées SEO', description: 'Titres et descriptions pensés pour être trouvés sur Google et les marketplaces.' },
        { title: 'Adaptation à votre cible', description: 'Le contenu est personnalisé selon votre niche pour parler directement à vos clients.' }
      ]
    },
    'website-generator': {
      intro: `Vous avez besoin d'un site web mais vous ne savez pas coder ? ${tool.title} crée une landing page complète et fonctionnelle en quelques secondes. Décrivez simplement ce que vous voulez (ex: "Un site pour mon restaurant avec menu, horaires et réservation") et l'IA génère le code HTML/CSS/JS prêt à déployer. Plus besoin de passer des jours sur Figma ou de payer un développeur : votre site est prêt en 1 clic.`,
      howTo: [
        `Décrivez votre site en détail : le type de business, le style souhaité (moderne, coloré, minimaliste...), et les sections à inclure.`,
        `Choisissez un style visuel dans le menu déroulant si vous avez une préférence, ou laissez l'IA choisir pour vous.`,
        `Générez votre site et récupérez le code HTML complet. Copiez-collez dans un fichier .html et ouvrez-le dans votre navigateur !`
      ],
      useCases: [
        { title: 'Startups', description: 'Créez votre landing page MVP en quelques minutes pour tester votre idée avant d\'investir dans un développeur.' },
        { title: 'Freelances', description: 'Ayez un site portfolio professionnel sans toucher une ligne de code. Parfait pour présenter vos services.' },
        { title: 'Petites entreprises', description: 'Lancez votre présence en ligne rapidement avec un site moderne et responsive qui fonctionne sur tous les appareils.' }
      ],
      benefits: [
        { title: 'Code propre et moderne', description: 'HTML5, Tailwind CSS, responsive design : votre site a l\'air professionnel dès le départ.' },
        { title: 'Prêt à déployer', description: 'Pas besoin de configuration complexe. Le code généré fonctionne immédiatement.' },
        { title: 'Personnalisable', description: 'Le code est bien structuré et commenté, facile à modifier selon vos besoins.' }
      ]
    },
    'qr-code-generator': {
      intro: `Besoin d'un QR code rapidement ? ${tool.title} génère des QR codes instantanément pour n'importe quel contenu : URL, texte, numéro de téléphone, WiFi... C'est 100% gratuit, sans inscription, et vos données ne quittent jamais votre navigateur. Parfait pour ajouter des QR codes sur vos flyers, cartes de visite ou documents.`,
      howTo: [
        `Entrez ce que vous voulez encoder : une URL (https://...), un texte libre, un numéro de téléphone, ou même des informations WiFi.`,
        `Cliquez sur "Générer" et votre QR code apparaît instantanément. Aucun crédit n'est consommé, c'est totalement gratuit !`,
        `Téléchargez votre QR code en cliquant sur le bouton "Télécharger" et utilisez-le où vous voulez.`
      ],
      useCases: [
        { title: 'Marketing', description: 'Ajoutez des QR codes sur vos flyers, affiches ou cartes de visite pour diriger vos clients vers votre site ou vos réseaux sociaux.' },
        { title: 'Événements', description: 'Créez des QR codes pour partager le WiFi de votre événement ou rediriger vers un formulaire d\'inscription.' },
        { title: 'Usage personnel', description: 'Générez des QR codes pour partager rapidement des informations avec vos amis ou collègues.' }
      ],
      benefits: [
        { title: '100% gratuit', description: 'Aucun crédit nécessaire, aucune limite d\'utilisation. Générez autant de QR codes que vous voulez.' },
        { title: 'Privé et sécurisé', description: 'Tout se passe dans votre navigateur. Vos données ne sont jamais envoyées à un serveur.' },
        { title: 'Rapide et simple', description: 'QR code généré en moins d\'une seconde, prêt à télécharger et utiliser.' }
      ]
    },
    'homework-helper': {
      intro: `Blocage sur un exercice de maths, français ou sciences ? ${tool.title} est votre assistant de devoirs personnel. Uploadez une photo de votre exercice ou posez votre question, et l'IA vous explique tout en détail avec des exemples concrets. Ce n'est pas juste une réponse : on vous apprend à comprendre et à résoudre le problème par vous-même.`,
      howTo: [
        `Prenez une photo claire de votre exercice ou copiez-collez votre question dans le champ texte. Vous pouvez aussi faire les deux pour plus de précision.`,
        `Cliquez sur "Générer" et attendez quelques secondes. L'IA analyse votre question et prépare une explication détaillée.`,
        `Lisez l'explication étape par étape. L'IA vous guide dans la résolution pour que vous compreniez vraiment, pas juste pour copier la réponse.`
      ],
      useCases: [
        { title: 'Élèves du collège/lycée', description: 'Obtenez de l\'aide pour comprendre vos cours et résoudre vos exercices, peu importe la matière.' },
        { title: 'Parents', description: 'Aidez vos enfants avec leurs devoirs même si vous n\'êtes pas expert dans la matière.' },
        { title: 'Étudiants', description: 'Clarifiez des concepts complexes et obtenez des explications détaillées pour vos révisions.' }
      ],
      benefits: [
        { title: 'Explications pédagogiques', description: 'L\'IA explique comme un vrai professeur, avec des exemples et des étapes claires.' },
        { title: 'Toutes les matières', description: 'Maths, français, sciences, langues... L\'IA maîtrise tous les sujets scolaires.' },
        { title: 'Apprendre vraiment', description: 'Ce n\'est pas juste la réponse : on vous apprend le raisonnement pour progresser.' }
      ]
    },
    'ai-image-analysis': {
      intro: `Vous vous demandez si une image est générée par IA ? Ou vous voulez retrouver le prompt original d'une image Midjourney ? ${tool.title} analyse n'importe quelle image et vous dit si elle vient d'une IA, avec un pourcentage de probabilité. Si c'est le cas, l'outil génère même le prompt probable qui a été utilisé pour la créer. Indispensable pour les créateurs et les professionnels du design.`,
      howTo: [
        `Uploadez l'image que vous voulez analyser. Format PNG, JPG accepté, jusqu'à 4Mo.`,
        `Optionnellement, posez une question spécifique (ex: "Quel est le prompt Midjourney ?" ou "Est-ce une IA ?").`,
        `Récupérez l'analyse complète : probabilité IA, indices visuels détectés, et le prompt probable si c'est une image générée.`
      ],
      useCases: [
        { title: 'Créateurs de contenu', description: 'Vérifiez si une image que vous voulez utiliser est générée par IA avant de la publier.' },
        { title: 'Designers', description: 'Trouvez l\'inspiration en découvrant les prompts utilisés pour créer des images que vous admirez.' },
        { title: 'Professionnels', description: 'Détectez les images IA dans les portfolios ou les candidatures pour évaluer les compétences réelles.' }
      ],
      benefits: [
        { title: 'Détection précise', description: 'L\'IA analyse les défauts typiques (mains, texte, cohérence) pour détecter les images générées.' },
        { title: 'Reverse engineering', description: 'Retrouvez le prompt probable d\'une image pour apprendre et reproduire le style.' },
        { title: 'Confidentialité', description: 'Vos images sont analysées et supprimées immédiatement, jamais stockées.' }
      ]
    },
    'business-plan-pro': {
      intro: `Vous avez une idée de business mais pas de business plan ? ${tool.title} transforme votre concept en business plan professionnel prêt à présenter à des investisseurs. L'IA structure tout : Executive Summary, analyse de marché (TAM/SAM/SOM), modèle économique, stratégie Go-To-Market et analyse SWOT. Plus besoin de passer des semaines sur Excel : votre business plan est prêt en quelques minutes.`,
      howTo: [
        `Décrivez votre idée de business en détail : le produit/service, le marché visé, et vos objectifs.`,
        `Cliquez sur "Générer" et attendez 30-60 secondes. L'IA analyse votre idée et structure un business plan complet.`,
        `Récupérez votre business plan structuré avec toutes les sections nécessaires pour convaincre des investisseurs.`
      ],
      useCases: [
        { title: 'Startups', description: 'Créez votre business plan pour lever des fonds ou présenter votre projet à des investisseurs.' },
        { title: 'Entrepreneurs', description: 'Structurez votre idée et validez votre modèle économique avant de vous lancer.' },
        { title: 'Étudiants', description: 'Générez un business plan professionnel pour vos projets académiques ou concours entrepreneuriat.' }
      ],
      benefits: [
        { title: 'Structure professionnelle', description: 'Toutes les sections essentielles sont incluses, comme dans un vrai business plan d\'entreprise.' },
        { title: 'Analyse de marché', description: 'L\'IA calcule votre TAM/SAM/SOM et vous donne une vision claire de votre marché potentiel.' },
        { title: 'Prêt à présenter', description: 'Format professionnel que vous pouvez directement utiliser pour vos pitchs.' }
      ]
    },
    'python-pro-gen': {
      intro: `Vous avez besoin d'un script Python mais vous ne savez pas par où commencer ? ${tool.title} génère du code Python professionnel, documenté et prêt à l'emploi. Décrivez simplement ce que vous voulez faire (ex: "Scraper les titres des dernières news sur HackerNews et les sauvegarder dans un CSV") et l'IA écrit le code complet avec gestion d'erreurs, commentaires et structure propre. Plus besoin de chercher sur Stack Overflow pendant des heures : votre script est prêt en 30 secondes.`,
      howTo: [
        `Décrivez précisément ce que doit faire votre script Python. Plus vous êtes détaillé, meilleur sera le code généré.`,
        `Cliquez sur "Générer" et attendez quelques secondes. L'IA structure votre code avec imports, fonctions et gestion d'erreurs.`,
        `Récupérez votre script Python complet, copiez-le dans un fichier .py et exécutez-le. Le code est prêt à l'emploi !`
      ],
      useCases: [
        { title: 'Automatisation', description: 'Automatisez des tâches répétitives : scraping web, traitement de fichiers, envoi d\'emails, etc.' },
        { title: 'Data Science', description: 'Générez rapidement des scripts pour analyser des données, créer des visualisations ou nettoyer des datasets.' },
        { title: 'Développeurs', description: 'Accélérez votre développement en générant des fonctions complexes ou des scripts utilitaires.' }
      ],
      benefits: [
        { title: 'Code professionnel', description: 'Respecte la PEP8, avec gestion d\'erreurs, commentaires et structure propre dès le départ.' },
        { title: 'Bibliothèques populaires', description: 'Utilise requests, pandas, beautifulsoup et autres librairies standards du Python moderne.' },
        { title: 'Prêt à exécuter', description: 'Le code généré fonctionne immédiatement, pas besoin de debug ou de modifications.' }
      ]
    },
    'ai-detector': {
      intro: `Vous vous demandez si un texte a été écrit par ChatGPT ou une autre IA ? ${tool.title} analyse n'importe quel texte et vous donne un pourcentage de probabilité qu'il soit généré par une IA. L'outil détecte les patterns typiques des textes IA : répétitions, manque de nuance, structure trop parfaite. Indispensable pour vérifier l'authenticité d'un contenu avant de le publier ou de l'utiliser.`,
      howTo: [
        `Collez le texte que vous voulez analyser dans le champ. Plus le texte est long, plus l'analyse sera précise.`,
        `Cliquez sur "Générer" et attendez l'analyse. L'IA examine les patterns linguistiques et structurels.`,
        `Récupérez le verdict : pourcentage de probabilité IA, indices détectés, et conclusion finale.`
      ],
      useCases: [
        { title: 'Éditeurs & Rédacteurs', description: 'Vérifiez si un contenu soumis est original ou généré par IA avant publication.' },
        { title: 'Enseignants', description: 'Détectez si les devoirs de vos élèves ont été générés par ChatGPT ou autres outils IA.' },
        { title: 'Recruteurs', description: 'Évaluez l\'authenticité des lettres de motivation et CV reçus lors de vos recrutements.' }
      ],
      benefits: [
        { title: 'Détection précise', description: 'Analyse les patterns linguistiques et structurels pour identifier les textes IA avec une bonne précision.' },
        { title: 'Explications détaillées', description: 'L\'outil vous explique pourquoi il pense que c\'est de l\'IA, avec des indices concrets.' },
        { title: 'Rapide et simple', description: 'Analyse en quelques secondes, résultat clair et compréhensible.' }
      ]
    },
    'ai-humanizer': {
      intro: `Vous avez un texte généré par ChatGPT mais il sonne trop "robotique" ? ${tool.title} transforme vos textes IA en contenu naturel et humain. L'outil varie les longueurs de phrases, ajoute des nuances émotionnelles, utilise des expressions françaises naturelles et supprime les listes à puces inutiles. Résultat : un texte indétectable par les outils anti-IA, qui sonne comme écrit par un humain.`,
      howTo: [
        `Collez votre texte robotique généré par ChatGPT, Claude ou autre IA dans le champ.`,
        `Cliquez sur "Générer" et attendez la transformation. L'IA réécrit le texte avec un style plus humain.`,
        `Récupérez votre texte humanisé, prêt à être utilisé sans risque de détection.`
      ],
      useCases: [
        { title: 'Étudiants', description: 'Transformez vos devoirs générés par IA en textes naturels qui passent les détecteurs anti-plagiat.' },
        { title: 'Rédacteurs', description: 'Améliorez vos textes IA pour qu\'ils sonnent plus authentiques et engageants pour vos lecteurs.' },
        { title: 'Professionnels', description: 'Humanisez vos emails ou documents générés par IA pour qu\'ils aient un ton plus personnel.' }
      ],
      benefits: [
        { title: 'Style naturel', description: 'Le texte humanisé utilise des expressions françaises naturelles et un rythme de lecture humain.' },
        { title: 'Indétectable', description: 'Contourne les détecteurs IA comme GPTZero grâce à un style authentique et varié.' },
        { title: 'Amélioration du style', description: 'Le texte est non seulement humanisé mais aussi amélioré en termes de fluidité et d\'engagement.' }
      ]
    }
  };

  // Contenu par défaut si l'outil n'a pas de contenu personnalisé
  const defaultContent = {
    intro: `${tool.title} est un outil puissant qui vous permet de ${tool.description.toLowerCase()}. Conçu pour être simple et efficace, cet outil utilise l'intelligence artificielle pour vous faire gagner du temps sur des tâches qui prendraient normalement des heures. Que vous soyez débutant ou expert, vous obtiendrez des résultats professionnels en quelques clics.`,
    howTo: [
      `Remplissez le formulaire avec les informations demandées. ${tool.inputs.length > 1 ? `L'outil nécessite ${tool.inputs.length} informations pour générer le meilleur résultat.` : 'Une seule information suffit pour générer votre résultat.'}`,
      `Cliquez sur "Générer". ${tool.cost === 0 ? 'C\'est entièrement gratuit !' : `L'utilisation coûte ${tool.cost} crédit${tool.cost > 1 ? 's' : ''}.`}`,
      `Récupérez votre résultat dans la colonne de droite. Vous pouvez le copier, le télécharger ou l'utiliser directement.`
    ],
    useCases: [
      { title: 'Professionnels', description: `Utilisez ${tool.title} pour optimiser votre workflow et gagner du temps sur vos tâches quotidiennes.` },
      { title: 'Particuliers', description: `Simplifiez votre vie avec ${tool.title} et obtenez des résultats professionnels sans compétences techniques.` }
    ],
    benefits: [
      { title: 'Rapidité', description: 'Obtenez des résultats en quelques secondes au lieu d\'heures de travail manuel.' },
      { title: 'Qualité', description: 'Des résultats optimisés et prêts à l\'emploi, générés par l\'IA la plus avancée.' },
      { title: 'Simplicité', description: 'Interface intuitive, aucune compétence technique requise.' }
    ]
  };

  return personalizedContent[tool.id] || defaultContent;
};

