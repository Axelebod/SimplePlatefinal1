import { askBot } from './geminiService';
import { getTools } from '../tools-config';
import type { AIAuditResult, AuditCategory } from '../types/studio';

// Mapping des problèmes détectés vers les outils SimplePlate
const PROBLEM_TO_TOOL_MAP: Record<string, string[]> = {
  // Design & UI
  'design-spacing': ['px-rem-converter'],
  'design-colors': ['hex-color-display'],
  'design-layout': ['website-generator'],
  
  // Copywriting & Content
  'copywriting-weak': ['business-plan-pro', 'prompt-pro-generator'],
  'copywriting-seo': ['seo-meta-generator', 'slug-gen'],
  'copywriting-headlines': ['business-plan-pro'],
  'copywriting-cta': ['business-plan-pro'],
  
  // Technical
  'json-structure': ['json-formatter'],
  'json-validation': ['json-formatter'],
  'csv-data': ['csv-to-json'],
  'code-formatting': ['json-formatter'],
  
  // SEO
  'seo-meta': ['seo-meta-generator'],
  'seo-urls': ['slug-gen'],
  'seo-structure': ['seo-meta-generator'],
  
  // Business
  'business-plan': ['business-plan-pro'],
  'business-copy': ['business-plan-pro'],
  'business-strategy': ['business-plan-pro'],
  
  // Content Quality
  'content-quality': ['text-analyzer', 'ai-text-detector'],
  'content-humanize': ['ai-text-humanizer'],
  'content-optimization': ['text-analyzer'],
  
  // Technical Performance
  'performance-optimization': ['json-formatter'],
  'data-structure': ['json-formatter', 'csv-to-json'],
  
  // Accessibility
  'accessibility-content': ['text-analyzer'],
  
  // Marketing
  'marketing-copy': ['business-plan-pro', 'hashtag-gen'],
  'social-media': ['hashtag-gen'],
};

/**
 * Service d'audit IA complet pour analyser un projet Micro-SaaS
 * Analyse: Design, Copywriting, Technical, SEO, UX, Security, Accessibility
 */
