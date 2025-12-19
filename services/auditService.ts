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
2. Pour CHAQUE problème détecté, tu DOIS suggérer un outil SimplePlate spécifique qui peut le RÉPARER
3. Format de réponse: JSON strict avec cette structure:
{
  "overall_score": 75,
  "categories": [
    {
      "name": "Design & UI",
      "score": 80,
      "issues": ["Problème détaillé 1", "Problème détaillé 2", "Problème détaillé 3"],
      "suggested_tools": ["tool-id-1", "tool-id-2"]
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

5. Pour chaque problème, trouve l'outil SimplePlate le plus adapté dans cette liste:
${toolsList}

6. Sois ULTRA-PRÉCIS et ACTIONNABLE:
   - Détecte au moins 3-5 problèmes par catégorie
   - Chaque problème doit être spécifique et mesurable
   - Chaque problème doit avoir un outil SimplePlate pour le corriger
   - Les outils suggérés doivent être pertinents (ex: problème JSON → json-formatter)

7. Score: 0-100 pour chaque catégorie et overall_score (sois sévère mais juste)

8. IMPORTANT: 
   - Analyse le site réellement (pas de réponse générique)
   - Sois exhaustif: plus de problèmes = meilleur audit
   - Réponds UNIQUEMENT avec le JSON, sans texte avant/après
   - Minimum 20 problèmes détectés au total`
    : `You are an expert web and Micro-SaaS auditor. You must analyze the site ${projectUrl} and provide a COMPLETE and DETAILED audit.

STRICT RULES:
1. Analyze ALL aspects: Design/UI, Copywriting, Technical, SEO, UX, Accessibility, Performance
2. For EACH detected issue, you MUST suggest a specific SimplePlate tool
3. Response format: Strict JSON with this structure:
{
  "overall_score": 75,
  "categories": [
    {
      "name": "Design & UI",
      "score": 80,
      "issues": ["Issue 1", "Issue 2"],
      "suggested_tools": ["tool-id-1", "tool-id-2"]
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

5. For each issue, find the most appropriate SimplePlate tool from this list:
${toolsList}

6. Be PRECISE and ACTIONABLE. Each issue must have a SimplePlate solution.

7. Score: 0-100 for each category and overall_score

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
4. Pour chaque problème, suggère l'outil SimplePlate qui peut le corriger
5. Sois exhaustif: minimum 20 problèmes au total
6. Sois spécifique: "Les meta tags manquent" → seo-meta-generator
7. Sois actionnable: chaque problème doit avoir une solution SimplePlate
8. Évalue la qualité de la description: est-elle claire? Convaincante? Optimisée SEO?

Fournis un audit ULTRA-COMPLET avec:
- Score global (0-100) - sois sévère mais juste
- 7-8 catégories minimum avec scores individuels
- 3-5 problèmes détaillés par catégorie
- Outils SimplePlate suggérés pour chaque problème (minimum 1 outil par problème)
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
4. For each issue, suggest the SimplePlate tool that can fix it
5. Be exhaustive: minimum 20 issues total
6. Be specific: "Meta tags missing" → seo-meta-generator
7. Be actionable: each issue must have a SimplePlate solution
8. Evaluate description quality: is it clear? Convincing? SEO optimized?

Provide an ULTRA-COMPLETE audit with:
- Overall score (0-100) - be strict but fair
- Minimum 7-8 categories with individual scores
- 3-5 detailed issues per category
- Suggested SimplePlate tools for each issue (minimum 1 tool per issue)
- Include a "Description & Messaging" category if description is weak

Respond ONLY with valid JSON, no text before/after.`;

  try {
    const response = await askBot(`${systemPrompt}\n\n${userPrompt}`);
    
    // Extraire le JSON de la réponse (peut contenir du markdown ou du texte)
    let jsonString = response.trim();
    
    // Enlever les blocs de code markdown si présents
    jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Trouver le JSON dans la réponse
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }
    
    const auditData = JSON.parse(jsonString);
    
    // Valider et enrichir les données
    const enrichedAudit = enrichAuditWithToolMapping(auditData, tools);
    
    return {
      overall_score: enrichedAudit.overall_score || 0,
      categories: enrichedAudit.categories || [],
      generated_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error performing audit:', error);
    
    // Fallback: Audit de base avec suggestions génériques
    return generateFallbackAudit(projectUrl, projectName, language, tools);
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
    
    // Si pas d'outils suggérés, essayer de les déduire des problèmes
    if (suggestedTools.length === 0 && category.issues) {
      suggestedTools = inferToolsFromIssues(category.issues, category.name, tools);
    }
    
    // Valider que les outils existent
    const validTools = suggestedTools.filter((toolId: string) =>
      tools.some(t => t.id === toolId)
    );
    
    return {
      name: category.name,
      score: Math.max(0, Math.min(100, category.score || 0)),
      issues: category.issues || [],
      suggested_tools: validTools.length > 0 ? validTools : getDefaultToolsForCategory(category.name, tools),
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
 * Génère un audit de fallback si l'IA échoue
 */
function generateFallbackAudit(
  projectUrl: string,
  projectName: string,
  language: 'fr' | 'en',
  tools: any[]
): AIAuditResult {
  const defaultTools = [
    tools.find(t => t.id === 'seo-meta-generator')?.id,
    tools.find(t => t.id === 'business-plan-pro')?.id,
    tools.find(t => t.id === 'json-formatter')?.id,
  ].filter(Boolean) as string[];

  return {
    overall_score: 70,
    categories: [
      {
        name: language === 'fr' ? 'SEO' : 'SEO',
        score: 65,
        issues: [language === 'fr' ? 'Vérifiez vos meta tags et URLs SEO' : 'Check your SEO meta tags and URLs'],
        suggested_tools: [tools.find(t => t.id === 'seo-meta-generator')?.id, tools.find(t => t.id === 'slug-gen')?.id].filter(Boolean) as string[],
      },
      {
        name: language === 'fr' ? 'Copywriting' : 'Copywriting',
        score: 70,
        issues: [language === 'fr' ? 'Optimisez vos textes et headlines' : 'Optimize your texts and headlines'],
        suggested_tools: [tools.find(t => t.id === 'business-plan-pro')?.id].filter(Boolean) as string[],
      },
      {
        name: language === 'fr' ? 'Technical' : 'Technical',
        score: 75,
        issues: [language === 'fr' ? 'Vérifiez la structure de votre code' : 'Check your code structure'],
        suggested_tools: [tools.find(t => t.id === 'json-formatter')?.id].filter(Boolean) as string[],
      },
    ],
    generated_at: new Date().toISOString(),
  };
}

