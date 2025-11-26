
import { ToolConfig } from '../types';

interface SEOContent {
  intro: string;
  howTo: string[];
  useCases: Array<{ title: string; description: string }>;
  benefits: Array<{ title: string; description: string }>;
}

export const generateToolSEOContent = (tool: ToolConfig): SEOContent => {
  const personalizedContent: Record<string, SEOContent> = {
    'ecom-product-scanner': {
      intro: `L'outil ${tool.title} analyse automatiquement les pages produits e-commerce pour extraire toutes les informations essentielles : prix, descriptions, images, avis clients, et caractéristiques techniques. Plus besoin de copier-coller manuellement : en quelques secondes, vous avez toutes les données structurées et prêtes à être utilisées.`,
      howTo: [
        `Collez l'URL de la page produit que vous souhaitez analyser (Amazon, Cdiscount, Fnac, etc.).`,
        `Cliquez sur "Analyser" et attendez quelques secondes. L'IA scanne la page et extrait toutes les informations.`,
        `Récupérez les données structurées : prix, description, images, avis, caractéristiques.`
      ],
      useCases: [
        { title: 'Comparateurs de prix', description: 'Extrayez rapidement les prix et caractéristiques de plusieurs produits pour créer des comparatifs.' },
        { title: 'Veille concurrentielle', description: 'Analysez les produits de vos concurrents pour adapter votre stratégie.' },
        { title: 'Import de catalogues', description: 'Importez automatiquement des produits depuis d\'autres sites e-commerce.' }
      ],
      benefits: [
        { title: 'Gain de temps', description: 'Plus besoin de copier-coller manuellement chaque information. L\'extraction est automatique.' },
        { title: 'Données structurées', description: 'Toutes les informations sont organisées et prêtes à être utilisées dans vos outils.' },
        { title: 'Multi-plateformes', description: 'Fonctionne avec la plupart des sites e-commerce (Amazon, Cdiscount, Fnac, etc.).' }
      ]
    },
    'website-generator': {
      intro: `Avec ${tool.title}, créez un site web complet en quelques minutes. Décrivez votre projet, choisissez le style et les sections souhaitées, et l'IA génère un site HTML/CSS/JS prêt à être déployé. Parfait pour créer rapidement un site vitrine, un portfolio ou une landing page.`,
      howTo: [
        `Décrivez votre projet : type de site, secteur d'activité, et sections souhaitées.`,
        `Choisissez le style visuel (moderne, classique, minimaliste, etc.).`,
        `Cliquez sur "Générer" et récupérez votre site HTML complet en quelques secondes.`
      ],
      useCases: [
        { title: 'Sites vitrines', description: 'Créez rapidement un site pour présenter votre entreprise ou vos services.' },
        { title: 'Landing pages', description: 'Générez des pages d\'atterrissage pour vos campagnes marketing.' },
        { title: 'Portfolios', description: 'Créez un portfolio professionnel pour présenter vos réalisations.' }
      ],
      benefits: [
        { title: 'Rapidité', description: 'Un site complet en quelques minutes au lieu de plusieurs heures de développement.' },
        { title: 'Personnalisable', description: 'Le code généré est propre et facilement modifiable selon vos besoins.' },
        { title: 'Prêt à déployer', description: 'Le site généré est fonctionnel et peut être déployé immédiatement.' }
      ]
    },
    'qr-code-generator': {
      intro: `${tool.title} génère des QR codes instantanément pour n'importe quel contenu : URL, texte, numéro de téléphone, email, ou même coordonnées WiFi. Gratuit, rapide et 100% privé (génération locale dans votre navigateur).`,
      howTo: [
        `Entrez le contenu à encoder (URL, texte, etc.).`,
        `Cliquez sur "Générer" et votre QR code apparaît instantanément.`,
        `Téléchargez le QR code en image PNG pour l'utiliser où vous voulez.`
      ],
      useCases: [
        { title: 'Marketing', description: 'Créez des QR codes pour vos flyers, affiches ou cartes de visite.' },
        { title: 'Événements', description: 'Générez des QR codes pour partager rapidement des informations lors d\'événements.' },
        { title: 'WiFi', description: 'Créez des QR codes WiFi pour partager facilement votre connexion.' }
      ],
      benefits: [
        { title: '100% gratuit', description: 'Aucun crédit nécessaire, génération illimitée de QR codes.' },
        { title: 'Privé et sécurisé', description: 'La génération se fait localement dans votre navigateur, vos données ne sont jamais envoyées.' },
        { title: 'Téléchargeable', description: 'Téléchargez vos QR codes en haute qualité pour les utiliser partout.' }
      ]
    },
    'homework-helper': {
      intro: `${tool.title} est votre assistant personnel pour les devoirs. Envoyez une photo de votre exercice ou posez votre question par écrit, et recevez une explication détaillée étape par étape. Parfait pour comprendre les mathématiques, les sciences, l'histoire, et bien plus encore.`,
      howTo: [
        `Uploadez une photo de votre exercice OU tapez votre question.`,
        `Indiquez la matière concernée (maths, français, histoire, etc.).`,
        `Cliquez sur "Générer" et recevez une explication complète et pédagogique.`
      ],
      useCases: [
        { title: 'Élèves', description: 'Obtenez de l\'aide pour comprendre vos exercices et progresser dans vos études.' },
        { title: 'Parents', description: 'Aidez vos enfants avec leurs devoirs même si vous n\'êtes pas expert dans la matière.' },
        { title: 'Étudiants', description: 'Révisez efficacement avec des explications détaillées de vos cours.' }
      ],
      benefits: [
        { title: 'Explications détaillées', description: 'Chaque étape est expliquée clairement pour une vraie compréhension.' },
        { title: 'Multi-matières', description: 'Fonctionne pour les mathématiques, les sciences, les langues, l\'histoire, etc.' },
        { title: 'Photo ou texte', description: 'Envoyez une photo de votre exercice ou tapez directement votre question.' }
      ]
    },
    'ai-image-analysis': {
      intro: `${tool.title} analyse en profondeur n'importe quelle image pour extraire toutes les informations visibles : objets, texte, couleurs, composition, et même le contexte. Parfait pour analyser des photos, des screenshots, des documents scannés, ou des designs.`,
      howTo: [
        `Uploadez l'image que vous souhaitez analyser (JPG, PNG, max 4Mo).`,
        `Cliquez sur "Analyser" et attendez quelques secondes.`,
        `Recevez une analyse complète de l'image avec tous les détails détectés.`
      ],
      useCases: [
        { title: 'Accessibilité', description: 'Générez automatiquement des descriptions d\'images pour l\'accessibilité web.' },
        { title: 'Analyse de documents', description: 'Extrayez le texte et les informations de documents scannés ou photos.' },
        { title: 'Veille visuelle', description: 'Analysez des images de réseaux sociaux ou de sites web pour votre veille.' }
      ],
      benefits: [
        { title: 'Analyse complète', description: 'Détecte les objets, le texte, les couleurs, et même le contexte de l\'image.' },
        { title: 'Multi-formats', description: 'Fonctionne avec JPG, PNG, et autres formats d\'images courants.' },
        { title: 'Rapide et précis', description: 'Analyse en quelques secondes avec une grande précision.' }
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
      intro: `${tool.title} génère du code Python professionnel et fonctionnel pour n'importe quelle tâche. Décrivez ce que vous voulez faire, précisez les détails techniques, et recevez un script Python complet avec commentaires et bonnes pratiques.`,
      howTo: [
        `Sélectionnez le type de script Python que vous souhaitez (web scraping, API, traitement de données, etc.).`,
        `Décrivez l'objectif et les détails techniques nécessaires.`,
        `Cliquez sur "Générer" et récupérez votre code Python prêt à l'emploi.`
      ],
      useCases: [
        { title: 'Développeurs', description: 'Générez rapidement du code Python pour vos projets sans tout écrire manuellement.' },
        { title: 'Automatisation', description: 'Créez des scripts pour automatiser des tâches répétitives.' },
        { title: 'Apprentissage', description: 'Apprenez Python en analysant le code généré et ses bonnes pratiques.' }
      ],
      benefits: [
        { title: 'Code professionnel', description: 'Le code généré suit les bonnes pratiques Python (PEP 8) et est commenté.' },
        { title: 'Fonctionnel', description: 'Le code est prêt à être exécuté et testé immédiatement.' },
        { title: 'Multi-usages', description: 'Générez des scripts pour web scraping, APIs, traitement de données, etc.' }
      ]
    },
    'ai-detector': {
      intro: `${tool.title} analyse un texte pour détecter s'il a été généré par une IA. Utile pour vérifier l'authenticité d'un contenu, détecter le plagiat, ou valider l'originalité d'un texte.`,
      howTo: [
        `Collez le texte que vous souhaitez analyser.`,
        `Cliquez sur "Analyser" et attendez quelques secondes.`,
        `Recevez un score de probabilité indiquant si le texte est d'origine IA ou humaine.`
      ],
      useCases: [
        { title: 'Éducation', description: 'Vérifiez si un devoir étudiant a été généré par une IA.' },
        { title: 'Éditeurs', description: 'Validez l\'originalité des textes soumis pour publication.' },
        { title: 'Recruteurs', description: 'Vérifiez l\'authenticité des lettres de motivation et CV.' }
      ],
      benefits: [
        { title: 'Détection précise', description: 'Analyse avancée pour détecter les patterns typiques des textes générés par IA.' },
        { title: 'Score de probabilité', description: 'Recevez un pourcentage indiquant la probabilité que le texte soit d\'origine IA.' },
        { title: 'Rapide', description: 'Analyse en quelques secondes pour des textes de toute longueur.' }
      ]
    },
    'ai-humanizer': {
      intro: `${tool.title} transforme un texte généré par IA en contenu naturel et humain. Réécrit le texte pour qu'il sonne authentique, naturel, et engageant, tout en conservant le sens original. Parfait pour humaniser vos contenus marketing ou vos articles.`,
      howTo: [
        `Collez le texte généré par IA que vous souhaitez humaniser.`,
        `Cliquez sur "Humaniser" et attendez quelques secondes.`,
        `Récupérez votre texte réécrit de manière naturelle et engageante.`
      ],
      useCases: [
        { title: 'Marketing', description: 'Humanisez vos contenus marketing pour qu\'ils sonnent plus authentiques.' },
        { title: 'Blogging', description: 'Transformez vos articles générés par IA en contenu naturel et engageant.' },
        { title: 'Communication', description: 'Rendez vos emails et messages plus personnels et naturels.' }
      ],
      benefits: [
        { title: 'Style naturel', description: 'Le texte réécrit sonne authentique et humain, sans traces de génération IA.' },
        { title: 'Conserve le sens', description: 'Le message original est préservé, seul le style est amélioré.' },
        { title: 'Engageant', description: 'Le texte humanisé est plus engageant et captivant pour vos lecteurs.' }
      ]
    }
  };

  const defaultContent: SEOContent = {
    intro: `${tool.title} est un outil puissant qui vous aide à ${tool.description.toLowerCase()}. Simple, rapide et efficace, cet outil vous fait gagner du temps et améliore votre productivité.`,
    howTo: [
      `Remplissez les champs requis avec les informations nécessaires.`,
      `Cliquez sur "Générer" et attendez quelques secondes.`,
      `Récupérez votre résultat et utilisez-le selon vos besoins.`
    ],
    useCases: [
      { title: 'Professionnels', description: 'Utilisez cet outil pour améliorer votre productivité au travail.' },
      { title: 'Étudiants', description: 'Gagnez du temps sur vos projets et devoirs avec cet outil.' },
      { title: 'Créateurs', description: 'Boostez votre créativité et accélérez votre processus de création.' }
    ],
    benefits: [
      { title: 'Rapidité', description: 'Obtenez des résultats en quelques secondes au lieu de plusieurs heures.' },
      { title: 'Qualité', description: 'Des résultats professionnels et de haute qualité à chaque utilisation.' },
      { title: 'Simplicité', description: 'Interface intuitive et facile à utiliser, même pour les débutants.' }
    ]
  };

  return personalizedContent[tool.id] || defaultContent;
};