export async function performCompleteAudit(
  projectUrl: string,
  projectName: string,
  projectDescription: string,
  language: 'fr' | 'en' = 'fr'
): Promise<AIAuditResult> {
  const tools = getTools(language);
  const toolsList = tools.map(t => `- ${t.title} (ID: ${t.id}): ${t.description}`).join('\n');

  const systemPrompt = language === 'fr' 
    ? `Tu es un expert en audit de sites web et Micro-SaaS. Tu dois analyser le site ${projectUrl} et fournir l'audit LE PLUS COMPLET POSSIBLE.

RÈGLES STRICTES:
1. Analyse EN PROFONDEUR TOUS les aspects: Design/UI, Copywriting, Technical, SEO, UX, Accessibility, Performance, Business
2. Format de réponse: JSON strict avec cette structure:
{
  "overall_score": 75,
  "categories": [
    {
      "name": "Design & UI",
      "score": 80,
      "issues": ["Problème détaillé 1", "Problème détaillé 2", "Problème détaillé 3"],
      "suggested_tools": ["tool-id"] // Optionnel: 1-2 outils SimplePlate si vraiment pertinent
    }
  ]
}

4. Les catégories OBLIGATOIRES à analyser (minimum 7):
   - Design & UI (espacement, couleurs, layout, responsive, typographie)
   - Copywriting & Content (textes, headlines, CTA, clarté du message)
   - Technical (code, structure, performance, erreurs techniques)
   - SEO (meta tags, URLs, structure, sitemap, robots.txt)
   - UX & Usability (navigation, clarté, parcours utilisateur)
   - Accessibility (a11y, contraste, lisibilité, ARIA)
   - Business & Marketing (positionnement, message, proposition de valeur)
   - Performance (vitesse, optimisation, ressources)

5. Sois ULTRA-PRÉCIS et ACTIONNABLE:
   - Détecte au moins 3-5 problèmes par catégorie
   - Chaque problème doit être spécifique et mesurable
   - Suggère 1-2 outils SimplePlate PARFOIS (pas systématique) si vraiment pertinent pour corriger les problèmes
   - Suggère des outils seulement si le score est < 80 ET qu'un outil SimplePlate peut vraiment aider
   - Exemples: problème JSON → "json-formatter", problème SEO → "seo-meta-generator", problème copywriting → "business-plan-pro"

7. Score: 0-100 pour chaque catégorie et overall_score (sois sévère mais juste)

6. IMPORTANT: 
   - Analyse le site réellement (pas de réponse générique)
   - Sois exhaustif: plus de problèmes = meilleur audit
   - Réponds UNIQUEMENT avec le JSON, sans texte avant/après
   - Minimum 20 problèmes détectés au total`
    : `You are an expert web and Micro-SaaS auditor. You must analyze the site ${projectUrl} and provide a COMPLETE and DETAILED audit.

STRICT RULES:
1. Analyze ALL aspects: Design/UI, Copywriting, Technical, SEO, UX, Accessibility, Performance
2. Response format: Strict JSON with this structure:
{
  "overall_score": 75,
  "categories": [
    {
      "name": "Design & UI",
      "score": 80,
      "issues": ["Issue 1", "Issue 2"],
      "suggested_tools": ["tool-id-1"] // Optional: suggest 1-2 tools ONLY if really relevant
    }
  ]
}

4. MANDATORY categories to analyze:
   - Design & UI (spacing, colors, layout)
   - Copywriting & Content (texts, headlines, CTA)
   - Technical (code, structure, performance)
   - SEO (meta tags, URLs, structure)
   - UX & Usability (navigation, clarity)
   - Accessibility (a11y, contrast, readability)
   - Business & Marketing (positioning, messaging)

5. Be PRECISE and ACTIONABLE:
   - Detect at least 3-5 issues per category
   - Each issue must be specific and measurable
   - Sometimes suggest 1-2 SimplePlate tools (not systematic) if really relevant to fix issues
   - Suggest tools only if score < 80 AND a SimplePlate tool can really help
   - Examples: JSON issue → "json-formatter", SEO issue → "seo-meta-generator", copywriting issue → "business-plan-pro"

6. Score: 0-100 for each category and overall_score

IMPORTANT: Respond ONLY with JSON, no text before/after.`;

  const userPrompt = language === 'fr'
    ? `Analyse ce projet Micro-SaaS EN PROFONDEUR:

URL: ${projectUrl}
Nom: ${projectName}
Description: ${projectDescription}

IMPORTANT - Analyse la description en détail:
${projectDescription ? `La description fournie est: "${projectDescription}". Utilise cette description pour analyser la clarté du message, la proposition de valeur, le copywriting, et la cohérence marketing.` : 'Aucune description fournie - note cela comme un problème dans l\'audit.'}

INSTRUCTIONS D'AUDIT:
1. Visite le site ${projectUrl} et analyse-le réellement
2. Analyse la description fournie: clarté, proposition de valeur, copywriting, cohérence
3. Détecte TOUS les problèmes possibles dans chaque catégorie
4. Sois exhaustif: minimum 20 problèmes au total
5. Sois spécifique et actionnable: chaque problème doit être clair et mesurable
6. Évalue la qualité de la description: est-elle claire? Convaincante? Optimisée SEO?

Fournis un audit ULTRA-COMPLET avec:
- Score global (0-100) - sois sévère mais juste
- 7-8 catégories minimum avec scores individuels
- 3-5 problèmes détaillés par catégorie
- Inclus une catégorie "Description & Messaging" si la description est faible

Réponds UNIQUEMENT en JSON valide, sans texte avant/après.`
    : `Analyze this Micro-SaaS project IN DEPTH:

URL: ${projectUrl}
Name: ${projectName}
Description: ${projectDescription}

IMPORTANT - Analyze the description in detail:
${projectDescription ? `The provided description is: "${projectDescription}". Use this description to analyze message clarity, value proposition, copywriting, and marketing consistency.` : 'No description provided - note this as an issue in the audit.'}

AUDIT INSTRUCTIONS:
1. Visit the site ${projectUrl} and analyze it thoroughly
2. Analyze the provided description: clarity, value proposition, copywriting, consistency
3. Detect ALL possible issues in each category
4. Be exhaustive: minimum 20 issues total
5. Be specific and actionable: each issue must be clear and measurable
6. Evaluate description quality: is it clear? Convincing? SEO optimized?

Provide an ULTRA-COMPLETE audit with:
- Overall score (0-100) - be strict but fair
- Minimum 7-8 categories with individual scores
- 3-5 detailed issues per category
- Include a "Description & Messaging" category if description is weak

Respond ONLY with valid JSON, no text before/after.`;

  try {
    const response = await askBot(`${systemPrompt}\n\n${userPrompt}`);
    
    // Vérifier si la réponse est vide
    if (!response || response.trim().length === 0) {
      console.error('AI returned empty response');
      throw new Error('L\'IA n\'a pas pu générer l\'audit. Veuillez réessayer.');
    }
    
    // Extraire le JSON de la réponse (peut contenir du markdown ou du texte)
    // IMPORTANT: On extrait d'abord le JSON avant de vérifier les erreurs
    // pour éviter de rejeter des réponses valides qui contiennent "erreur" dans le contenu
    let jsonString = response.trim();
    
    // Enlever les blocs de code markdown si présents
    jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Trouver le JSON dans la réponse
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // Si pas de JSON trouvé, vérifier si c'est un message d'erreur explicite
      // On vérifie seulement au début de la réponse (avant toute tentative de JSON)
      const responseStart = response.trim().substring(0, 200).toLowerCase();
      if (responseStart.includes("désolé") || 
          responseStart.includes("je n'ai pas") ||
          responseStart.includes("i don't have") ||
          responseStart.includes("clé api") ||
          responseStart.includes("api key") ||
          responseStart.includes("i cannot") ||
          responseStart.includes("je ne peux pas")) {
        console.error('AI returned error message:', response);
        throw new Error('L\'IA n\'a pas pu générer l\'audit. Veuillez réessayer.');
      }
      console.error('No JSON found in AI response. Response:', response.substring(0, 500));
      throw new Error('L\'IA n\'a pas retourné un format JSON valide. Veuillez réessayer.');
    }
    
    jsonString = jsonMatch[0];
    
    let auditData;
    try {
      auditData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Response:', jsonString.substring(0, 500));
      throw new Error('Erreur lors de l\'analyse de la réponse de l\'IA. Veuillez réessayer.');
    }
    
    // Valider la structure de base
    if (!auditData || typeof auditData !== 'object') {
      console.error('Invalid audit data structure. Data:', auditData);
      throw new Error('La structure de l\'audit généré par l\'IA est invalide. Veuillez réessayer.');
    }
    
    // Valider et enrichir les données
    const enrichedAudit = enrichAuditWithToolMapping(auditData, tools);
    
    // S'assurer qu'on a au moins une catégorie
    if (!enrichedAudit.categories || enrichedAudit.categories.length === 0) {
      console.error('No categories in audit. Enriched audit:', enrichedAudit);
      throw new Error('L\'audit généré par l\'IA ne contient aucune catégorie. Veuillez réessayer.');
    }
    
    return {
      overall_score: enrichedAudit.overall_score || 70,
      categories: enrichedAudit.categories,
      generated_at: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('Error performing audit:', error);
    console.error('Error details:', error?.message, error?.stack);
    
    // Ne pas utiliser de fallback - propager l'erreur
    throw error;
  }
}

