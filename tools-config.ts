
import { ToolConfig } from './types';

// Directive stricte pour l'IA
const SYSTEM_PROMPT = `
RÔLE: Tu es un expert francophone précis et efficace.
RÈGLES ABSOLUES:
1. TU DOIS RÉPONDRE UNIQUEMENT EN FRANÇAIS (Sauf si on demande explicitement de traduire vers une autre langue ou pour le code informatique).
2. Sois direct. Pas de "Bonjour", pas de "Voici la réponse". Donne le résultat.
3. Utilise le format Markdown pour la mise en forme (Gras, Listes, Code).
`;

// Helper pour les outils IA classiques
const createSimpleTool = (
  id: string,
  title: string,
  description: string,
  category: ToolConfig['category'],
  promptPrefix: string,
  iconName: string = 'Sparkles',
  inputType: 'text' | 'textarea' = 'textarea',
  inputConfig: { rows?: number; className?: string; placeholder?: string; label?: string } = {},
  seoOverride?: { title?: string; description?: string; keywords?: string[] },
  costOverride: number = 1
): ToolConfig => ({
  id,
  title,
  description,
  category,
  cost: costOverride,
  isPremium: false,
  iconName,
  outputType: 'text',
  seo: {
    title: seoOverride?.title || `${title} Professionnel | SimplePlate AI`,
    description: seoOverride?.description || `${description} - Outil professionnel alimenté par l'IA. Système de crédits et abonnement PRO disponible.`,
    keywords: seoOverride?.keywords || [title, 'IA', 'Générateur', 'Professionnel', 'Outil en ligne', 'Français', 'SaaS', 'Crédits']
  },
  inputs: [{ 
    name: 'input', 
    label: inputConfig.label || 'Votre demande', 
    type: inputType, 
    placeholder: inputConfig.placeholder || 'Entrez les détails ici...', 
    required: true,
    rows: inputConfig.rows || 4,
    className: inputConfig.className || ''
  }],
  promptGenerator: (data) => `${SYSTEM_PROMPT}
TÂCHE: ${promptPrefix}
CONTEXTE UTILISATEUR: "${data.input}"`,
});

