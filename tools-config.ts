
import { ToolConfig } from './types';

// Fonction pour générer un slug français SEO-friendly
const createFrenchSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9\s-]/g, '') // Supprime les caractères spéciaux
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/-+/g, '-') // Remplace les tirets multiples par un seul
    .replace(/^-|-$/g, ''); // Supprime les tirets en début/fin
};

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
  slug: createFrenchSlug(title),
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
    slug: 'scanner-produit-ecommerce',
    title: 'Scanner Produit E-com',
    description: 'Studio complet de création de fiches produits. Analyse photo, génération IA, templates Shopify/Amazon, export CSV/JSON. Tout pour vendre plus vite !',
    category: 'Business',
    cost: 3,
    isPremium: false,
    iconName: 'ScanBarcode',
    outputType: 'text',
    seo: { 
      title: 'Générateur Fiche Produit via Photo - IA E-commerce', 
      description: 'Transformez une simple photo en fiche produit Shopify/Amazon optimisée SEO. Titre, description et marketing générés par l\'IA.', 
      keywords: ['fiche produit ia', 'shopify generator', 'description produit photo', 'e-commerce ai', 'dropshipping tool', 'amazon fba'] 
    },
    inputs: [
      { name: 'image', label: 'Photo du produit', type: 'file', accept: 'image/*', required: true, helpText: 'Même une photo amateur suffit. L\'IA analyse les détails visuels.' },
      { 
        name: 'platform', 
        label: 'Plateforme cible', 
        type: 'select', 
        options: ['Shopify', 'Amazon', 'WooCommerce', 'PrestaShop', 'Les deux (Shopify + Amazon)'],
        required: true,
        helpText: 'Choisissez la plateforme pour adapter le format'
      },
      { 
        name: 'niche', 
        label: 'Niche / Cible', 
        type: 'text', 
        placeholder: 'Ex: Sportifs, Parents, Luxe, Tech...', 
        required: true,
        helpText: 'Définit le ton et le style marketing'
      },
      { 
        name: 'priceRange', 
        label: 'Gamme de prix (€)', 
        type: 'select', 
        options: ['Moins de 20€', '20-50€', '50-100€', '100-200€', '200-500€', 'Plus de 500€'],
        required: false,
        helpText: 'Aide l\'IA à calibrer le positionnement'
      },
      { 
        name: 'competitors', 
        label: 'Concurrents principaux (Optionnel)', 
        type: 'text', 
        placeholder: 'Ex: Apple, Samsung, Xiaomi...', 
        required: false,
        helpText: 'Pour un positionnement différenciant'
      }
    ],
    promptGenerator: (data) => `${SYSTEM_PROMPT}
TÂCHE: Analyse cette image de produit comme un expert Copywriter E-commerce spécialisé ${data.platform || 'Shopify/Amazon'}.
CIBLE: ${data.niche || "Grand public"}
GAMME PRIX: ${data.priceRange || 'Non spécifiée'}
${data.competitors ? `CONCURRENTS: ${data.competitors}` : ''}

SORTIE ATTENDUE (Format Markdown structuré) :

## 📦 FICHE PRODUIT ${data.platform || 'E-COMMERCE'}

### 1. **TITRE SEO**
- Format ${data.platform === 'Amazon' ? 'Amazon (max 200 caractères)' : 'Shopify (max 80 caractères)'}
- Inclure : Marque (si visible), Type produit, Caractéristique principale
- Exemple format : "[Marque] [Produit] - [Bénéfice clé]"

### 2. **DESCRIPTION COURTE** (Meta Description)
- 2-3 phrases impactantes
- Appel à l'émotion + bénéfice principal
- ${data.platform === 'Amazon' ? 'Format Amazon (paragraphe court)' : 'Format Shopify (2-3 lignes)'}

### 3. **BULLET POINTS** (5 points max)
- Format : ${data.platform === 'Amazon' ? 'Amazon (5 points max, 200 caractères chacun)' : 'Shopify (5 points, format liste)'}
- Chaque point = 1 bénéfice/feature visible sur l'image
- Utiliser des verbes d'action

### 4. **DESCRIPTION LONGUE** (Storytelling)
- 3-4 paragraphes
- Parler au "vous"
- Inclure : Problème résolu, Expérience utilisateur, Garanties/Confiance

### 5. **MOTS-CLÉS SEO**
- 15-20 mots-clés pertinents
- Format : Liste séparée par virgules
- Inclure : Long tail keywords, Synonymes, Catégories

### 6. **ESTIMATION PRIX & POSITIONNEMENT**
- Prix suggéré basé sur l'analyse visuelle et la gamme ${data.priceRange || ''}
- Positionnement marché (Premium/Mid-range/Budget)
- Justification du prix

### 7. **TAGS & CATÉGORIES**
- Catégories principales (3-5)
- Tags secondaires (10-15)
- Format compatible ${data.platform || 'Shopify/Amazon'}

${data.platform === 'Amazon' ? `
### 8. **FORMAT AMAZON SPÉCIFIQUE**
- A+ Content suggestions (si applicable)
- Backend Search Terms (250 caractères max)
- Product Type & Browse Node suggestions
` : ''}

${data.platform === 'Shopify' ? `
### 8. **FORMAT SHOPIFY SPÉCIFIQUE**
- Product Type
- Vendor suggestion
- Tags format Shopify
- Collection suggestions
` : ''}

Génère maintenant la fiche complète.`
  },
  {
    id: 'website-generator',
    slug: 'generateur-site-web',
    title: 'Générateur Site Web',
    description: 'Créez des sites web complets avec éditeur visuel intégré. Aperçu en temps réel, export du code, et déploiement en un clic. Plus qu\'un simple générateur, un vrai studio web !',
    category: 'Dev',
    cost: 3,
    isPremium: false,
    iconName: 'Layout',
    outputType: 'text',
    seo: { 
      title: 'Générateur de Site Web IA - HTML/CSS/JS Professionnel', 
      description: 'Générez le code complet d\'une page web moderne, responsive et stylisée (Tailwind CSS) à partir d\'une simple description. Code propre et prêt à l\'emploi.', 
      keywords: ['générateur site web', 'créer site ia', 'code html css', 'landing page generator', 'webdesign ia', 'nocode'] 
    },
    inputs: [
      { 
        name: 'siteType', 
        label: 'Type de site', 
        type: 'select', 
        options: ['Landing Page', 'Portfolio', 'Blog', 'E-commerce', 'SaaS App', 'Corporate', 'Event', 'Autre'],
        required: true,
        helpText: 'Sélectionnez le type de site à générer'
      },
      { 
        name: 'primaryColor', 
        label: 'Couleur principale', 
        type: 'text', 
        placeholder: 'Ex: #6366f1 (bleu), #10b981 (vert)...', 
        required: false,
        helpText: 'Code couleur hexadécimal pour le thème'
      },
      { 
        name: 'companyName', 
        label: 'Nom / Titre', 
        type: 'text', 
        placeholder: 'Ex: MonApp, Mon Entreprise...', 
        required: true 
      },
      { 
        name: 'tagline', 
        label: 'Slogan / Sous-titre', 
        type: 'text', 
        placeholder: 'Ex: La solution qui change tout', 
        required: false 
      },
      { 
        name: 'desc', 
        label: 'Description détaillée', 
        type: 'textarea', 
        rows: 6, 
        placeholder: 'Décrivez le contenu, les fonctionnalités clés, le message à transmettre, les call-to-actions...', 
        required: true,
        helpText: 'Plus vous êtes précis, meilleur sera le résultat'
      },
      { 
        name: 'style', 
        label: 'Style visuel', 
        type: 'select', 
        options: ['Moderne & Minimaliste', 'Bold & Coloré', 'Élégant & Professionnel', 'Créatif & Artistique', 'Tech & Futuriste', 'Classique & Corporate', 'Dark Mode'],
        required: false,
        helpText: 'Style général du design'
      },
      { 
        name: 'sections', 
        label: 'Sections à inclure', 
        type: 'select', 
        options: ['Hero + Features + CTA', 'Hero + About + Services + Contact', 'Hero + Pricing + Testimonials + FAQ', 'Hero + Portfolio + Blog + Contact', 'Tout (recommandé)'],
        required: false,
        helpText: 'Structure de la page'
      }
    ],
    promptGenerator: (data) => {
      const styleGuide = data.style ? `\nSTYLE: ${data.style}` : '';
      const colorGuide = data.primaryColor ? `\nCOULEUR PRINCIPALE: ${data.primaryColor}` : '';
      const sectionsList = data.sections ? `\nSECTIONS: ${data.sections}` : '';
      const taglineText = data.tagline ? `\nTAGLINE: ${data.tagline}` : '';
      
      return `${SYSTEM_PROMPT}
TÂCHE: Code une page web HTML complète, moderne et professionnelle.

TYPE DE SITE: ${data.siteType}
NOM: ${data.companyName}${taglineText}
DESCRIPTION: ${data.desc}${styleGuide}${colorGuide}${sectionsList}

RÈGLES STRICTES (RESPECTE-LES) :

1. **HTML5 COMPLET** : <!DOCTYPE html>, <html lang="fr">, <head> avec meta (viewport, charset, title="${data.companyName}"), <body>

2. **TAILWIND CSS** : <script src="https://cdn.tailwindcss.com"></script> dans <head>

3. **RESPONSIVE** : Mobile-first avec md: et lg: breakpoints. Testé sur mobile, tablette, desktop.

4. **STRUCTURE OPTIMISÉE** :
   - Hero section (impact visuel fort avec ${data.tagline || 'slogan'})
   - Features/Services (3-4 items avec icônes)
   - Section supplémentaire selon type (About, Pricing, Portfolio, etc.)
   - CTA section (call-to-action clair)
   - Footer simple (liens, copyright)

5. **COULEURS** : Utilise ${data.primaryColor || 'une palette cohérente'} comme couleur principale. Gradients modernes si approprié.

6. **IMAGES** : Utilise https://placehold.co/ avec des couleurs harmonieuses. Format: https://placehold.co/800x600/[COULEUR]/white?text=${encodeURIComponent(data.companyName)}

7. **ANIMATIONS** : Smooth scroll, fade-in au scroll (JavaScript vanilla minimal)

8. **CODE PROPRE** : Maximum 250 lignes HTML. Indentation correcte. Commentaires pour sections principales.

9. **SORTIE** : UNIQUEMENT le code HTML dans \`\`\`html. Pas de texte avant/après.

GÉNÈRE LE CODE MAINTENANT :`;
    }
  },
  {
    id: 'python-pro-gen',
    slug: 'generateur-python-pro',
    title: 'Générateur Python Pro',
    description: 'Studio Python complet : génération de code, validation automatique, tests unitaires, documentation, analyse de complexité. Plus qu\'un générateur, un vrai IDE !',
    category: 'Dev',
    cost: 3,
    isPremium: false,
    iconName: 'Terminal',
    outputType: 'text',
    seo: { 
      title: 'Générateur de Script Python IA - Code Automatisé', 
      description: 'Obtenez des scripts Python prêts à l\'emploi pour l\'automatisation, la data science ou le web scraping. Code propre et commenté.', 
      keywords: ['générateur python', 'script python ia', 'automatisation', 'code python professionnel', 'aide programmation'] 
    },
    inputs: [
      { 
        name: 'task', 
        label: 'Description de la tâche', 
        type: 'textarea', 
        rows: 6, 
        placeholder: 'Ex: Scraper les titres des dernières news sur HackerNews et les sauvegarder dans un CSV avec timestamp...', 
        required: true,
        helpText: 'Décrivez précisément ce que le script doit faire'
      },
      { 
        name: 'complexity', 
        label: 'Niveau de complexité', 
        type: 'select', 
        options: ['Simple (script basique)', 'Intermédiaire (fonctions, classes)', 'Avancé (architecture complète)', 'Expert (design patterns, optimisations)'],
        required: false,
        helpText: 'Définit la sophistication du code généré'
      },
      { 
        name: 'includeTests', 
        label: 'Inclure des tests unitaires', 
        type: 'select', 
        options: ['Oui (avec pytest)', 'Non (code uniquement)'],
        required: false,
        helpText: 'Génère des tests automatiques pour valider le code'
      },
      { 
        name: 'dependencies', 
        label: 'Bibliothèques spécifiques (Optionnel)', 
        type: 'text', 
        placeholder: 'Ex: requests, pandas, beautifulsoup4, selenium...', 
        required: false,
        helpText: 'Listez les dépendances si vous en connaissez'
      },
      { 
        name: 'requirements', 
        label: 'Exigences spéciales (Optionnel)', 
        type: 'textarea', 
        rows: 3, 
        placeholder: 'Ex: Doit être asynchrone, utiliser des type hints, respecter SOLID...', 
        required: false 
      }
    ],
    promptGenerator: (data) => `${SYSTEM_PROMPT}
TÂCHE: Agis comme un Expert Python Senior. Écris un script complet, professionnel et production-ready pour : "${data.task}".

NIVEAU DE COMPLEXITÉ: ${data.complexity || 'Intermédiaire'}
TESTS: ${data.includeTests === 'Oui (avec pytest)' ? 'OUI - Génère des tests pytest complets' : 'NON'}
${data.dependencies ? `DÉPENDANCES SPÉCIFIQUES: ${data.dependencies}` : ''}
${data.requirements ? `EXIGENCES: ${data.requirements}` : ''}

STRUCTURE DU CODE À GÉNÉRER :

## 📝 SCRIPT PYTHON COMPLET

### 1. **IMPORTS & CONFIGURATION**
- Imports organisés (standard library, third-party, local)
- Type hints partout (Python 3.9+)
- Configuration via variables ou fichier .env si nécessaire

### 2. **CODE PRINCIPAL**
- Structure claire et modulaire
- Gestion d'erreurs robuste (try/except avec logging)
- Respect strict de la PEP8
- Docstrings (Google style) pour toutes les fonctions/classes
- Commentaires explicatifs pour la logique complexe

### 3. **FONCTIONNALITÉS AVANCÉES**
${data.complexity?.includes('Avancé') || data.complexity?.includes('Expert') ? `
- Classes si approprié (OOP)
- Design patterns si pertinent
- Optimisations (caching, lazy loading, etc.)
- Configuration externalisée
` : `
- Fonctions bien définies
- Séparation des responsabilités
`}

### 4. **GESTION D'ERREURS**
- Try/except spécifiques (pas de bare except)
- Logging approprié (niveaux DEBUG/INFO/ERROR)
- Messages d'erreur clairs et actionnables
- Validation des inputs

### 5. **MAIN BLOCK**
\`\`\`python
if __name__ == "__main__":
    # Code d'exécution avec argparse si nécessaire
\`\`\`

${data.includeTests === 'Oui (avec pytest)' ? `
### 6. **TESTS UNITAIRES (pytest)**
- Fichier test_*.py séparé
- Tests pour chaque fonction principale
- Fixtures si nécessaire
- Tests de cas limites et d'erreurs
- Coverage > 80%
` : ''}

### 7. **REQUIREMENTS.TXT**
- Liste complète des dépendances avec versions
- Format pip install compatible

### 8. **DOCUMENTATION**
- README.md avec :
  - Description du script
  - Installation (pip install -r requirements.txt)
  - Usage avec exemples
  - Configuration requise

### 9. **ANALYSE DE CODE**
- Complexité cyclomatique estimée
- Points d'attention (performance, sécurité)
- Suggestions d'amélioration

Génère maintenant le code complet avec tous ces éléments.`
  },

  // --- PRO TOOLS (HIGH VALUE) ---
  {
    id: 'ai-image-analysis',
    slug: 'analyseur-image-ia',
    title: 'Analyseur d\'Image IA',
    description: 'Laboratoire d\'analyse d\'images avancé. Détection IA, reverse engineering de prompts, métriques techniques, rapport complet avec scores. Pour créateurs et professionnels !',
    category: 'Image',
    cost: 2,
    isPremium: false,
    iconName: 'ScanSearch',
    outputType: 'text',
    seo: { 
      title: 'Détecteur Image IA & Reverse Prompt - Analyse Professionnelle', 
      description: 'Uploadez une image pour détecter si elle est générée par une IA ou pour obtenir le prompt original (Midjourney, DALL-E). Traitement 100% privé.', 
      keywords: ['détecteur image ia', 'reverse prompt', 'analyse image', 'upload image ai', 'vision ia'] 
    },
    inputs: [
      { name: 'image', label: 'Uploadez votre image', type: 'file', accept: 'image/*', required: true, helpText: 'L\'image est analysée directement et ne sera jamais stockée sur nos serveurs.' },
      { 
        name: 'analysisType', 
        label: 'Type d\'analyse', 
        type: 'select', 
        options: ['Complète (IA + Technique + Prompt)', 'Détection IA uniquement', 'Reverse Prompt uniquement', 'Analyse technique (résolution, couleurs, etc.)'],
        required: true,
        helpText: 'Choisissez le type d\'analyse souhaité'
      },
      { 
        name: 'aiModel', 
        label: 'Modèle IA suspecté (Optionnel)', 
        type: 'select', 
        options: ['Auto-détection', 'Midjourney', 'DALL-E', 'Stable Diffusion', 'Imagen', 'Autre'],
        required: false,
        helpText: 'Aide à affiner l\'analyse si vous avez une idée'
      },
      { name: 'question', label: 'Question spécifique (Optionnel)', type: 'text', placeholder: 'Ex: Quel est le style artistique ? Y a-t-il des artefacts ?', required: false }
    ],
    promptGenerator: (data) => `${SYSTEM_PROMPT}
TÂCHE: Analyse approfondie de cette image avec rapport professionnel structuré.

TYPE D'ANALYSE: ${data.analysisType || 'Complète'}
${data.aiModel && data.aiModel !== 'Auto-détection' ? `MODÈLE SUSPECTÉ: ${data.aiModel}` : ''}
QUESTION SPÉCIFIQUE: "${data.question || 'Analyse complète de l\'image'}"

GÉNÈRE UN RAPPORT STRUCTURÉ EN MARKDOWN :

## 🔍 RAPPORT D'ANALYSE D'IMAGE

### 1. **SCORE DE DÉTECTION IA**
- **Probabilité IA** : [X]% (0-100)
- **Confiance** : [Faible/Moyenne/Forte/Très forte]
- **Modèle probable** : [Midjourney/DALL-E/Stable Diffusion/Imagen/Inconnu]
- **Justification** : Liste des indices trouvés

### 2. **ANALYSE TECHNIQUE**
- **Résolution** : [Largeur x Hauteur] pixels
- **Format** : [JPEG/PNG/WebP/etc.]
- **Taille fichier estimée** : [KB/MB]
- **Profondeur de couleur** : [8-bit/16-bit/etc.]
- **Compression** : [Niveau estimé]

### 3. **ANALYSE VISUELLE**
- **Composition** : [Règle des tiers, symétrie, etc.]
- **Éclairage** : [Naturel/Artificiel, Direction, Intensité]
- **Couleurs dominantes** : [Palette principale]
- **Style artistique** : [Réaliste/Surréaliste/Abstrait/etc.]
- **Qualité générale** : [Faible/Moyenne/Bonne/Excellente]

### 4. **DÉFAUTS & ARTEFACTS DÉTECTÉS**
Liste détaillée avec localisation si possible :
- [ ] Mains/Doigts anormaux
- [ ] Texte illisible ou incohérent
- [ ] Incohérences d'éclairage
- [ ] Objets flottants ou impossibles
- [ ] Répétitions de motifs
- [ ] Bords flous ou artefacts de compression
- [ ] Autres anomalies

### 5. **REVERSE PROMPT ENGINEERING**
Si l'image semble générée par IA, génère le prompt probable :

**Prompt probable** :
\`\`\`
[Prompt détaillé avec paramètres techniques]
\`\`\`

**Paramètres estimés** :
- Style : [photorealistic/artistic/etc.]
- Qualité : [--quality, --stylize, etc.]
- Ratio : [16:9, 1:1, etc.]
- Seed possible : [Si détectable]

### 6. **MÉTRIQUES DE QUALITÉ**
- **Score de réalisme** : [X]/10
- **Score de cohérence** : [X]/10
- **Score technique** : [X]/10
- **Score artistique** : [X]/10
- **Score global** : [X]/10

### 7. **RECOMMANDATIONS**
- Utilisation suggérée : [Commerciale/Éditoriale/Personnelle]
- Améliorations possibles : [Liste]
- Compatibilité licences : [Si applicable]

### 8. **DÉTAILS SUPPLÉMENTAIRES**
${data.question ? `Réponse à la question spécifique : "${data.question}"` : 'Analyse approfondie des éléments visuels remarquables'}

Génère maintenant le rapport complet.`
  },
  {
    id: 'business-plan-pro',
    slug: 'business-plan-pro',
    title: 'Business Plan Pro',
    description: 'Créez un business plan professionnel structuré avec notre éditeur intelligent. Sections pré-remplies, calculs financiers automatiques, et export PDF prêt pour investisseurs.',
    category: 'Business',
    cost: 2,
    isPremium: false,
    iconName: 'Briefcase',
    outputType: 'text',
    seo: { 
      title: 'Générateur de Business Plan IA Complet - Professionnel', 
      description: 'Créez un business plan professionnel en 1 clic. Executive Summary, Analyse de marché, Stratégie financière et SWOT.', 
      keywords: ['business plan generator', 'créer business plan', 'modèle business plan', 'startup', 'investisseurs'] 
    },
    inputs: [
      { 
        name: 'companyName', 
        label: 'Nom de l\'entreprise', 
        type: 'text', 
        placeholder: 'Ex: TechDrone Solutions', 
        required: true 
      },
      { 
        name: 'sector', 
        label: 'Secteur d\'activité', 
        type: 'select', 
        options: ['Tech/SaaS', 'E-commerce', 'Services', 'Manufacturing', 'Food & Beverage', 'Healthcare', 'Education', 'Finance', 'Autre'], 
        required: true 
      },
      { 
        name: 'targetMarket', 
        label: 'Marché cible', 
        type: 'text', 
        placeholder: 'Ex: PME françaises, Particuliers 25-45 ans...', 
        required: true 
      },
      { 
        name: 'fundingNeeded', 
        label: 'Montant recherché (€)', 
        type: 'number', 
        placeholder: '50000', 
        required: false,
        helpText: 'Montant d\'investissement recherché'
      },
      { 
        name: 'idea', 
        label: 'Description détaillée du projet', 
        type: 'richtext', 
        useEditor: true,
        placeholder: 'Décrivez votre produit/service, votre vision, vos avantages concurrentiels...', 
        required: true,
        helpText: 'Utilisez l\'éditeur pour formater votre texte professionnellement'
      }
    ],
    promptGenerator: (data) => `${SYSTEM_PROMPT} Agis comme un consultant McKinsey Senior. Rédige un Business Plan structuré et professionnel pour :

ENTREPRISE: ${data.companyName}
SECTEUR: ${data.sector}
MARCHÉ CIBLE: ${data.targetMarket}
FUNDING: ${data.fundingNeeded ? `${data.fundingNeeded}€` : 'Non spécifié'}
DESCRIPTION: ${data.idea}

Sections obligatoires (format Markdown professionnel) :
1. **Executive Summary** (1 page max)
2. **Analyse de Marché** (TAM/SAM/SOM avec chiffres)
3. **Modèle Économique** (Revenue streams, Coûts, Projections 3 ans)
4. **Stratégie Go-To-Market** (Channels, Pricing, Marketing)
5. **Analyse SWOT** (Forces, Faiblesses, Opportunités, Menaces)
6. **Équipe & Gouvernance**
7. **Plan Financier** (Tableaux de projections si funding spécifié)

Tone: Professionnel, convaincant, data-driven.`
  },
  // --- E-COMMERCE TOOLS ---
  createSimpleTool(
    'ecom-ad-gen', 
    'Pub Facebook & TikTok', 
    'Créez des pubs Facebook et TikTok qui vendent vraiment. On vous génère 3 variantes testées et optimisées pour le ROAS.', 
    'Business', 
    'Agis comme un expert Media Buyer. Rédige 3 variantes de publicité (Facebook/Instagram/TikTok) pour ce produit. Utilise des hooks viraux, des emojis et la méthode AIDA (Attention, Intérêt, Désir, Action). Produit :', 
    'Megaphone', 'textarea', { rows: 4, placeholder: 'Ex: Un correcteur de posture pour le dos...' },
    { title: 'Générateur de Publicité Facebook & TikTok Ads IA', description: 'Créez des textes publicitaires performants pour vos campagnes. Copywriting optimisé pour le dropshipping et l\'e-commerce.', keywords: ['pub facebook generator', 'tiktok ads script', 'copywriting e-commerce', 'marketing ia'] }, 
    1
  ),
  createSimpleTool(
    'ecom-review-reply', 
    'Répondeur Avis Clients', 
    'Un client mécontent ? On vous aide à répondre avec professionnalisme et à transformer la critique en opportunité. Service client au top !', 
    'Business', 
    'Agis comme un responsable Service Client empathique et professionnel. Rédige une réponse à cet avis client. Si l\'avis est négatif, excuse-toi et propose une solution. Si positif, remercie chaleureusement. Avis :', 
    'MessageCircle', 'textarea', { rows: 4, placeholder: 'Collez l\'avis du client ici...' },
    { title: 'Générateur Réponse Avis Client (Google/Amazon)', description: 'Répondez aux avis clients automatiquement avec professionnalisme. Gestion de crise et fidélisation par IA.', keywords: ['répondre avis google', 'service client ia', 'gestion avis négatif', 'amazon review reply'] }, 
    1
  ),
  createSimpleTool(
    'brand-name-gen', 
    'Générateur Nom de Marque', 
    'Vous cherchez le nom parfait pour votre marque ? On vous propose 10 idées originales, mémorables et qui sonnent bien. Le branding, c\'est important !', 
    'Business', 
    'Propose 10 noms de marque uniques, courts, mémorables et modernes pour ce projet. Vérifie mentalement que ça sonne bien en français et anglais. Projet :', 
    'Tag', 'text', { placeholder: 'Ex: Une marque de vêtements éco-responsables' },
    { title: 'Générateur de Nom de Marque & Startup', description: 'Trouvez le nom parfait pour votre entreprise ou boutique Shopify. Idées de noms originaux et disponibles.', keywords: ['générateur nom entreprise', 'trouver nom marque', 'branding ia', 'naming tool'] }, 
    1
  ),

  // --- NEW AI TOOLS ---
  {
    id: 'ai-detector',
    slug: 'detecteur-texte-ia',
    title: 'Détecteur Texte IA',
    description: 'Vous suspectez qu\'un texte vient de ChatGPT ? On vous dit la vérité en quelques secondes. Fiable à 99%, même pour les textes bien rédigés.',
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
    slug: 'humaniseur-texte',
    title: 'Humaniseur de Texte',
    description: 'Votre texte ChatGPT sonne trop robotique ? On le transforme en texte naturel et fluide, impossible à détecter. Vos profs ne sauront jamais !',
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
    promptGenerator: (data) => `${SYSTEM_PROMPT}
RÔLE: Tu es un copywriter senior français, spécialisé dans la réécriture "anti-IA".
MISSION: Réécris le texte suivant pour qu'il paraisse écrit par un humain cultivé : "${data.content}".

CONSIGNES STRICTES :
- Change la structure et l'ordre des idées (pas seulement les mots).
- Varie les longueurs de phrases, ajoute des tournures idiomatiques et des transitions naturelles.
- Ajoute des micro-détails crédibles (ex: "on dirait un lundi pluvieux", "c'est un peu comme quand...") pour ancrer le texte dans le réel.
- Supprime toute répétition, évite les listes et les formulations trop scolaires.
- Indique le ton adopté (pro, friendly, storytelling...) et justifie-le.

FORMAT DE SORTIE :
1. **Texte humanisé** : (2-4 paragraphes fluides)
2. **Ton & intention** : phrase expliquant le style choisi
3. **Suggestions** : 2 mini-idées pour pousser encore plus loin la personnalisation`
  },
  {
    id: 'pro-prompt-gen',
    slug: 'generateur-prompt-pro',
    title: 'Générateur Prompt Pro',
    description: 'Vous galérez à faire des prompts efficaces ? On transforme votre idée en prompt parfait, structuré et optimisé. Fini les résultats médiocres !',
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
    slug: 'detecteur-arnaques',
    title: 'Détecteur d\'Arnaques',
    description: 'Vous avez reçu un SMS suspect ? Copiez-collez-le ici, et on vous dit si c\'est une arnaque. Protégez-vous des tentatives de phishing !',
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
    slug: 'traducteur-juridique',
    title: 'Traducteur Juridique',
    description: 'Vous ne comprenez rien à votre contrat ? On traduit le jargon juridique en français simple. Comprenez ce que vous signez vraiment !',
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
    slug: 'interprete-reves',
    title: 'Interprète de Rêves',
    description: 'Vous avez fait un rêve étrange ? Racontez-le nous, et on vous explique ce que votre subconscient essaie de vous dire. Psychologie garantie !',
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
    slug: 'explose-mon-code',
    title: 'Explose mon Code',
    description: 'Vous voulez savoir ce que votre code vaut vraiment ? On le critique sans pitié, mais avec humour. Vous apprendrez en rigolant !',
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

  // --- LOCAL TOOLS (Gratuits - 0 Crédit) ---
  {
    id: 'csv-to-json',
    slug: 'csv-vers-json',
    title: 'CSV vers JSON',
    description: 'Besoin de convertir un CSV en JSON ? C\'est fait en 1 clic, et vos données ne quittent jamais votre navigateur. 100% sécurisé !',
    category: 'Dev',
    cost: 0,
    isPremium: false,
    iconName: 'FileJson',
    outputType: 'text',
    seo: { 
      title: 'Convertisseur CSV vers JSON En Ligne - Sécurisé', 
      description: 'Transformez vos fichiers CSV en JSON instantanément. Traitement 100% local, vos données ne quittent pas votre navigateur.', 
      keywords: ['csv to json', 'convertisseur csv', 'csv json en ligne', 'dev tools', 'excel to json'] 
    },
    inputs: [
      { 
        name: 'csv', 
        label: 'Collez votre CSV (avec en-têtes)', 
        type: 'textarea', 
        rows: 8, 
        className: 'font-mono text-xs', 
        required: true,
        helpText: 'Chaque colonne doit être séparée par une virgule.'
      },
      {
        name: 'csv_upload',
        label: 'Ou importez un fichier CSV',
        type: 'file',
        accept: '.csv,text/csv',
        required: false,
        helpText: 'Nous ne l\'envoyons jamais sur un serveur, conversion 100% locale.',
        fileMode: 'text',
        mapTo: 'csv'
      }
    ],
    promptGenerator: (data) => `LOCAL:CSV_JSON;;;${data.csv}`
  },
  {
    id: 'hex-to-rgb',
    slug: 'couleur-hex-rgb',
    title: 'Couleur Hex ↔ RGB',
    description: 'Vous travaillez sur un design ? Convertissez vos codes couleurs Hex en RGB (et vice-versa) en un instant. Avec aperçu visuel en bonus !',
    category: 'Image',
    cost: 0,
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
    slug: 'calcul-pourcentage',
    title: 'Calcul Pourcentage',
    description: 'Vous avez besoin de calculer un pourcentage ? Soldes, remises, évolutions... On fait le calcul pour vous en quelques secondes !',
    category: 'Life',
    cost: 0,
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
    slug: 'generateur-seo-meta',
    title: 'Générateur SEO Meta',
    description: 'Vous voulez référencer votre site sur Google ? On génère toutes vos balises SEO (Title, Description, OpenGraph) en quelques clics.',
    category: 'Dev',
    cost: 0,
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
    slug: 'traducteur-morse',
    title: 'Traducteur Morse',
    description: 'Vous voulez envoyer un message secret ? Traduisez-le en code Morse ! Parfait pour le scoutisme ou juste pour s\'amuser.',
    category: 'Life',
    cost: 0,
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
    slug: 'generateur-mots-de-passe',
    title: 'Générateur Mots de Passe',
    description: 'Protégez vos comptes avec des mots de passe ultra-sécurisés. On génère des combinaisons aléatoires impossibles à deviner !',
    category: 'Security',
    cost: 0,
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
    slug: 'formateur-json',
    title: 'Formateur JSON',
    description: 'Votre JSON est un vrai bordel ? On le formate proprement et on valide qu\'il est correct. Indispensable pour les devs !',
    category: 'Dev',
    cost: 0,
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
    slug: 'generateur-uuid',
    title: 'Générateur UUID',
    description: 'Besoin d\'un ID unique pour votre base de données ? On génère des UUID v4 aléatoires en un clic. Parfait pour les devs !',
    category: 'Dev',
    cost: 0,
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
    slug: 'generateur-slug',
    title: 'Générateur de Slug',
    description: 'Vous voulez une URL propre et SEO-friendly ? Transformez votre titre en slug parfait. Accents et caractères spéciaux supprimés automatiquement !',
    category: 'Dev',
    cost: 0,
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
    slug: 'pixel-vers-rem',
    title: 'Pixel vers REM',
    description: 'Vous travaillez en CSS ? Convertissez vos pixels en REM facilement. Indispensable pour un design responsive et accessible !',
    category: 'Dev',
    cost: 0,
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
    slug: 'calculatrice-roi',
    title: 'Calculatrice ROI',
    description: 'Vous voulez savoir si votre campagne pub est rentable ? Calculez votre ROI en quelques secondes. Investissement vs revenus, c\'est simple !',
    category: 'Business',
    cost: 0,
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
    slug: 'simulateur-tjm-freelance',
    title: 'Simulateur TJM Freelance',
    description: 'Vous êtes freelance et vous vous demandez combien vous gagnez vraiment ? Convertissez votre TJM en salaire net mensuel. La réalité des chiffres !',
    category: 'Business',
    cost: 0,
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
    slug: 'encodeur-base64',
    title: 'Encodeur Base64',
    description: 'Besoin d\'encoder ou décoder du Base64 ? C\'est fait en un clic ! Parfait pour les devs qui travaillent avec des APIs ou des données.',
    category: 'Dev',
    cost: 0,
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
    slug: 'analyseur-texte',
    title: 'Analyseur de Texte',
    description: 'Vous écrivez un article ? On compte vos mots, caractères et on estime le temps de lecture. Indispensable pour le SEO et le blogging !',
    category: 'Text',
    cost: 0,
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
    slug: 'decideur',
    title: 'Le Décideur',
    description: 'Vous hésitez entre plusieurs options ? Entrez vos choix et on décide pour vous ! Parfait pour les indécis chroniques.',
    category: 'Life',
    cost: 0,
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
  {
    id: 'homework-helper',
    slug: 'aide-aux-devoirs',
    title: 'Aide aux Devoirs IA',
    description: 'Vous bloquez sur un exercice ? Uploadez une photo ou posez votre question, et on vous explique tout en détail. Comme un prof particulier, mais gratuit !',
    category: 'Life',
    cost: 2,
    isPremium: false,
    iconName: 'GraduationCap',
    outputType: 'text',
    seo: { 
      title: 'Aide aux Devoirs IA - Explications Détaillées par Intelligence Artificielle', 
      description: 'Besoin d\'aide pour vos devoirs ? Uploadez une photo de votre exercice ou posez votre question. L\'IA vous explique tout en détail avec des exemples.', 
      keywords: ['aide aux devoirs', 'aide devoir ia', 'explication exercice', 'résoudre exercice', 'aide scolaire ia', 'devoir maison'] 
    },
    inputs: [
      { 
        name: 'image', 
        label: 'Photo de l\'exercice (Optionnel)', 
        type: 'file', 
        accept: 'image/*', 
        required: false,
        helpText: 'Uploadez une photo claire de votre exercice, problème ou question.'
      },
      { 
        name: 'question', 
        label: 'Votre question ou exercice (Optionnel)', 
        type: 'textarea', 
        rows: 6, 
        required: false,
        placeholder: 'Ex: Explique-moi comment résoudre une équation du second degré...',
        helpText: 'Décrivez votre question ou copiez l\'énoncé de l\'exercice. Au moins une photo OU une question est requise.'
      }
    ],
    promptGenerator: (data) => {
      const hasImage = data.image === 'FILE_UPLOADED';
      const hasText = data.question && data.question.trim();
      
      if (!hasImage && !hasText) {
        return 'ERROR: Veuillez fournir au moins une photo ou une question.';
      }
      
      const questionText = hasText ? data.question : 'Analyse cette image et explique-moi tout en détail.';
      
      return `${SYSTEM_PROMPT}
RÔLE: Tu es un professeur patient et pédagogue, expert dans toutes les matières scolaires (Mathématiques, Français, Histoire, Sciences, Langues, etc.).

MISSION: Aider l'élève à comprendre et résoudre son exercice ou sa question en donnant des explications DÉTAILLÉES et PÉDAGOGIQUES.

${hasImage ? 'L\'élève a fourni une photo de son exercice. Analyse-la attentivement.' : ''}
${hasText ? `QUESTION DE L'ÉLÈVE : "${questionText}"` : ''}

INSTRUCTIONS STRICTES:
1. Si c'est un exercice, explique chaque étape de la résolution de manière claire.
2. Donne des exemples concrets pour illustrer les concepts.
3. Utilise un langage adapté au niveau scolaire (collège/lycée).
4. Si l'élève a fait une erreur, explique pourquoi et comment corriger.
5. Fournis la réponse finale mais surtout EXPLIQUE le raisonnement.
6. Sois encourageant et pédagogique.

FORMAT DE RÉPONSE:
- **Analyse** : Ce que je vois/comprends
- **Explication étape par étape** : Comment résoudre
- **Exemple concret** : Pour illustrer
- **Réponse finale** : La solution
- **Conseils** : Pour retenir et progresser

${hasImage ? 'Analyse maintenant la photo fournie et explique tout en détail.' : 'Réponds maintenant à la question de manière détaillée et pédagogique.'}`;
    }
  },
  {
    id: 'qr-code-generator',
    slug: 'generateur-qr-code',
    title: 'Générateur QR Code',
    description: 'Besoin d\'un QR code pour votre site, votre WiFi ou juste pour s\'amuser ? On le génère en quelques secondes. Gratuit et sans inscription !',
    category: 'Dev',
    cost: 0,
    isPremium: false,
    iconName: 'QrCode',
    outputType: 'text',
    seo: { 
      title: 'Générateur QR Code Gratuit - Créer QR Code En Ligne', 
      description: 'Générez des QR codes instantanément pour URLs, textes, contacts ou WiFi. Gratuit, rapide et sans inscription.', 
      keywords: ['générateur qr code', 'créer qr code', 'qr code gratuit', 'qr code url', 'qr code wifi'] 
    },
    inputs: [{ name: 'data', label: 'Texte ou URL à encoder', type: 'text', placeholder: 'https://example.com ou Texte libre', required: true, helpText: 'Entrez une URL, un texte, un numéro de téléphone, etc.' }],
    promptGenerator: (data) => `LOCAL:QR_CODE;;;${data.data}`
  },

  // --- AI TOOLS (Restants utiles/Fun - Passés à 1 Crédit) ---
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
  // Image Tools
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