/**
 * Enrichit l'audit avec le mapping intelligent des outils
 */
function enrichAuditWithToolMapping(
  auditData: any,
  tools: any[]
): AIAuditResult {
  const enrichedCategories = (auditData.categories || []).map((category: any) => {
    let suggestedTools = category.suggested_tools || [];
    
    // Si pas d'outils suggérés par l'IA, essayer de les déduire intelligemment
    if (suggestedTools.length === 0 && category.issues) {
      suggestedTools = inferToolsFromIssues(category.issues, category.name, tools);
    }
    
    // Valider que les outils existent
    const validTools = suggestedTools.filter((toolId: string) =>
      tools.some(t => t.id === toolId)
    );
    
    // Proposer des outils seulement si c'est pertinent (score < 80 ou problèmes critiques)
    const shouldSuggestTools = (category.score || 0) < 80 || validTools.length > 0;
    
    return {
      name: category.name,
      score: Math.max(0, Math.min(100, category.score || 0)),
      issues: category.issues || [],
      suggested_tools: shouldSuggestTools && validTools.length > 0 
        ? validTools.slice(0, 2) // Limiter à 2 outils max par catégorie
        : [],
    };
  });
  
  return {
    overall_score: Math.max(0, Math.min(100, auditData.overall_score || 0)),
    categories: enrichedCategories,
    generated_at: new Date().toISOString(),
  };
}