export const tools: ToolConfig[] = [
  // --- HIGH TICKET TOOLS (3 CREDITS) ---
  {
    id: 'ecom-product-scanner',
    title: 'Scanner Produit E-com',
    description: 'Uploadez une photo, obtenez la fiche produit Shopify complète.',
    category: 'Business',
    cost: 3,
    isPremium: true,
    iconName: 'ScanBarcode',
    outputType: 'text',
    seo: { 
      title: 'Générateur Fiche Produit via Photo - IA E-commerce', 
      description: 'Transformez une simple photo en fiche produit Shopify/Amazon optimisée SEO. Titre, description et marketing générés par l\'IA.', 
      keywords: ['fiche produit ia', 'shopify generator', 'description produit photo', 'e-commerce ai', 'dropshipping tool', 'amazon fba'] 
    },
    inputs: [
      { name: 'image', label: 'Photo du produit', type: 'file', accept: 'image/*', required: true, helpText: 'Même une photo amateur suffit. L\'IA analyse les détails visuels.' },
      { name: 'niche', label: 'Niche / Cible (Optionnel)', type: 'text', placeholder: 'Ex: Sportifs, Parents, Luxe...', required: false }
    ],
    promptGenerator: (data) => `${SYSTEM_PROMPT}
TÂCHE: Analyse cette image de produit comme un expert Copywriter E-commerce (Amazon FBA / Shopify).
CIBLE: ${data.niche || "Grand public"}
SORTIE ATTENDUE (Format Markdown) :
1. **Titre SEO** (Accrocheur, < 80 caractères).
2. **Description Courte** (2 phrases impactantes).
3. **5 Bullet Points** (Avantages clés et caractéristiques visibles).
4. **Description Longue** (Storytelling persuasif).
5. **Mots-clés SEO** (Liste de 10 tags).
6. **Estimation de Prix** (Basé sur la valeur perçue).`
  },
  {
    id: 'website-generator',
    title: 'Générateur Site Web',
    description: 'Créez une Landing Page complète (HTML/CSS/JS) en une requête.',
    category: 'Dev',
    cost: 3,
    isPremium: true,
    iconName: 'Layout',
    outputType: 'text',
    seo: { 
      title: 'Générateur de Site Web IA - HTML/CSS/JS Professionnel', 
      description: 'Générez le code complet d\'une page web moderne, responsive et stylisée (Tailwind CSS) à partir d\'une simple description. Code propre et prêt à l\'emploi.', 
      keywords: ['générateur site web', 'créer site ia', 'code html css', 'landing page generator', 'webdesign ia', 'nocode'] 
    },
    inputs: [{ name: 'desc', label: 'Décrivez le site web à créer', type: 'textarea', rows: 6, placeholder: 'Ex: Une landing page pour une application de fitness sombre avec des boutons verts néons, une section témoignages et un formulaire de contact.', required: true }],
    promptGenerator: (data) => `${SYSTEM_PROMPT}
TÂCHE: Agis comme un Développeur Frontend Senior. Code une page web complète (Single File HTML) pour : "${data.desc}".
INSTRUCTIONS STRICTES:
1. Structure HTML5 complète (<!DOCTYPE html>...).
2. Utilise Tailwind CSS via CDN (<script src="https://cdn.tailwindcss.com"></script>).
3. Utilise des images placeholder (https://placehold.co/600x400) si besoin.
4. Inclus tout (CSS/JS) dans le même fichier.
5. NE DONNE QUE LE CODE DANS UN BLOC MARKDOWN. Pas de texte avant ni après. Pas d'explications.`
  },
  {
    id: 'python-pro-gen',
    title: 'Générateur Python Pro',
    description: 'Scripts Python complexes, robustes et documentés.',
    category: 'Dev',
    cost: 3,
    isPremium: true,
    iconName: 'Terminal',
    outputType: 'text',
    seo: { 
      title: 'Générateur de Script Python IA - Code Automatisé', 
      description: 'Obtenez des scripts Python prêts à l\'emploi pour l\'automatisation, la data science ou le web scraping. Code propre et commenté.', 
      keywords: ['générateur python', 'script python ia', 'automatisation', 'code python professionnel', 'aide programmation'] 
    },
    inputs: [{ name: 'task', label: 'Que doit faire le script ?', type: 'textarea', rows: 8, placeholder: 'Ex: Scraper les titres des dernières news sur HackerNews et les sauvegarder dans un CSV...', required: true }],
    promptGenerator: (data) => `${SYSTEM_PROMPT}
TÂCHE: Agis comme un Expert Python. Écris un script complet pour : "${data.task}".
INSTRUCTIONS:
1. Code robuste (Gestion d'erreurs try/except).
2. Respecte la PEP8.
3. Ajoute des commentaires expliquant chaque étape importante.
4. Utilise des bibliothèques populaires si nécessaire (requests, pandas, beautifulsoup).
5. Structure avec \`if __name__ == "__main__":\`.`
  },

  // --- PRO TOOLS (HIGH VALUE) ---
  {
    id: 'ai-image-analysis',
    title: 'Analyseur d\'Image IA',
    description: 'Détectez les incohérences ou faites du Reverse Engineering.',
    category: 'Image',
    cost: 2,
    isPremium: true,
    iconName: 'ScanSearch',
    outputType: 'text',
    seo: { 
      title: 'Détecteur Image IA & Reverse Prompt - Analyse Professionnelle', 
      description: 'Uploadez une image pour détecter si elle est générée par une IA ou pour obtenir le prompt original (Midjourney, DALL-E). Traitement 100% privé.', 
      keywords: ['détecteur image ia', 'reverse prompt', 'analyse image', 'upload image ai', 'vision ia'] 
    },
    inputs: [
      { name: 'image', label: 'Uploadez votre image', type: 'file', accept: 'image/*', required: true, helpText: 'L\'image est analysée directement et ne sera jamais stockée sur nos serveurs.' },
      { name: 'question', label: 'Votre question sur l\'image', type: 'text', placeholder: 'Est-ce une IA ? Quel est le prompt ?', required: false }
    ],
    promptGenerator: (data) => `${SYSTEM_PROMPT}
TÂCHE: Analyse cette image fournie.
QUESTION UTILISATEUR: "${data.question || "Dis-moi si cette image est générée par IA et donne le prompt probable."}"
DIRECTIVES:
1. Cherche les défauts visuels (mains, texte, cohérence lumière).
2. Donne un pourcentage de probabilité IA.
3. Génère le prompt de création détaillé.`
  },
  {
    id: 'business-plan-pro',
    title: 'Business Plan Pro',
    description: 'Générez un plan stratégique complet pour investisseurs.',
    category: 'Business',
    cost: 2,
    isPremium: true,
    iconName: 'Briefcase',
    outputType: 'text',
    seo: { 
      title: 'Générateur de Business Plan IA Complet - Professionnel', 
      description: 'Créez un business plan professionnel en 1 clic. Executive Summary, Analyse de marché, Stratégie financière et SWOT.', 
      keywords: ['business plan generator', 'créer business plan', 'modèle business plan', 'startup', 'investisseurs'] 
    },
    inputs: [{ name: 'idea', label: 'Décrivez votre idée de business', type: 'textarea', rows: 6, placeholder: 'Ex: Une application de livraison de repas par drone à Paris...', required: true }],
    promptGenerator: (data) => `${SYSTEM_PROMPT} Agis comme un consultant McKinsey Senior. Rédige un Business Plan structuré pour cette idée : "${data.idea}".\nSections obligatoires :\n1. Executive Summary\n2. Analyse de Marché (Tam/Sam/Som)\n3. Modèle Économique\n4. Stratégie Go-To-Market\n5. Analyse SWOT.`
  },
  {
    id: 'smart-contract-audit',
    title: 'Audit Smart Contract',
    description: 'Analysez la sécurité de votre code Solidity.',
    category: 'Security',
    cost: 2,
    isPremium: true,
    iconName: 'ShieldCheck',
    outputType: 'text',
    seo: { 
      title: 'Audit de Smart Contract Solidity IA - Sécurité Blockchain', 
      description: 'Analysez votre code Solidity pour trouver les failles de sécurité (Reentrancy, Overflow). Outil indispensable pour développeurs Web3.', 
      keywords: ['audit smart contract', 'solidity linter', 'sécurité blockchain', 'ethereum dev', 'code review'] 
    },
    inputs: [{ name: 'code', label: 'Code Solidity', type: 'textarea', rows: 15, className: 'font-mono text-xs', placeholder: 'pragma solidity ^0.8.0; ...', required: true }],
    promptGenerator: (data) => `${SYSTEM_PROMPT} Tu es un auditeur de sécurité Blockchain expert (Certik/OpenZeppelin). Analyse ce code Solidity : "${data.code}".\n1. Liste les vulnérabilités critiques (Reentrancy, Gas Limit, Overflow).\n2. Donne un score de sécurité sur 100.\n3. Fournis le code corrigé et sécurisé.`
  },

  // --- E-COMMERCE TOOLS ---
  createSimpleTool(
    'ecom-ad-gen', 
    'Pub Facebook & TikTok', 
    'Générez des textes publicitaires qui convertissent (ROAS).', 
    'Business', 
    'Agis comme un expert Media Buyer. Rédige 3 variantes de publicité (Facebook/Instagram/TikTok) pour ce produit. Utilise des hooks viraux, des emojis et la méthode AIDA (Attention, Intérêt, Désir, Action). Produit :', 
    'Megaphone', 'textarea', { rows: 4, placeholder: 'Ex: Un correcteur de posture pour le dos...' },
    { title: 'Générateur de Publicité Facebook & TikTok Ads IA', description: 'Créez des textes publicitaires performants pour vos campagnes. Copywriting optimisé pour le dropshipping et l\'e-commerce.', keywords: ['pub facebook generator', 'tiktok ads script', 'copywriting e-commerce', 'marketing ia'] }, 
    1
  ),
  createSimpleTool(
    'ecom-review-reply', 
    'Répondeur Avis Clients', 
    'Transformez un avis négatif en opportunité commerciale.', 
    'Business', 
    'Agis comme un responsable Service Client empathique et professionnel. Rédige une réponse à cet avis client. Si l\'avis est négatif, excuse-toi et propose une solution. Si positif, remercie chaleureusement. Avis :', 
    'MessageCircle', 'textarea', { rows: 4, placeholder: 'Collez l\'avis du client ici...' },
    { title: 'Générateur Réponse Avis Client (Google/Amazon)', description: 'Répondez aux avis clients automatiquement avec professionnalisme. Gestion de crise et fidélisation par IA.', keywords: ['répondre avis google', 'service client ia', 'gestion avis négatif', 'amazon review reply'] }, 
    1
  ),
  createSimpleTool(
    'brand-name-gen', 
    'Générateur Nom de Marque', 
    'Trouvez un nom unique, court et disponible.', 
    'Business', 
    'Propose 10 noms de marque uniques, courts, mémorables et modernes pour ce projet. Vérifie mentalement que ça sonne bien en français et anglais. Projet :', 
    'Tag', 'text', { placeholder: 'Ex: Une marque de vêtements éco-responsables' },
    { title: 'Générateur de Nom de Marque & Startup', description: 'Trouvez le nom parfait pour votre entreprise ou boutique Shopify. Idées de noms originaux et disponibles.', keywords: ['générateur nom entreprise', 'trouver nom marque', 'branding ia', 'naming tool'] }, 
    1
  ),

  // --- NEW AI TOOLS ---
  {
    id: 'ai-detector',
    title: 'Détecteur Texte IA',
    description: 'Vérifiez si un texte est écrit par ChatGPT, Gemini ou un humain.',
    category: 'Text',
    cost: 1,
    isPremium: false,
    iconName: 'ScanEye',
    outputType: 'text',
    seo: { 
      title: 'Détecteur IA Professionnel - Test ChatGPT & GPTZero En Ligne',
      description: 'Outil fiable à 99% pour détecter si un texte a été généré par une IA (ChatGPT, Claude, Gemini) ou écrit par un humain.',
      keywords: ['détecteur ia professionnel', 'vérifier chatgpt', 'ai detector français', 'anti plagiat ia', 'reconnaître texte ia']
    },
    inputs: [{ name: 'content', label: 'Texte à analyser', type: 'textarea', rows: 8, required: true }],
    promptGenerator: (data) => `${SYSTEM_PROMPT} Agis comme un algorithme de détection de motifs IA. Analyse ce texte : "${data.content}". \n1. Donne un pourcentage de probabilité qu'il soit écrit par une IA.\n2. Liste les indices (répétitions, manque de nuance, structure trop parfaite).\n3. Verdict final : HUMAIN ou IA.`
  },
  {
    id: 'ai-humanizer',
    title: 'Humaniseur de Texte',
    description: 'Rendez vos textes IA indétectables et naturels.',
    category: 'Text',
    cost: 1,
    isPremium: false,
    iconName: 'Fingerprint',
    outputType: 'text',
    seo: { 
      title: 'Humaniseur de Texte IA - Reformuler ChatGPT (Indétectable)', 
      description: 'Transformez un texte robotique généré par ChatGPT en texte fluide et humain. Contournez les détecteurs IA facilement.', 
      keywords: ['humaniser texte', 'bypass ai detection', 'reformuler chatgpt', 'style humain', 'paraphraseur ia'] 
    },
    inputs: [{ name: 'content', label: 'Texte robotique à humaniser', type: 'textarea', rows: 8, required: true }],
    promptGenerator: (data) => `${SYSTEM_PROMPT} Agis comme un éditeur littéraire humain expérimenté. Réécris ce texte généré par IA : "${data.content}".\nConsignes : Varie la longueur des phrases, ajoute des nuances émotionnelles, utilise des idiomes français naturels, supprime les listes à puces inutiles. Le but est qu'il soit INDÉTECTABLE par les outils anti-IA.`
  },
  {
    id: 'pro-prompt-gen',
    title: 'Générateur Prompt Pro',
    description: 'Transformez une idée simple en Super-Prompt structuré.',
    category: 'Business',
    cost: 1,
    isPremium: false,
    iconName: 'Wand2',
    outputType: 'text',
    seo: { 
      title: 'Générateur de Prompt Engineering Pro - ChatGPT & Midjourney', 
      description: 'Créez des prompts parfaits pour ChatGPT, Midjourney ou Claude. Optimisez vos résultats IA avec la méthode Chain-of-Thought.', 
      keywords: ['prompt generator', 'prompt engineering', 'meilleur prompt chatgpt', 'générateur de prompt', 'midjourney helper'] 
    },
    inputs: [{ name: 'idea', label: 'Votre idée de base', type: 'textarea', rows: 4, placeholder: 'Ex: Je veux un plan marketing pour vendre des chaussures...', required: true }],
    promptGenerator: (data) => `${SYSTEM_PROMPT} Tu es un expert mondial en Prompt Engineering. Transforme cette idée simple : "${data.idea}" en un MEGA-PROMPT structuré et optimisé.\nStructure attendue :\n1. Rôle (Persona)\n2. Contexte & Tâche\n3. Contraintes & Format\n4. Étapes de réflexion (Chain of Thought).`
  },

  // --- MANDATORY / FLAGSHIP TOOLS (IA) ---
  {
    id: 'scam-detector',
    title: 'Détecteur d\'Arnaques',
    description: 'Analysez si un SMS ou un numéro est une arnaque.',
    category: 'Security',
    cost: 1,
    isPremium: false,
    iconName: 'ShieldAlert',
    outputType: 'text',
    seo: { 
      title: 'Détecteur Arnaque SMS & Téléphone - Vérification IA Professionnelle', 
      description: 'Copiez-collez un message suspect. Notre IA analyse s\'il s\'agit d\'une tentative de phishing, smishing ou d\'arnaque au CPF.', 
      keywords: ['arnaque sms', 'détecteur phishing', 'numéro suspect', 'vérifier arnaque', 'signalement spam'] 
    },
    inputs: [{ name: 'content', label: 'Message ou Numéro suspect', type: 'textarea', rows: 4, required: true }],
    promptGenerator: (data) => `${SYSTEM_PROMPT} Analyse ce message suspect : "${data.content}". \nFormat de réponse :\n1. **VERDICT** : (ARNAQUE CERTAINE / SUSPECT / SÛR)\n2. **Risque** : X/10\n3. **Analyse** : Explique pourquoi en 2 phrases.`
  },
  {
    id: 'legal-translator',
    title: 'Traducteur Juridique',
    description: 'Comprenez enfin vos contrats et documents légaux.',
    category: 'Business',
    cost: 1,
    isPremium: false,
    iconName: 'Scale',
    outputType: 'text',
    seo: { 
      title: 'Simplificateur de Contrat Juridique - Traducteur Droit Français', 
      description: 'L\'IA traduit le jargon juridique en français courant. Comprenez ce que vous signez (Contrats, CGU, Baux).', 
      keywords: ['traducteur juridique', 'comprendre contrat', 'simplifier droit', 'avocat ia', 'résumé juridique'] 
    },
    inputs: [{ name: 'text', label: 'Collez le texte juridique', type: 'textarea', rows: 10, className: 'text-sm', required: true }],
    promptGenerator: (data) => `${SYSTEM_PROMPT} Traduis ce texte juridique en langage courant et compréhensible pour un enfant de 12 ans. Liste ensuite les points dangereux (clauses abusives potentielles) :\n"${data.text}"`
  },
  {
    id: 'dream-interpreter',
    title: 'Interprète de Rêves',
    description: 'Découvrez la signification cachée de vos rêves.',
    category: 'Life',
    cost: 1,
    isPremium: false,
    iconName: 'Moon',
    outputType: 'text',
    seo: { 
      title: 'Signification des Rêves & Interprétation IA - Analyse Professionnelle', 
      description: 'Analysez vos rêves avec la psychologie (Freud/Jung). Découvrez ce que votre subconscient vous dit grâce à l\'IA.', 
      keywords: ['signification rêve', 'interprétation rêves', 'cauchemar signification', 'psychologie rêve', 'dictionnaire rêves'] 
    },
    inputs: [{ name: 'dream', label: 'Racontez votre rêve', type: 'textarea', rows: 6, required: true }],
    promptGenerator: (data) => `${SYSTEM_PROMPT} Agis comme un psychanalyste expert. Interprète ce rêve : "${data.dream}". Donne une signification symbolique et psychologique.`
  },
  {
    id: 'roast-my-code',
    title: 'Explose mon Code',
    description: 'L\'IA critique votre code avec humour et méchanceté.',
    category: 'Dev',
    cost: 1,
    isPremium: false,
    iconName: 'Flame',
    outputType: 'text',
    seo: { 
      title: 'Roast My Code - Critique de Code IA Drôle', 
      description: 'Soumettez votre code et faites-vous humilier par une IA. Audit de code humoristique mais instructif pour développeurs.', 
      keywords: ['roast my code', 'critique code', 'audit code humour', 'refactoring fun', 'code review ai'] 
    },
    inputs: [{ name: 'code', label: 'Votre Code à détruire', type: 'textarea', rows: 15, className: 'font-mono text-xs', required: true }],
    promptGenerator: (data) => `${SYSTEM_PROMPT} Tu es un développeur Senior aigri et très drôle. "Roast" (critique violemment) ce code : "${data.code}". \n1. Une insulte créative sur le niveau du dev.\n2. Les vrais problèmes techniques.\n3. La version corrigée.`
  },

  // --- LOCAL TOOLS (Passage à 1 Crédit pour rentabiliser) ---
  {
    id: 'csv-to-json',
    title: 'CSV vers JSON',
    description: 'Convertisseur instantané sécurisé (local).',
    category: 'Dev',
    cost: 1,
    isPremium: false,
    iconName: 'FileJson',
    outputType: 'text',
    seo: { 
      title: 'Convertisseur CSV vers JSON En Ligne - Sécurisé', 
      description: 'Transformez vos fichiers CSV en JSON instantanément. Traitement 100% local, vos données ne quittent pas votre navigateur.', 
      keywords: ['csv to json', 'convertisseur csv', 'csv json en ligne', 'dev tools', 'excel to json'] 
    },
    inputs: [{ name: 'csv', label: 'Collez votre CSV (avec en-têtes)', type: 'textarea', rows: 8, className: 'font-mono text-xs', required: true }],
    promptGenerator: (data) => `LOCAL:CSV_JSON;;;${data.csv}`
  },
  {
    id: 'hex-to-rgb',
    title: 'Couleur Hex ↔ RGB',
    description: 'Convertisseur de couleurs pour Webdesigners.',
    category: 'Image',
    cost: 1,
    isPremium: false,
    iconName: 'Palette',
    outputType: 'text',
    seo: { 
      title: 'Convertisseur Hex vers RGB - Outil Couleur CSS Professionnel', 
      description: 'Convertir code couleur Hexadécimal en RGB et vice-versa. Visualisation de la couleur en direct pour webdesigners.', 
      keywords: ['hex to rgb', 'convertisseur couleur', 'code couleur css', 'webdesign', 'color picker'] 
    },
    inputs: [{ name: 'hex', label: 'Code Hex (ex: #FF0000)', type: 'text', placeholder: '#FF0000', required: true }],
    promptGenerator: (data) => `LOCAL:HEX_RGB;;;${data.hex}`
  },
  {
    id: 'percent-calc',
    title: 'Calcul Pourcentage',
    description: 'Calculez rapidement remises et évolutions.',
    category: 'Life',
    cost: 1,
    isPremium: false,
    iconName: 'Percent',
    outputType: 'text',
    seo: { 
      title: 'Calculatrice de Pourcentage - Soldes & Remises', 
      description: 'Comment calculer un pourcentage ? Outil facile pour calculer X% d\'une somme, une augmentation ou une réduction.', 
      keywords: ['calcul pourcentage', 'calculatrice solde', 'formule pourcentage', 'maths facile', 'calcul remise'] 
    },
    inputs: [
        { name: 'val', label: 'Pourcentage (%)', type: 'number', required: true },
        { name: 'total', label: 'Valeur Totale', type: 'number', required: true }
    ],
    promptGenerator: (data) => `LOCAL:PERCENT_CALC;;;${data.val};;;${data.total}`
  },
  {
    id: 'meta-tag-gen',
    title: 'Générateur SEO Meta',
    description: 'Créez vos balises HTML pour Google.',
    category: 'Dev',
    cost: 1,
    isPremium: false,
    iconName: 'Tag',
    outputType: 'text',
    seo: { 
      title: 'Générateur Meta Tags SEO HTML - Professionnel', 
      description: 'Générez les balises Title, Description et OpenGraph pour référencer votre site web correctement sur Google et Facebook.', 
      keywords: ['meta tags generator', 'seo html', 'balise title', 'référencement web', 'open graph generator'] 
    },
    inputs: [
        { name: 'title', label: 'Titre de la page', type: 'text', required: true },
        { name: 'desc', label: 'Meta Description', type: 'textarea', rows: 2, required: true },
        { name: 'author', label: 'Auteur', type: 'text', required: true }
    ],
    promptGenerator: (data) => `LOCAL:META_TAGS;;;${data.title};;;${data.desc};;;${data.author}`
  },
  {
    id: 'morse-trans',
    title: 'Traducteur Morse',
    description: 'Encodez ou décodez des messages secrets.',
    category: 'Life',
    cost: 1,
    isPremium: false,
    iconName: 'Radio',
    outputType: 'text',
    seo: { 
      title: 'Traducteur Morse - Texte vers Morse En Ligne', 
      description: 'Traduire du texte en code Morse et inversement. Apprenez l\'alphabet morse facilement pour le scoutisme ou le fun.', 
      keywords: ['traducteur morse', 'code morse', 'alphabet morse', 'sos', 'morse decoder'] 
    },
    inputs: [{ name: 'text', label: 'Texte à traduire', type: 'text', placeholder: 'SOS', required: true }],
    promptGenerator: (data) => `LOCAL:MORSE_ENCODE;;;${data.text}`
  },
  {
    id: 'password-gen',
    title: 'Générateur Mots de Passe',
    description: 'Créez des mots de passe incassables.',
    category: 'Security',
    cost: 1,
    isPremium: false,
    iconName: 'Key',
    outputType: 'text',
    seo: { 
      title: 'Générateur de Mot de Passe Fort & Sécurisé (Random)', 
      description: 'Générez des mots de passe aléatoires complexes et sécurisés. Protégez vos comptes contre le piratage.', 
      keywords: ['mot de passe sécurisé', 'password generator', 'sécurité informatique', 'générateur mdp'] 
    },
    inputs: [{ name: 'length', label: 'Longueur', type: 'number', placeholder: '12', required: true }],
    promptGenerator: (data) => `LOCAL:PASSWORD_GEN;;;${data.length || 12}`
  },
  {
    id: 'json-formatter',
    title: 'Formateur JSON',
    description: 'Validez et embellissez votre code JSON.',
    category: 'Dev',
    cost: 1,
    isPremium: false,
    iconName: 'Braces',
    outputType: 'text',
    seo: { 
      title: 'Validateur & Formateur JSON en Ligne (JSON Prettify)', 
      description: 'Outil pour indenter, valider et formater du code JSON malpropre. Indispensable pour les développeurs.', 
      keywords: ['json formatter', 'json validator', 'prettify json', 'outil dev', 'json viewer'] 
    },
    inputs: [{ name: 'json', label: 'JSON Brut', type: 'textarea', rows: 10, className: 'font-mono text-xs', required: true }],
    promptGenerator: (data) => `LOCAL:JSON_FORMAT;;;${data.json}`
  },
  {
    id: 'uuid-gen',
    title: 'Générateur UUID',
    description: 'Créez des identifiants uniques (v4).',
    category: 'Dev',
    cost: 1,
    isPremium: false,
    iconName: 'Fingerprint',
    outputType: 'text',
    seo: { 
      title: 'Générateur UUID v4 En Ligne - Professionnel (GUID)', 
      description: 'Générez des GUID/UUID version 4 uniques pour vos bases de données et applications. Génération côté client.', 
      keywords: ['uuid generator', 'guid', 'identifiant unique', 'v4', 'uuid online'] 
    },
    inputs: [{ name: 'dummy', label: 'Générer', type: 'text', placeholder: 'Cliquez sur générer', required: false }],
    promptGenerator: () => `LOCAL:UUID_GEN;;;ignored`
  },
  {
    id: 'slug-gen',
    title: 'Générateur de Slug',
    description: 'Optimisez vos URLs pour le SEO.',
    category: 'Dev',
    cost: 1,
    isPremium: false,
    iconName: 'Link',
    outputType: 'text',
    seo: { 
      title: 'Générateur de Slug URL SEO Friendly - Clean Link', 
      description: 'Transformez un titre d\'article en URL propre (slug) optimisée pour le référencement Google. Supprime les accents et caractères spéciaux.', 
      keywords: ['slug generator', 'url cleaner', 'seo url', 'clean link', 'url slugify'] 
    },
    inputs: [{ name: 'text', label: 'Titre à convertir', type: 'text', placeholder: 'Mon Super Article de Blog !', required: true }],
    promptGenerator: (data) => `LOCAL:SLUG_GEN;;;${data.text}`
  },
  {
    id: 'px-to-rem',
    title: 'Pixel vers REM',
    description: 'Convertisseur d\'unités CSS.',
    category: 'Dev',
    cost: 1,
    isPremium: false,
    iconName: 'Ruler',
    outputType: 'text',
    seo: { 
      title: 'Convertisseur PX vers REM (CSS) - Calculateur Web', 
      description: 'Outil pour convertir les pixels en REM. Indispensable pour l\'intégration web responsive et accessible.', 
      keywords: ['px to rem', 'convertisseur css', 'unités css', 'web dev', 'calculateur rem'] 
    },
    inputs: [{ name: 'px', label: 'Valeur en Pixels (px)', type: 'number', placeholder: '16', required: true }],
    promptGenerator: (data) => `LOCAL:PX_TO_REM;;;${data.px}`
  },
  {
    id: 'roi-calc',
    title: 'Calculatrice ROI',
    description: 'Estimez la rentabilité de vos projets.',
    category: 'Business',
    cost: 1,
    isPremium: false,
    iconName: 'TrendingUp',
    outputType: 'text',
    seo: { 
      title: 'Calculatrice ROI Marketing (Retour sur Investissement)', 
      description: 'Calculez facilement le ROI de vos campagnes publicitaires ou investissements. Outil professionnel pour entrepreneurs.', 
      keywords: ['calcul roi', 'retour sur investissement', 'rentabilité', 'marketing', 'formule roi'] 
    },
    inputs: [
        { name: 'invest', label: 'Coût Investissement (€)', type: 'number', required: true },
        { name: 'gain', label: 'Revenu Généré (€)', type: 'number', required: true }
    ],
    promptGenerator: (data) => `LOCAL:ROI_CALC;;;${data.invest};;;${data.gain}`
  },
  {
    id: 'freelance-calc',
    title: 'Simulateur TJM Freelance',
    description: 'Convertissez votre TJM en salaire net.',
    category: 'Business',
    cost: 1,
    isPremium: false,
    iconName: 'Briefcase',
    outputType: 'text',
    seo: { 
      title: 'Simulateur TJM Freelance vers Salaire Net (Auto-Entrepreneur)', 
      description: 'Combien gagne un freelance ? Convertissez votre TJM (Taux Journalier) en salaire net mensuel estimé.', 
      keywords: ['simulateur tjm', 'salaire freelance', 'calcul tjm', 'auto-entrepreneur', 'revenu net freelance'] 
    },
    inputs: [{ name: 'tjm', label: 'Votre TJM (€/jour)', type: 'number', placeholder: '350', required: true }],
    promptGenerator: (data) => `LOCAL:FREELANCE_CALC;;;${data.tjm}`
  },
  {
    id: 'base64-tool',
    title: 'Encodeur Base64',
    description: 'Encodez et décodez du texte instantanément.',
    category: 'Dev',
    cost: 1,
    isPremium: false,
    iconName: 'Binary',
    outputType: 'text',
    seo: { 
      title: 'Encodeur Décodeur Base64 en Ligne - Professionnel',
      description: 'Encodez du texte en Base64 ou décodez du Base64 en texte lisible. Outil professionnel et sécurisé.',
      keywords: ['base64 encode', 'base64 decode', 'convertisseur base64', 'chiffrage texte'] 
    },
    inputs: [{ name: 'text', label: 'Texte à traiter', type: 'textarea', rows: 5, className: 'font-mono', required: true }],
    promptGenerator: (data) => `LOCAL:BASE64;;;${data.text}`
  },
  {
    id: 'text-analyzer',
    title: 'Analyseur de Texte',
    description: 'Compteur de mots, caractères et temps de lecture.',
    category: 'Text',
    cost: 1,
    isPremium: false,
    iconName: 'AlignLeft',
    outputType: 'text',
    seo: { 
      title: 'Compteur de Mots & Caractères - Analyseur de Texte Professionnel', 
      description: 'Analysez la longueur de votre texte. Nombre de mots, signes, et temps de lecture estimé pour le SEO.', 
      keywords: ['compteur mots', 'compteur caractères', 'analyse texte', 'statistiques texte', 'nombre de mots'] 
    },
    inputs: [{ name: 'text', label: 'Votre texte', type: 'textarea', rows: 8, required: true }],
    promptGenerator: (data) => `LOCAL:TEXT_STATS;;;${data.text}`
  },
  {
    id: 'decision-maker',
    title: 'Le Décideur',
    description: 'Laissez le hasard choisir pour vous.',
    category: 'Life',
    cost: 1,
    isPremium: false,
    iconName: 'Dices',
    outputType: 'text',
    seo: { 
      title: 'Décideur Aléatoire En Ligne - Faire un Choix au Hasard', 
      description: 'Indécis ? Entrez vos options et laissez l\'algorithme choisir pour vous. Pile ou face avancé.', 
      keywords: ['faire un choix', 'random picker', 'roulette décision', 'hasard', 'choisir pour moi'] 
    },
    inputs: [{ name: 'choices', label: 'Choix (séparés par des virgules)', type: 'text', placeholder: 'Pizza, Sushi, Burger', required: true }],
    promptGenerator: (data) => `LOCAL:DECISION_MAKER;;;${data.choices}`
  },

  // --- AI TOOLS (Restants utiles/Fun - Passés à 1 Crédit) ---
  createSimpleTool(
    'emoji-translator', 
    'Traducteur Emojis', 
    'Transforme le texte en une suite d\'emojis.', 
    'Life', 
    'Réécris cette phrase UNIQUEMENT avec des emojis (pas de texte, sois créatif) :', 
    'Smile', 'text', { placeholder: 'Ex: Je vais à la plage' }, 
    { title: 'Traducteur Texte vers Emojis - Professionnel', description: 'Convertir des phrases en emojis. Fun pour les réseaux sociaux.', keywords: ['traducteur emoji', 'emoji maker', 'texte en emoji'] }, 
    1
  ),
  createSimpleTool(
    'hashtag-gen', 
    'Générateur Hashtags', 
    'Boostez votre visibilité sur Insta/TikTok.', 
    'Business', 
    'Donne-moi une liste de 15 hashtags viraux, pertinents et populaires pour ce sujet (séparés par des espaces) :', 
    'Hash', 'text', { placeholder: 'Sujet du post' }, 
    { title: 'Générateur de Hashtags Instagram & TikTok', description: 'Trouvez les meilleurs hashtags pour avoir plus de likes et de vues. Boostez votre visibilité.', keywords: ['hashtags instagram', 'générateur hashtags', 'tags tiktok', 'hashtags populaires'] }, 
    1
  ),
  createSimpleTool(
    'sql-builder', 
    'Générateur SQL', 
    'Transformez une demande en requête SQL parfaite.', 
    'Dev', 
    'Tu es un expert SQL. Écris UNIQUEMENT la requête SQL pour cette demande (PostgreSQL/MySQL) :', 
    'Database', 'textarea', { rows: 3, className: 'font-mono', placeholder: 'Ex: Sélectionne tous les utilisateurs premium inscrits en 2024' },
    { title: 'Générateur de Requêtes SQL via IA - Text to SQL', description: 'Écrivez du SQL sans connaître le code. Convertisseur Texte vers SQL instantané.', keywords: ['générateur sql', 'text to sql', 'requête sql', 'aide sql', 'mysql query generator'] },
    1
  ),
  createSimpleTool(
    'grammar-fixer', 
    'Correcteur & Style', 
    'Corrigez les fautes et améliorez la tournure.', 
    'Text', 
    'Agis comme un correcteur professionnel (Bescherelle). Corrige l\'orthographe, la grammaire et améliore le style de ce texte. Donne UNIQUEMENT la version corrigée :', 
    'PenTool', 'textarea', { rows: 6 },
    { title: 'Correcteur Orthographe & Grammaire IA - Professionnel', description: 'Reformulation et correction de texte par IA. Mieux qu\'un correcteur classique, améliore aussi le style.', keywords: ['correcteur orthographe', 'reformuler texte', 'grammaire', 'sans faute', 'bon patron'] },
    1
  ),
  createSimpleTool(
    'eli5', 
    'Explique comme à un enfant', 
    'Comprenez n\'importe quel concept complexe.', 
    'Text', 
    'Explique ce concept complexe avec des mots très simples et une analogie, comme si tu parlais à un enfant de 5 ans (ELI5) :', 
    'Baby', 'text', { placeholder: 'Ex: La physique quantique' },
    { title: 'Vulgarisation IA - Explique-moi simplement (ELI5)', description: 'Comprendre des sujets difficiles grâce à des explications simplifiées (ELI5).', keywords: ['vulgarisation', 'expliquer simplement', 'eli5 français', 'apprendre', 'comprendre facile'] },
    1
  ),
  createSimpleTool(
    'bio-gen', 
    'Générateur Bio Social', 
    'Des bios percutantes pour Tinder, Insta ou Twitter.', 
    'Life', 
    'Rédige 3 options de biographie courtes, drôles et engageantes (avec emojis) pour ce profil :', 
    'User', 'textarea', { rows: 3, placeholder: 'Vos hobbies, job, passion...' },
    { title: 'Générateur de Bio Instagram & Tinder - Professionnel', description: 'Créez le profil parfait pour vos réseaux sociaux. Idées de bio originales et bios Tinder qui matchent.', keywords: ['bio instagram', 'bio tinder', 'profil linkedin', 'description profil', 'phrase d\'accroche'] },
    1
  ),
  createSimpleTool(
    'youtube-title-gen', 
    'Générateur Titres YouTube', 
    'Des titres viraux et clickbait pour vos vidéos.', 
    'Business', 
    'Liste 10 titres viraux, accrocheurs et optimisés pour le taux de clic (CTR) pour une vidéo sur ce sujet :', 
    'Video', 'text', { placeholder: 'Sujet de la vidéo' },
    { title: 'Générateur de Titres YouTube Viraux', description: 'Idées de titres pour faire plus de vues. Optimisé pour le CTR et l\'algorithme YouTube.', keywords: ['titre youtube', 'idées vidéo', 'clickbait generator', 'titre viral', 'youtube seo'] },
    1
  ),
  createSimpleTool(
    'linkedin-post-gen', 
    'Post LinkedIn Viral', 
    'Rédigez des posts engageants pour LinkedIn.', 
    'Business', 
    'Rédige un post LinkedIn viral, aéré, avec une accroche forte (hook) et un appel à l\'action (CTA) sur ce sujet :', 
    'Linkedin', 'textarea', { rows: 6 },
    { title: 'Générateur de Post LinkedIn IA - Copywriting', description: 'Écrivez des posts LinkedIn qui font réagir. Copywriting automatique pour l\'engagement.', keywords: ['post linkedin', 'générateur contenu', 'copywriting linkedin', 'post viral'] },
    1
  ),
  createSimpleTool(
    'excel-formula-explainer', 
    'Gourou Excel', 
    'Obtenez la formule Excel dont vous avez besoin.', 
    'Business', 
    'Tu es un expert Excel MVP. Donne-moi la formule Excel (compatible Google Sheets) pour faire ça. Explique-la brièvement :', 
    'Table', 'textarea', { rows: 4 },
    { title: 'Générateur de Formule Excel & Google Sheets - Professionnel', description: 'Décrivez ce que vous voulez faire, l\'IA vous donne la formule Excel complexe instantanément.', keywords: ['aide excel', 'formule excel', 'google sheets', 'tableur', 'vlookup help'] },
    1
  ),
  createSimpleTool(
    'readme-gen', 
    'Générateur README', 
    'Documentation GitHub pro en quelques secondes.', 
    'Dev', 
    'Génère un fichier README.md professionnel et structuré (Titres, Badges, Install, Usage) pour ce projet :', 
    'FileText', 'textarea', { rows: 6 },
    { title: 'Générateur README Markdown GitHub', description: 'Créez la documentation parfaite pour vos projets de code. Template README.md automatique.', keywords: ['readme generator', 'markdown', 'documentation github', 'open source'] },
    1
  ),
  createSimpleTool(
    'bug-fixer', 
    'Debuggeur IA', 
    'Trouvez et corrigez les bugs dans votre code.', 
    'Dev', 
    'Analyse ce code, trouve l\'erreur et donne UNIQUEMENT la version corrigée avec un court commentaire explicatif :', 
    'Bug', 'textarea', { rows: 10, className: 'font-mono text-xs' },
    { title: 'Débuggeur de Code en Ligne - Correction IA', description: 'Trouvez pourquoi votre code plante. Correction de bugs Python, JS, PHP, C++.', keywords: ['debug code', 'corriger erreur', 'aide programmation', 'fix code'] },
    1
  ),
  createSimpleTool(
    'password-strength', 
    'Test Mots de Passe (IA)', 
    'Analysez la force de vos mots de passe.', 
    'Security', 
    'Analyse la sécurité de ce mot de passe. Est-il fort ? Combien de temps pour le cracker ? (Ne le stocke pas) :', 
    'Lock', 'text', { className: 'font-mono' },
    { title: 'Testeur de Mot de Passe IA - Vérification Sécurité', description: 'Vérifiez si votre mot de passe est piratable et combien de temps il faudrait pour le casser.', keywords: ['test mot de passe', 'sécurité mdp', 'password strength', 'how secure is my password'] },
    1
  ),
  createSimpleTool(
    'excuse-gen', 
    'Générateur d\'Excuses', 
    'L\'excuse parfaite pour annuler au dernier moment.', 
    'Life', 
    'Invente une excuse crédible, polie mais ferme pour annuler cet événement :', 
    'Ghost', 'text', { placeholder: 'Annuler quoi ?' },
    { title: 'Générateur d\'Excuses Bidons - Annuler RDV', description: 'Besoin d\'annuler ? Trouvez l\'excuse parfaite générée par IA pour ne pas y aller.', keywords: ['excuse annulation', 'générateur excuse', 'pas envie', 'annuler soirée'] },
    1
  ),
  createSimpleTool(
    'passive-aggressive', 
    'Traducteur Corpo', 
    'Dites-le méchamment, mais poliment (Email Pro).', 
    'Business', 
    'Réécris cette phrase en langage "Corporate" professionnel mais avec un ton passif-agressif subtil :', 
    'Briefcase', 'textarea', { rows: 3, placeholder: 'Tu me saoules...' },
    { title: 'Traducteur Langage Corporate - Email Passif Agressif', description: 'Transformez vos insultes en emails professionnels courtois. L\'art de la diplomatie de bureau.', keywords: ['mail pro', 'langage corporate', 'rédaction mail', 'traducteur chef'] },
    1
  ),
  createSimpleTool(
    'rap-lyrics', 
    'Parolier de Rap', 
    'Génère des lyrics et des rimes lourdes.', 
    'Life', 
    'Comporte-toi comme un rappeur français célèbre. Écris un couplet de 16 mesures (avec rimes multisyllabiques) sur le sujet :', 
    'Mic', 'text', { placeholder: 'Sujet du rap' },
    { title: 'Générateur de Rap & Rimes - Paroles IA', description: 'Écrivez des textes de rap comme un pro. Rimes, punchlines et flow inclus.', keywords: ['rap generator', 'écrire rap', 'générateur rimes', 'parolier ia'] },
    1
  ),

  // Image Tools
  {
    id: 'logo-creator',
    title: 'Générateur Logo',
    description: 'Logos vectoriels minimalistes par IA.',
    category: 'Image',
    cost: 2,
    isPremium: true,
    iconName: 'Hexagon',
    outputType: 'image',
    seo: { 
      title: 'Créateur de Logo IA - Design Vectoriel & Moderne', 
      description: 'Générez des logos uniques pour votre startup ou projet. Style vectoriel, propre et professionnel.', 
      keywords: ['logo maker', 'générateur logo ia', 'création logo', 'design professionnel', 'logo vectoriel'] 
    },
    inputs: [{ name: 'desc', label: 'Nom et description du logo', type: 'text', required: true }],
    promptGenerator: (data) => `Vector logo for ${data.desc}. Minimalist, flat, vector art, white background, high quality.`
  },
  {
    id: 'wallpaper-gen',
    title: 'Fond d\'Écran 4K',
    description: 'Wallpapers artistiques uniques.',
    category: 'Image',
    cost: 2,
    isPremium: true,
    iconName: 'Monitor',
    outputType: 'image',
    seo: { 
      title: 'Générateur de Fond d\'Écran 4K IA - Wallpaper HD', 
      description: 'Créez votre propre wallpaper PC ou Mobile. Art unique généré par intelligence artificielle en haute définition.', 
      keywords: ['fond d\'écran 4k', 'wallpaper generator', 'art ia', 'background', 'fond écran pc'] 
    },
    inputs: [{ name: 'style', label: 'Décrivez votre fond d\'écran idéal', type: 'text', required: true }],
    promptGenerator: (data) => `4k abstract wallpaper: ${data.style}. High quality, detailed, masterpiece, vibrant colors.`
  },
  // --- GÉNÉRATEUR DE CV ---
  {
    id: 'cv-generator',
    title: 'Générateur de CV',
    description: 'Créez un CV professionnel optimisé et structuré en quelques secondes.',
    category: 'Life',
    cost: 2,
    isPremium: false,
    iconName: 'FileText',
    outputType: 'text',
    seo: {
      title: 'Générateur de CV IA - Créer un CV Professionnel',
      description: 'Générez un CV optimisé et professionnel avec l\'IA. Adapté à tous les secteurs et postes. Format structuré et prêt à l\'emploi.',
      keywords: ['générateur cv', 'créer cv', 'cv ia', 'cv professionnel', 'curriculum vitae', 'modèle cv', 'cv optimisé']
    },
    inputs: [
      {
        name: 'poste',
        label: 'Poste visé',
        type: 'text',
        placeholder: 'Ex: Développeur Full Stack, Chef de Projet, Commercial...',
        required: true,
        helpText: 'Le poste pour lequel vous postulez'
      },
      {
        name: 'experiences',
        label: 'Expériences professionnelles',
        type: 'textarea',
        rows: 6,
        placeholder: 'Listez vos expériences (poste, entreprise, dates, missions principales). Ex: Développeur Web - TechCorp (2020-2023) - Développement d\'applications React...',
        required: true,
        helpText: 'Décrivez vos expériences professionnelles avec dates et missions'
      },
      {
        name: 'formations',
        label: 'Formations (Optionnel)',
        type: 'textarea',
        rows: 3,
        placeholder: 'Ex: Master Informatique - Université Paris (2018-2020)',
        required: false
      },
      {
        name: 'competences',
        label: 'Compétences clés (Optionnel)',
        type: 'text',
        placeholder: 'Ex: React, Node.js, Python, Gestion d\'équipe...',
        required: false
      }
    ],
    promptGenerator: (data) => `${SYSTEM_PROMPT}
TÂCHE: Génère un CV professionnel complet et optimisé au format Markdown.

POSTE VISÉ: "${data.poste}"
EXPÉRIENCES: "${data.experiences}"
FORMATIONS: ${data.formations ? `"${data.formations}"` : 'Non spécifiées'}
COMPÉTENCES: ${data.competences ? `"${data.competences}"` : 'À déterminer selon les expériences'}

FORMAT ATTENDU (Markdown structuré):
# CURRICULUM VITAE

## [Nom Prénom]
[Email] | [Téléphone] | [Localisation] | [LinkedIn/Portfolio]

---

## PROFIL PROFESSIONNEL
[2-3 phrases accrocheuses résumant le profil et l'objectif professionnel]

---

## EXPÉRIENCES PROFESSIONNELLES

### [Poste] - [Entreprise]
**[Période]**
- [Mission 1]
- [Mission 2]
- [Mission 3]

[Format identique pour chaque expérience]

---

## FORMATIONS

### [Diplôme] - [Établissement]
**[Années]**
[Détails pertinents]

---

## COMPÉTENCES

**Techniques:** [Liste des compétences techniques]
**Transversales:** [Soft skills]

---

## LANGUES / CERTIFICATIONS (si applicable)

[Langues avec niveau] | [Certifications]

---

INSTRUCTIONS:
- Structure claire et professionnelle
- Mise en avant des réalisations concrètes
- Adaptation au poste visé
- Format prêt à être copié dans Word/PDF
- Utilise des puces pour les missions
- Sois précis et concis`
  },
  // --- GÉNÉRATEUR DE FACTURE ---
  {
    id: 'invoice-generator',
    title: 'Générateur de Facture',
    description: 'Créez des factures professionnelles conformes en quelques clics.',
    category: 'Business',
    cost: 1,
    isPremium: false,
    iconName: 'Receipt',
    outputType: 'text',
    seo: {
      title: 'Générateur de Facture IA - Créer une Facture Professionnelle',
      description: 'Générez des factures professionnelles conformes avec l\'IA. Format standard, prêt à imprimer ou envoyer par email.',
      keywords: ['générateur facture', 'créer facture', 'facture professionnelle', 'modèle facture', 'facture auto-entrepreneur', 'facture pdf']
    },
    inputs: [
      {
        name: 'emetteur',
        label: 'Informations émetteur (Votre entreprise)',
        type: 'textarea',
        rows: 4,
        placeholder: 'Nom/Raison sociale\nAdresse complète\nSIRET\nEmail\nTéléphone',
        required: true,
        helpText: 'Vos informations d\'entreprise ou auto-entrepreneur'
      },
      {
        name: 'client',
        label: 'Informations client',
        type: 'textarea',
        rows: 3,
        placeholder: 'Nom/Raison sociale\nAdresse\nEmail',
        required: true
      },
      {
        name: 'services',
        label: 'Services/Prestations',
        type: 'textarea',
        rows: 6,
        placeholder: 'Description | Quantité | Prix unitaire HT\nEx: Développement site web | 1 | 1500€\nEx: Maintenance mensuelle | 3 | 200€',
        required: true,
        helpText: 'Listez chaque prestation avec description, quantité et prix unitaire HT'
      },
      {
        name: 'numero',
        label: 'Numéro de facture (Optionnel)',
        type: 'text',
        placeholder: 'Ex: FACT-2024-001',
        required: false
      },
      {
        name: 'date',
        label: 'Date de facturation (Optionnel)',
        type: 'text',
        placeholder: 'Ex: 15/01/2024',
        required: false
      },
      {
        name: 'tva',
        label: 'Taux de TVA (Optionnel)',
        type: 'text',
        placeholder: 'Ex: 20% ou 0% (auto-entrepreneur)',
        required: false,
        helpText: 'Laissez vide si vous ne facturez pas de TVA'
      }
    ],
    promptGenerator: (data) => `${SYSTEM_PROMPT}
TÂCHE: Génère une facture professionnelle complète et conforme au format Markdown.

ÉMETTEUR:
${data.emetteur}

CLIENT:
${data.client}

SERVICES/PRESTATIONS:
${data.services}

NUMÉRO FACTURE: ${data.numero || 'À générer automatiquement'}
DATE: ${data.date || new Date().toLocaleDateString('fr-FR')}
TVA: ${data.tva || 'Non applicable'}

FORMAT ATTENDU (Markdown structuré):
# FACTURE

**Numéro:** [NUMÉRO]
**Date:** [DATE]
**Date d'échéance:** [DATE + 30 jours]

---

## ÉMETTEUR
[Nom/Raison sociale]
[Adresse complète]
SIRET: [SIRET]
Email: [Email]
Téléphone: [Téléphone]

---

## CLIENT
[Nom/Raison sociale]
[Adresse]
Email: [Email]

---

## DÉTAIL DES PRESTATIONS

| Description | Quantité | Prix unitaire HT | Total HT |
|-------------|----------|------------------|----------|
| [Service 1] | [Qty] | [Prix] € | [Total] € |
| [Service 2] | [Qty] | [Prix] € | [Total] € |

---

## TOTAL

**Sous-total HT:** [Total HT] €
${data.tva ? `**TVA (${data.tva}):** [Montant TVA] €` : ''}
**TOTAL TTC:** [Total TTC] €

---

## CONDITIONS DE PAIEMENT

**Mode de paiement:** [Virement bancaire / Chèque / ...]
**Date d'échéance:** [Date]
**IBAN:** [À compléter]

---

**Merci de votre confiance !**

INSTRUCTIONS:
- Format professionnel et lisible
- Calculs automatiques (Total HT, TVA si applicable, Total TTC)
- Tableau clair pour les prestations
- Conforme aux standards français
- Prêt à être copié dans Word/PDF
- Inclure toutes les mentions légales nécessaires`
  },

  // --- NOUVEAUX OUTILS COOL ---
  {
    id: 'recipe-generator',
    title: 'Générateur de Recettes',
    description: 'Créez des recettes personnalisées selon vos ingrédients.',
    category: 'Life',
    cost: 1,
    isPremium: false,
    iconName: 'ChefHat',
    outputType: 'text',
    seo: {
      title: 'Générateur de Recette de Cuisine IA - Recettes Personnalisées',
      description: 'Générez des recettes de cuisine originales selon vos ingrédients disponibles. Idées de plats faciles et gourmands.',
      keywords: ['générateur recette', 'recette cuisine', 'idées repas', 'recette avec ingrédients', 'cuisine ia']
    },
    inputs: [
      { name: 'ingredients', label: 'Ingrédients disponibles', type: 'textarea', rows: 4, placeholder: 'Ex: Poulet, Riz, Tomates, Ail, Basilic...', required: true },
      { name: 'diet', label: 'Régime alimentaire (Optionnel)', type: 'text', placeholder: 'Ex: Végétarien, Sans gluten, Keto...', required: false }
    ],
    promptGenerator: (data) => `${SYSTEM_PROMPT}
TÂCHE: Génère une recette de cuisine complète et détaillée en Markdown.

INGRÉDIENTS DISPONIBLES: "${data.ingredients}"
RÉGIME: ${data.diet || 'Aucune restriction'}

FORMAT ATTENDU:
# [NOM DE LA RECETTE]

## 🍽️ Ingrédients
- [Liste avec quantités précises]

## ⏱️ Temps de préparation
- Préparation: [X] min
- Cuisson: [X] min
- Total: [X] min

## 👨‍🍳 Étapes de préparation
1. [Étape détaillée]
2. [Étape détaillée]
...

## 💡 Astuces
[Conseils pour réussir la recette]

## 📊 Informations nutritionnelles (optionnel)
- Calories: ~[X] kcal
- Portions: [X] personnes`
  },
  {
    id: 'cover-letter-gen',
    title: 'Générateur Lettre de Motivation',
    description: 'Rédigez une lettre de motivation percutante en quelques secondes.',
    category: 'Life',
    cost: 2,
    isPremium: false,
    iconName: 'Mail',
    outputType: 'text',
    seo: {
      title: 'Générateur de Lettre de Motivation IA - Modèle Professionnel',
      description: 'Créez une lettre de motivation personnalisée et convaincante pour votre candidature. Format professionnel et adapté au poste.',
      keywords: ['lettre motivation', 'générateur lettre', 'candidature', 'cv lettre', 'modèle lettre motivation']
    },
    inputs: [
      { name: 'poste', label: 'Poste visé', type: 'text', placeholder: 'Ex: Développeur Full Stack', required: true },
      { name: 'entreprise', label: 'Nom de l\'entreprise', type: 'text', placeholder: 'Ex: TechCorp', required: true },
      { name: 'competences', label: 'Vos compétences clés', type: 'textarea', rows: 4, placeholder: 'Ex: React, Node.js, Gestion de projet...', required: true },
      { name: 'experience', label: 'Expérience pertinente (Optionnel)', type: 'textarea', rows: 3, placeholder: 'Ex: 3 ans en développement web...', required: false }
    ],
    promptGenerator: (data) => `${SYSTEM_PROMPT}
TÂCHE: Rédige une lettre de motivation professionnelle et personnalisée en Markdown.

POSTE VISÉ: "${data.poste}"
ENTREPRISE: "${data.entreprise}"
COMPÉTENCES: "${data.competences}"
EXPÉRIENCE: ${data.experience || 'À adapter selon le profil'}

FORMAT ATTENDU:
[Votre Nom]
[Adresse]
[Email] | [Téléphone]
[Date]

[Entreprise]
[Adresse entreprise]

Objet: Candidature pour le poste de [POSTE]

Madame, Monsieur,

[Paragraphe 1: Accroche et présentation]
[Paragraphe 2: Pourquoi cette entreprise]
[Paragraphe 3: Vos compétences et expérience]
[Paragraphe 4: Motivation et disponibilité]

Je reste à votre disposition pour un entretien.

Cordialement,
[Signature]

INSTRUCTIONS:
- Ton professionnel mais chaleureux
- Adaptation à l'entreprise et au poste
- Mise en avant des compétences pertinentes
- Longueur: 1 page maximum
- Format prêt à être copié dans Word`
  },
  createSimpleTool(
    'slogan-generator',
    'Générateur de Slogans',
    'Trouvez le slogan parfait pour votre marque ou campagne.',
    'Business',
    'Génère 10 slogans accrocheurs, mémorables et viraux pour cette marque/produit. Sois créatif, utilise des jeux de mots si possible :',
    'Megaphone',
    'text',
    { placeholder: 'Ex: Une marque de café bio éthique' },
    { title: 'Générateur de Slogan Publicitaire IA - Créer un Slogan', description: 'Trouvez le slogan parfait pour votre marque, produit ou campagne marketing. Idées créatives et mémorables.', keywords: ['générateur slogan', 'créer slogan', 'slogan publicitaire', 'tagline generator', 'slogan marque'] },
    1
  ),
  createSimpleTool(
    'quiz-generator',
    'Générateur de Quiz',
    'Créez des quiz interactifs pour vos cours ou formations.',
    'Business',
    'Génère un quiz complet (10 questions) avec 4 options de réponse chacune sur ce sujet. Inclus les bonnes réponses à la fin :',
    'HelpCircle',
    'textarea',
    { rows: 3, placeholder: 'Ex: Histoire de France, Python, Marketing Digital...' },
    { title: 'Générateur de Quiz IA - Créer un Quiz Interactif', description: 'Créez des quiz éducatifs avec questions et réponses. Parfait pour les formateurs et enseignants.', keywords: ['générateur quiz', 'créer quiz', 'questions quiz', 'quiz éducatif', 'test connaissances'] },
    1
  ),
  createSimpleTool(
    'poem-generator',
    'Générateur de Poèmes',
    'Écrivez des poèmes sur n\'importe quel thème.',
    'Life',
    'Écris un poème original et émotionnel (3-4 strophes) sur ce thème. Utilise des rimes et un style poétique classique ou moderne :',
    'Feather',
    'text',
    { placeholder: 'Ex: L\'amour, La nature, La solitude...' },
    { title: 'Générateur de Poème IA - Écrire un Poème', description: 'Créez des poèmes originaux sur n\'importe quel thème. Style classique ou moderne, avec rimes.', keywords: ['générateur poème', 'écrire poème', 'poésie ia', 'poème automatique', 'vers poétique'] },
    1
  ),
  {
    id: 'workout-generator',
    title: 'Générateur de Programme Sport',
    description: 'Créez un programme d\'entraînement personnalisé.',
    category: 'Life',
    cost: 1,
    isPremium: false,
    iconName: 'Dumbbell',
    outputType: 'text',
    seo: {
      title: 'Générateur de Programme Sport IA - Plan d\'Entraînement',
      description: 'Créez un programme d\'entraînement personnalisé selon vos objectifs. Musculation, cardio, perte de poids.',
      keywords: ['programme sport', 'entraînement personnalisé', 'plan musculation', 'workout generator', 'fitness plan']
    },
    inputs: [
      { name: 'objectif', label: 'Objectif', type: 'text', placeholder: 'Ex: Perte de poids, Prise de masse, Endurance...', required: true },
      { name: 'niveau', label: 'Niveau', type: 'text', placeholder: 'Ex: Débutant, Intermédiaire, Avancé', required: true },
      { name: 'duree', label: 'Durée par séance (Optionnel)', type: 'text', placeholder: 'Ex: 30 min, 1h...', required: false },
      { name: 'equipement', label: 'Équipement disponible (Optionnel)', type: 'text', placeholder: 'Ex: Salle de sport, Maison, Poids libres...', required: false }
    ],
    promptGenerator: (data) => `${SYSTEM_PROMPT}
TÂCHE: Génère un programme d'entraînement complet et structuré en Markdown.

OBJECTIF: "${data.objectif}"
NIVEAU: "${data.niveau}"
DURÉE: ${data.duree || 'À adapter'}
ÉQUIPEMENT: ${data.equipement || 'Polyvalent'}

FORMAT ATTENDU:
# PROGRAMME D'ENTRAÎNEMENT

## 🎯 Objectif
[Objectif détaillé]

## 📅 Plan Hebdomadaire
**Lundi:** [Type d'entraînement]
**Mardi:** [Type d'entraînement]
...

## 💪 Détail des Exercices

### [Jour 1]
1. [Exercice] - [Séries] x [Reps] - [Repos]
2. [Exercice] - [Séries] x [Reps] - [Repos]
...

## ⚠️ Conseils
- [Conseil 1]
- [Conseil 2]

## 📊 Progression
[Comment progresser semaine après semaine]`
  },
  createSimpleTool(
    'story-instagram-gen',
    'Générateur Story Instagram',
    'Créez des stories engageantes avec des hooks viraux.',
    'Business',
    'Génère 5 idées de stories Instagram avec hooks accrocheurs, emojis et call-to-action pour ce sujet. Format court et visuel :',
    'Instagram',
    'text',
    { placeholder: 'Ex: Lancement nouveau produit, Astuce du jour...' },
    { title: 'Générateur de Story Instagram IA - Idées Stories', description: 'Créez des stories Instagram qui convertissent. Hooks viraux, emojis et CTA optimisés pour l\'engagement.', keywords: ['story instagram', 'générateur story', 'idées stories', 'instagram content', 'social media'] },
    1
  ),
  {
    id: 'domain-name-gen',
    title: 'Générateur Nom de Domaine',
    description: 'Trouvez des noms de domaine disponibles et mémorables.',
    category: 'Business',
    cost: 1,
    isPremium: false,
    iconName: 'Globe',
    outputType: 'text',
    seo: {
      title: 'Générateur de Nom de Domaine IA - Trouver un Domaine',
      description: 'Générez des idées de noms de domaine pour votre site web. Suggestions courtes, mémorables et disponibles.',
      keywords: ['générateur nom domaine', 'trouver domaine', 'idées domaine', 'nom site web', 'domaine disponible']
    },
    inputs: [
      { name: 'theme', label: 'Thème / Secteur', type: 'text', placeholder: 'Ex: E-commerce mode, Tech startup, Blog cuisine...', required: true },
      { name: 'extension', label: 'Extension préférée (Optionnel)', type: 'text', placeholder: 'Ex: .com, .fr, .io...', required: false }
    ],
    promptGenerator: (data) => `${SYSTEM_PROMPT}
TÂCHE: Génère 15 suggestions de noms de domaine créatifs et mémorables.

THÈME: "${data.theme}"
EXTENSION: ${data.extension || '.com (ou autres)'}

FORMAT ATTENDU:
# Suggestions de Noms de Domaine

## 🎯 Top 5 (Court & Mémorable)
1. [nom].${data.extension || 'com'}
2. [nom].${data.extension || 'com'}
...

## 💡 Alternatives Créatives
[5 autres suggestions avec variations]

## 🔤 Variations avec Mots-clés
[5 suggestions incluant des mots-clés du secteur]

## ✅ Critères de Sélection
- Court (moins de 15 caractères)
- Facile à épeler
- Mémorable
- Pas d'hyphens si possible
- Évite les chiffres

**Note:** Vérifiez la disponibilité sur un registrar (OVH, Namecheap, etc.)`
  },
  createSimpleTool(
    'tweet-viral-gen',
    'Générateur Tweet Viral',
    'Créez des tweets qui font exploser les likes et RT.',
    'Business',
    'Génère 5 tweets viraux, accrocheurs et optimisés pour Twitter/X sur ce sujet. Utilise des hooks, des questions, des stats si possible (max 280 caractères) :',
    'Twitter',
    'text',
    { placeholder: 'Ex: Astuce productivité, Opinion tech...' },
    { title: 'Générateur de Tweet Viral IA - Créer un Tweet', description: 'Créez des tweets qui génèrent de l\'engagement. Hooks viraux, questions et format optimisé pour Twitter/X.', keywords: ['générateur tweet', 'tweet viral', 'twitter content', 'créer tweet', 'engagement twitter'] },
    1
  ),
  {
    id: 'meal-plan-gen',
    title: 'Générateur Plan Repas',
    description: 'Créez un plan de repas hebdomadaire équilibré.',
    category: 'Life',
    cost: 1,
    isPremium: false,
    iconName: 'UtensilsCrossed',
    outputType: 'text',
    seo: {
      title: 'Générateur de Plan Repas IA - Menu Hebdomadaire',
      description: 'Créez un plan de repas hebdomadaire équilibré et varié. Idées de repas pour toute la semaine avec liste de courses.',
      keywords: ['plan repas', 'menu hebdomadaire', 'idées repas', 'meal prep', 'planning repas']
    },
    inputs: [
      { name: 'diet', label: 'Régime alimentaire', type: 'text', placeholder: 'Ex: Omnivore, Végétarien, Végétalien, Keto...', required: true },
      { name: 'budget', label: 'Budget approximatif (Optionnel)', type: 'text', placeholder: 'Ex: Économique, Moyen, Élevé', required: false },
      { name: 'personnes', label: 'Nombre de personnes', type: 'number', placeholder: '2', required: true }
    ],
    promptGenerator: (data) => `${SYSTEM_PROMPT}
TÂCHE: Génère un plan de repas hebdomadaire complet et équilibré en Markdown.

RÉGIME: "${data.diet}"
BUDGET: ${data.budget || 'Moyen'}
PERSONNES: ${data.personnes || 2}

FORMAT ATTENDU:
# PLAN DE REPAS HEBDOMADAIRE

## 📅 LUNDI
**Petit-déjeuner:** [Repas]
**Déjeuner:** [Repas]
**Dîner:** [Repas]

[Format identique pour chaque jour]

## 🛒 LISTE DE COURSES

### Fruits & Légumes
- [Ingrédient] - [Quantité]

### Protéines
- [Ingrédient] - [Quantité]

### Féculents
- [Ingrédient] - [Quantité]

### Épicerie
- [Ingrédient] - [Quantité]

## 💰 Budget estimé
~[X]€ pour ${data.personnes} personne(s)

## 💡 Astuces
- [Conseil meal prep]
- [Conseil conservation]`
  }
];
