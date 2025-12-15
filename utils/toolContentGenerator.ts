
import { ToolConfig } from '../types';

interface SEOContent {
  intro: string;
  howTo: string[];
  useCases: Array<{ title: string; description: string }>;
  benefits: Array<{ title: string; description: string }>;
}

type Language = 'fr' | 'en';

export const generateToolSEOContent = (tool: ToolConfig, language: Language = 'fr'): SEOContent => {
  const personalizedContentFr: Record<string, SEOContent> = {
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

  const personalizedContentEn: Record<string, SEOContent> = {
    'ecom-product-scanner': {
      intro: `${tool.title} automatically analyzes e-commerce product pages to extract essential information: price, descriptions, images, reviews, and technical specs. No more manual copy/paste: in seconds you get structured data ready to use.`,
      howTo: [
        'Paste the URL of the product page you want to analyze (Amazon, etc.).',
        'Click "Analyze" and wait a few seconds. The AI scans the page and extracts key data.',
        'Use the structured output: price, description, images, reviews, specifications.',
      ],
      useCases: [
        { title: 'Price comparisons', description: 'Extract prices and specs to build comparisons quickly.' },
        { title: 'Competitive research', description: 'Analyze competitors’ listings to refine your positioning.' },
        { title: 'Catalog imports', description: 'Import product information from other e-commerce sites.' },
      ],
      benefits: [
        { title: 'Time saver', description: 'No manual copy/paste—extraction is automated.' },
        { title: 'Structured data', description: 'Information is organized and ready to reuse.' },
        { title: 'Multi-platform', description: 'Works with many e-commerce websites.' },
      ],
    },
    'website-generator': {
      intro: `With ${tool.title}, create a complete website in minutes. Describe your project, pick a style and sections, and the AI generates deploy-ready HTML/CSS/JS. Great for landing pages, portfolios, or a basic marketing site.`,
      howTo: [
        'Describe your project: type of site, industry, and the sections you want.',
        'Choose a visual style (modern, classic, minimalist, etc.).',
        'Click "Generate" and get a complete HTML website in seconds.',
      ],
      useCases: [
        { title: 'Marketing websites', description: 'Create a website to present your company or services.' },
        { title: 'Landing pages', description: 'Generate landing pages for marketing campaigns.' },
        { title: 'Portfolios', description: 'Create a professional portfolio to showcase your work.' },
      ],
      benefits: [
        { title: 'Fast', description: 'A complete site in minutes instead of hours.' },
        { title: 'Editable', description: 'Clean code that’s easy to customize.' },
        { title: 'Deploy-ready', description: 'The generated site is functional and ready to ship.' },
      ],
    },
    'qr-code-generator': {
      intro: `${tool.title} generates QR codes instantly for any content: URLs, text, phone numbers, emails, or WiFi credentials. Free, fast, and private (runs locally in your browser).`,
      howTo: [
        'Enter the content to encode (URL, text, etc.).',
        'Click "Generate" and your QR code appears instantly.',
        'Download the QR code as a PNG image.',
      ],
      useCases: [
        { title: 'Marketing', description: 'Create QR codes for flyers, posters, or business cards.' },
        { title: 'Events', description: 'Share information quickly during events.' },
        { title: 'WiFi', description: 'Share your WiFi access easily.' },
      ],
      benefits: [
        { title: '100% free', description: 'No credits required, unlimited generation.' },
        { title: 'Private & secure', description: 'Runs locally—your data is never sent.' },
        { title: 'Downloadable', description: 'High-quality PNG export for any use.' },
      ],
    },
    'homework-helper': {
      intro: `${tool.title} is your personal homework assistant. Upload a photo of an exercise or ask a question, and get a clear step-by-step explanation. Great for math, science, history, and more.`,
      howTo: [
        'Upload a photo of your exercise OR type your question.',
        'Specify the subject (math, English, history, etc.).',
        'Click "Generate" to receive a detailed, educational explanation.',
      ],
      useCases: [
        { title: 'Students', description: 'Get help understanding exercises and improving skills.' },
        { title: 'Parents', description: 'Help your kids even if you’re not an expert in the subject.' },
        { title: 'Learners', description: 'Review efficiently with detailed explanations.' },
      ],
      benefits: [
        { title: 'Step-by-step', description: 'Each step is explained clearly for real understanding.' },
        { title: 'Multi-subject', description: 'Works for math, science, languages, history, etc.' },
        { title: 'Photo or text', description: 'Use a photo or type your question directly.' },
      ],
    },
    'ai-image-analysis': {
      intro: `${tool.title} deeply analyzes any image to extract visible information: objects, text, colors, composition, and context. Great for photos, screenshots, scanned documents, or designs.`,
      howTo: [
        'Upload the image you want to analyze (JPG/PNG, max 4MB).',
        'Click "Analyze" and wait a few seconds.',
        'Receive a complete analysis with detected details.',
      ],
      useCases: [
        { title: 'Accessibility', description: 'Generate image descriptions for web accessibility.' },
        { title: 'Document analysis', description: 'Extract text and information from scanned documents.' },
        { title: 'Visual research', description: 'Analyze social media or website visuals for research.' },
      ],
      benefits: [
        { title: 'Comprehensive', description: 'Detects objects, text, colors, and context.' },
        { title: 'Common formats', description: 'Works with JPG, PNG, and other common formats.' },
        { title: 'Fast & accurate', description: 'Results in seconds with strong accuracy.' },
      ],
    },
    'business-plan-pro': {
      intro: `Have an idea but no business plan? ${tool.title} turns your concept into a professional business plan you can present to investors. The AI structures everything: Executive Summary, market sizing, business model, go-to-market strategy, and SWOT.`,
      howTo: [
        'Describe your business idea: product/service, target market, and goals.',
        'Click "Generate" and wait 30–60 seconds. The AI structures a complete plan.',
        'Use the structured plan with the sections you need to pitch confidently.',
      ],
      useCases: [
        { title: 'Startups', description: 'Create a plan for fundraising or investor pitches.' },
        { title: 'Entrepreneurs', description: 'Validate and structure your model before launching.' },
        { title: 'Students', description: 'Generate a professional plan for academic projects.' },
      ],
      benefits: [
        { title: 'Professional structure', description: 'Includes essential sections found in real business plans.' },
        { title: 'Market analysis', description: 'Clear market sizing and positioning.' },
        { title: 'Pitch-ready', description: 'Professional format you can reuse in your pitch deck.' },
      ],
    },
    'python-pro-gen': {
      intro: `${tool.title} generates professional, working Python code for any task. Describe what you need and get a complete script with comments and best practices.`,
      howTo: [
        'Select the type of Python script you want (scraping, API, data processing, etc.).',
        'Describe the goal and required technical details.',
        'Click "Generate" and get ready-to-run Python code.',
      ],
      useCases: [
        { title: 'Developers', description: 'Generate Python quickly without writing everything manually.' },
        { title: 'Automation', description: 'Create scripts to automate repetitive tasks.' },
        { title: 'Learning', description: 'Learn by reading generated code and best practices.' },
      ],
      benefits: [
        { title: 'Professional code', description: 'Follows Python best practices and includes comments.' },
        { title: 'Works out of the box', description: 'Ready to run and test immediately.' },
        { title: 'Versatile', description: 'Supports scraping, APIs, data processing, and more.' },
      ],
    },
    'ai-detector': {
      intro: `${tool.title} analyzes a text to estimate whether it was generated by AI. Useful to check authenticity, detect potential AI usage, or validate originality.`,
      howTo: ['Paste the text you want to analyze.', 'Click "Analyze" and wait a few seconds.', 'Get a probability score (AI vs human).'],
      useCases: [
        { title: 'Education', description: 'Check whether a student assignment may be AI-generated.' },
        { title: 'Editors', description: 'Validate originality of submitted content.' },
        { title: 'Recruiters', description: 'Assess authenticity of cover letters and statements.' },
      ],
      benefits: [
        { title: 'Accurate detection', description: 'Advanced analysis for common AI writing patterns.' },
        { title: 'Probability score', description: 'Clear percentage-based estimation.' },
        { title: 'Fast', description: 'Runs in seconds for texts of any length.' },
      ],
    },
    'ai-humanizer': {
      intro: `${tool.title} rewrites AI-generated text into natural, human-sounding content while preserving the original meaning. Great for marketing content, articles, or messages.`,
      howTo: ['Paste the AI-generated text you want to humanize.', 'Click "Humanize" and wait a few seconds.', 'Get a natural, engaging rewrite.'],
      useCases: [
        { title: 'Marketing', description: 'Make marketing copy sound more authentic.' },
        { title: 'Blogging', description: 'Turn AI drafts into natural, readable articles.' },
        { title: 'Communication', description: 'Make emails and messages feel more personal.' },
      ],
      benefits: [
        { title: 'Natural tone', description: 'Removes obvious AI patterns and improves flow.' },
        { title: 'Meaning preserved', description: 'Keeps your intent intact while improving style.' },
        { title: 'More engaging', description: 'Improves clarity and readability for your audience.' },
      ],
    },
  };

  const defaultContentFr: SEOContent = {
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

  const defaultContentEn: SEOContent = {
    intro: `${tool.title} is a powerful tool that helps you ${tool.description.toLowerCase()}. Simple, fast, and effective, it saves time and boosts productivity.`,
    howTo: [
      'Fill in the required fields with the needed information.',
      'Click "Generate" and wait a few seconds.',
      'Use the result directly in your workflow.',
    ],
    useCases: [
      { title: 'Professionals', description: 'Improve your productivity at work.' },
      { title: 'Students', description: 'Save time on projects and assignments.' },
      { title: 'Creators', description: 'Boost creativity and speed up your creation workflow.' },
    ],
    benefits: [
      { title: 'Fast', description: 'Get results in seconds instead of hours.' },
      { title: 'Quality', description: 'Professional output with strong consistency.' },
      { title: 'Easy', description: 'Intuitive interface that works for beginners too.' },
    ],
  };

  const personalized = language === 'fr' ? personalizedContentFr : personalizedContentEn;
  const fallback = language === 'fr' ? defaultContentFr : defaultContentEn;
  return personalized[tool.id] || fallback;
};