/**
 * Infère les outils à partir des problèmes détectés
 */
function inferToolsFromIssues(issues: string[], categoryName: string, tools: any[]): string[] {
  const suggestedTools: string[] = [];
  const issuesLower = issues.join(' ').toLowerCase();
  
  // Mapping intelligent basé sur les mots-clés
  if (issuesLower.includes('json') || issuesLower.includes('format')) {
    const tool = tools.find(t => t.id === 'json-formatter');
    if (tool) suggestedTools.push(tool.id);
  }
  
  if (issuesLower.includes('csv') || issuesLower.includes('données')) {
    const tool = tools.find(t => t.id === 'csv-to-json');
    if (tool) suggestedTools.push(tool.id);
  }
  
  if (issuesLower.includes('slug') || issuesLower.includes('url') || issuesLower.includes('seo')) {
    const tool = tools.find(t => t.id === 'slug-gen');
    if (tool) suggestedTools.push(tool.id);
  }
  
  if (issuesLower.includes('meta') || issuesLower.includes('seo') || issuesLower.includes('description')) {
    const tool = tools.find(t => t.id === 'seo-meta-generator');
    if (tool) suggestedTools.push(tool.id);
  }
  
  if (issuesLower.includes('copywriting') || issuesLower.includes('texte') || issuesLower.includes('contenu') || 
      issuesLower.includes('headline') || issuesLower.includes('cta') || issuesLower.includes('business')) {
    const tool = tools.find(t => t.id === 'business-plan-pro');
    if (tool) suggestedTools.push(tool.id);
  }
  
  if (issuesLower.includes('px') || issuesLower.includes('rem') || issuesLower.includes('taille') || issuesLower.includes('spacing')) {
    const tool = tools.find(t => t.id === 'px-rem-converter');
    if (tool) suggestedTools.push(tool.id);
  }
  
  if (issuesLower.includes('couleur') || issuesLower.includes('color') || issuesLower.includes('hex')) {
    const tool = tools.find(t => t.id === 'hex-color-display');
    if (tool) suggestedTools.push(tool.id);
  }
  
  if (issuesLower.includes('site') || issuesLower.includes('web') || issuesLower.includes('landing')) {
    const tool = tools.find(t => t.id === 'website-generator');
    if (tool) suggestedTools.push(tool.id);
  }
  
  if (issuesLower.includes('hashtag') || issuesLower.includes('social')) {
    const tool = tools.find(t => t.id === 'hashtag-gen');
    if (tool) suggestedTools.push(tool.id);
  }
  
  if (issuesLower.includes('analyser') || issuesLower.includes('texte') || issuesLower.includes('mots') || issuesLower.includes('compteur')) {
    const tool = tools.find(t => t.id === 'text-analyzer');
    if (tool) suggestedTools.push(tool.id);
  }
  
  if (issuesLower.includes('ia') || issuesLower.includes('ai') || issuesLower.includes('généré') || issuesLower.includes('détecter')) {
    const tool = tools.find(t => t.id === 'ai-detector');
    if (tool) suggestedTools.push(tool.id);
  }
  
  if (issuesLower.includes('humaniser') || issuesLower.includes('naturel') || issuesLower.includes('trop robotique')) {
    const tool = tools.find(t => t.id === 'ai-humanizer');
    if (tool) suggestedTools.push(tool.id);
  }
  
  if (issuesLower.includes('cv') || issuesLower.includes('curriculum')) {
    const tool = tools.find(t => t.id === 'cv-generator');
    if (tool) suggestedTools.push(tool.id);
  }
  
  if (issuesLower.includes('facture') || issuesLower.includes('invoice')) {
    const tool = tools.find(t => t.id === 'invoice-generator');
    if (tool) suggestedTools.push(tool.id);
  }
  
  if (issuesLower.includes('qr') || issuesLower.includes('code')) {
    const tool = tools.find(t => t.id === 'qr-code-generator');
    if (tool) suggestedTools.push(tool.id);
  }
  
  if (issuesLower.includes('prompt') || issuesLower.includes('prompts')) {
    const tool = tools.find(t => t.id === 'pro-prompt-gen');
    if (tool) suggestedTools.push(tool.id);
  }
  
  if (issuesLower.includes('brand') || issuesLower.includes('nom') || issuesLower.includes('marque')) {
    const tool = tools.find(t => t.id === 'brand-name-gen');
    if (tool) suggestedTools.push(tool.id);
  }
  
  return [...new Set(suggestedTools)]; // Remove duplicates
}

/**
 * Retourne les outils par défaut pour une catégorie
 */
function getDefaultToolsForCategory(categoryName: string, tools: any[]): string[] {
  const categoryLower = categoryName.toLowerCase();
  const defaultTools: string[] = [];
  
  if (categoryLower.includes('design') || categoryLower.includes('ui')) {
    const tool = tools.find(t => t.id === 'website-generator');
    if (tool) defaultTools.push(tool.id);
  }
  
  if (categoryLower.includes('copywriting') || categoryLower.includes('content') || categoryLower.includes('business')) {
    const tool = tools.find(t => t.id === 'business-plan-pro');
    if (tool) defaultTools.push(tool.id);
  }
  
  if (categoryLower.includes('technical') || categoryLower.includes('code')) {
    const tool = tools.find(t => t.id === 'json-formatter');
    if (tool) defaultTools.push(tool.id);
  }
  
  if (categoryLower.includes('seo')) {
    const tool = tools.find(t => t.id === 'seo-meta-generator');
    if (tool) defaultTools.push(tool.id);
  }
  
  return defaultTools;
}

/**
 * Génère un audit COMPLET de fallback si l'IA échoue
 * Toujours complet avec toutes les catégories obligatoires
 */
function generateFallbackAudit(
  projectUrl: string,
  projectName: string,
  language: 'fr' | 'en',
  tools: any[]
): AIAuditResult {
  // Helper pour trouver un outil par ID
  const findTool = (id: string) => tools.find(t => t.id === id)?.id;
  
  return {
    overall_score: 70,
    categories: [
      {
        name: language === 'fr' ? 'Design & UI' : 'Design & UI',
        score: 75,
        issues: [
          language === 'fr' ? 'Vérifiez la cohérence visuelle et l\'harmonie des couleurs' : 'Check visual consistency and color harmony',
          language === 'fr' ? 'Optimisez l\'espacement et la mise en page (responsive design)' : 'Optimize spacing and layout (responsive design)',
          language === 'fr' ? 'Améliorez la typographie et la hiérarchie visuelle' : 'Improve typography and visual hierarchy',
          language === 'fr' ? 'Vérifiez la cohérence des composants UI' : 'Check UI component consistency',
          language === 'fr' ? 'Optimisez les tailles et espacements (px/rem)' : 'Optimize sizes and spacing (px/rem)',
        ],
              suggested_tools: [],
      },
      {
        name: language === 'fr' ? 'Copywriting & Content' : 'Copywriting & Content',
        score: 70,
        issues: [
          language === 'fr' ? 'Améliorez vos headlines et titres pour plus d\'impact' : 'Improve your headlines and titles for more impact',
          language === 'fr' ? 'Optimisez vos appels à l\'action (CTA) pour augmenter les conversions' : 'Optimize your calls to action (CTA) to increase conversions',
          language === 'fr' ? 'Renforcez votre proposition de valeur et votre message clair' : 'Strengthen your value proposition and clear messaging',
          language === 'fr' ? 'Améliorez la clarté et la concision de vos textes' : 'Improve clarity and conciseness of your texts',
          language === 'fr' ? 'Vérifiez la cohérence du ton et du style rédactionnel' : 'Check consistency of tone and writing style',
        ],
              suggested_tools: [],
      },
      {
        name: language === 'fr' ? 'Technical & Code' : 'Technical & Code',
        score: 75,
        issues: [
          language === 'fr' ? 'Vérifiez la structure et la qualité de votre code' : 'Check code structure and quality',
          language === 'fr' ? 'Optimisez les temps de chargement et les performances' : 'Optimize loading times and performance',
          language === 'fr' ? 'Validez vos formats de données (JSON, CSV)' : 'Validate your data formats (JSON, CSV)',
          language === 'fr' ? 'Vérifiez l\'absence d\'erreurs JavaScript/console' : 'Check for JavaScript/console errors',
          language === 'fr' ? 'Optimisez la structure des fichiers et l\'organisation du code' : 'Optimize file structure and code organization',
        ],
              suggested_tools: [],
      },
      {
        name: language === 'fr' ? 'SEO & Métadonnées' : 'SEO & Metadata',
        score: 65,
        issues: [
          language === 'fr' ? 'Vérifiez vos meta tags (title, description, Open Graph, Twitter Cards)' : 'Check your meta tags (title, description, Open Graph, Twitter Cards)',
          language === 'fr' ? 'Optimisez vos URLs pour le SEO (slugs, structure)' : 'Optimize your URLs for SEO (slugs, structure)',
          language === 'fr' ? 'Ajoutez des balises sémantiques (h1, h2, h3, etc.)' : 'Add semantic tags (h1, h2, h3, etc.)',
          language === 'fr' ? 'Vérifiez la présence d\'un sitemap.xml et robots.txt' : 'Check for sitemap.xml and robots.txt',
          language === 'fr' ? 'Optimisez les images (alt tags, compression, formats)' : 'Optimize images (alt tags, compression, formats)',
        ],
              suggested_tools: [],
      },
      {
        name: language === 'fr' ? 'UX & Usability' : 'UX & Usability',
        score: 75,
        issues: [
          language === 'fr' ? 'Améliorez la navigation et la structure du site' : 'Improve navigation and site structure',
          language === 'fr' ? 'Optimisez le parcours utilisateur et les flux de conversion' : 'Optimize user journey and conversion flows',
          language === 'fr' ? 'Vérifiez la clarté des informations et la facilité d\'utilisation' : 'Check information clarity and ease of use',
          language === 'fr' ? 'Améliorez la lisibilité et la hiérarchie de l\'information' : 'Improve readability and information hierarchy',
          language === 'fr' ? 'Optimisez les formulaires et les interactions utilisateur' : 'Optimize forms and user interactions',
        ],
              suggested_tools: [],
      },
      {
        name: language === 'fr' ? 'Accessibility (a11y)' : 'Accessibility (a11y)',
        score: 70,
        issues: [
          language === 'fr' ? 'Ajoutez des attributs alt descriptifs à toutes les images' : 'Add descriptive alt attributes to all images',
          language === 'fr' ? 'Vérifiez le contraste des couleurs (WCAG AA minimum)' : 'Check color contrast (WCAG AA minimum)',
          language === 'fr' ? 'Assurez-vous que le site est navigable au clavier' : 'Ensure the site is keyboard navigable',
          language === 'fr' ? 'Ajoutez des labels ARIA pour les éléments interactifs' : 'Add ARIA labels for interactive elements',
          language === 'fr' ? 'Vérifiez la lisibilité et la taille des polices' : 'Check readability and font sizes',
        ],
              suggested_tools: [],
      },
      {
        name: language === 'fr' ? 'Business & Marketing' : 'Business & Marketing',
        score: 70,
        issues: [
          language === 'fr' ? 'Clarifiez votre positionnement et votre proposition de valeur unique' : 'Clarify your positioning and unique value proposition',
          language === 'fr' ? 'Optimisez votre message marketing et votre storytelling' : 'Optimize your marketing message and storytelling',
          language === 'fr' ? 'Améliorez votre stratégie de contenu et votre présence sociale' : 'Improve your content strategy and social presence',
          language === 'fr' ? 'Vérifiez la cohérence de votre branding et de votre identité' : 'Check consistency of your branding and identity',
          language === 'fr' ? 'Optimisez vos stratégies de conversion et vos CTA' : 'Optimize your conversion strategies and CTAs',
        ],
              suggested_tools: [],
      },
      {
        name: language === 'fr' ? 'Performance & Optimisation' : 'Performance & Optimization',
        score: 75,
        issues: [
          language === 'fr' ? 'Optimisez la vitesse de chargement des pages' : 'Optimize page loading speed',
          language === 'fr' ? 'Compressez et optimisez les images et ressources' : 'Compress and optimize images and resources',
          language === 'fr' ? 'Vérifiez la mise en cache et la gestion des ressources statiques' : 'Check caching and static resource management',
          language === 'fr' ? 'Optimisez le code JavaScript et CSS (minification)' : 'Optimize JavaScript and CSS code (minification)',
          language === 'fr' ? 'Vérifiez les performances sur mobile et les connexions lentes' : 'Check performance on mobile and slow connections',
        ],
              suggested_tools: [],
      },
    ],
    generated_at: new Date().toISOString(),
  };
}

