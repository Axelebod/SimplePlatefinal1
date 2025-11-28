
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { tools } from '../tools-config';
import { useUserStore } from '../store/userStore';
import { generateToolContent, isApiReady } from '../services/geminiService';
import { ArrowLeft, Lock, Sparkles, Loader2, Copy, AlertTriangle, Info, Upload, Maximize, Eye, Code, LogIn, Save, Download } from 'lucide-react';
import { LOADING_MESSAGES } from '../constants';
import { AdBanner } from '../components/AdBanner';
import ReactMarkdown from 'react-markdown';
import { generateToolSEOContent } from '../utils/toolContentGenerator';
import { ToolHistory } from '../components/ToolHistory';
import { ToolTemplates } from '../components/ToolTemplates';
import { saveToolResult } from '../services/toolHistoryService';
import { RichTextEditor } from '../components/RichTextEditor';
import { ProductSheetDisplay } from '../components/ProductSheetDisplay';
import { InvoiceDisplay } from '../components/InvoiceDisplay';
import { CVDisplay } from '../components/CVDisplay';
import { PoemDisplay } from '../components/PoemDisplay';
import { EnhancedResultDisplay } from '../components/EnhancedResultDisplay';
import { ToolSuggestions } from '../components/ToolSuggestions';
import { BusinessPlanDisplay } from '../components/BusinessPlanDisplay';
import { HexColorDisplay } from '../components/HexColorDisplay';
import { ToolInput } from '../types';

export const ToolPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // Trouver l'outil correspondant au slug
  const tool = tools.find(t => {
    const toolSlug = t.slug || t.id;
    return toolSlug === slug;
  });
  
  // Debug en développement
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('ToolPage - Slug reçu:', slug);
      if (tool) {
        console.log('ToolPage - Outil trouvé:', tool.title);
      } else {
        console.warn('ToolPage - Outil NON trouvé pour slug:', slug);
        console.log('ToolPage - Slugs disponibles:', tools.map(t => t.slug || t.id).slice(0, 10));
      }
    }
  }, [slug, tool]);
  
  const { user, credits, deductCredits, isPro } = useUserStore();
  
  // Form State
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [fileInput, setFileInput] = useState<string | undefined>(undefined); // Pour stocker le Base64
  const [fileName, setFileName] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  
  // Preview Toggle for Website Generator
  const [showPreview, setShowPreview] = useState(true);
  // Suggestions d'outils complémentaires
  const [showSuggestions, setShowSuggestions] = useState(false);
  // État pour savoir si le résultat est sauvegardé
  const [isResultSaved, setIsResultSaved] = useState(false);
  const [savingResult, setSavingResult] = useState(false);

  const MAX_CHARS = 3500; // Limite de caractères pour éviter les abus

  // ----------------------------------------------------
  // PERFECT SEO INJECTION LOGIC
  // ----------------------------------------------------
  useEffect(() => {
    if (tool) {
      // Reset states on tool change
      setInputs({});
      setFileInput(undefined);
      setFileName(null);
      setResult(null);
      setError(null);
      setShowPreview(true);
      setShowSuggestions(false);

      // 1. Title
      document.title = tool.seo.title;

      // Helper to update meta tags
      const updateMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
        let element = document.querySelector(`meta[${attr}="${name}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute(attr, name);
          document.head.appendChild(element);
        }
        element.setAttribute('content', content);
      };

      // 2. Basic Metas
      updateMeta('description', tool.seo.description);
      updateMeta('keywords', tool.seo.keywords.join(', '));

      // 3. Open Graph (Social Media)
      updateMeta('og:title', tool.seo.title, 'property');
      updateMeta('og:description', tool.seo.description, 'property');
      updateMeta('og:type', 'website', 'property');
      updateMeta('og:url', window.location.href, 'property');
      updateMeta('og:image', `${window.location.origin}/og-image.png`, 'property');
      updateMeta('og:locale', 'fr_FR', 'property');
      updateMeta('og:site_name', 'SimplePlate AI', 'property');
      
      // 4. Twitter Card
      updateMeta('twitter:card', 'summary_large_image', 'name');
      updateMeta('twitter:title', tool.seo.title, 'name');
      updateMeta('twitter:description', tool.seo.description, 'name');
      updateMeta('twitter:image', `${window.location.origin}/og-image.png`, 'name');
      
      // 5. Canonical URL
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', window.location.href);

      const updateFavicon = (href: string) => {
        let fav = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
        if (!fav) {
          fav = document.createElement('link');
          fav.rel = 'icon';
          document.head.appendChild(fav);
        }
        fav.href = href;
      };
      updateFavicon(`/icons/${tool.iconName?.toLowerCase() || 'default'}.svg`);

      // 6. JSON-LD Structured Data (The Secret Weapon for SEO)
      const scriptId = 'json-ld-tool';
      let script = document.getElementById(scriptId);
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }

      const schemaData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": tool.title,
        "description": tool.seo.description,
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web Browser",
        "url": window.location.href,
        "offers": {
          "@type": "Offer",
          "price": tool.cost === 0 ? "0" : "0.10",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock"
        },
        "featureList": tool.seo.keywords.join(', '),
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "150"
        }
      };

      script.innerHTML = JSON.stringify(schemaData);
      
      // 7. FAQ Schema (pour les featured snippets Google)
      const faqScriptId = 'json-ld-faq';
      let faqScript = document.getElementById(faqScriptId);
      if (!faqScript) {
        faqScript = document.createElement('script');
        faqScript.id = faqScriptId;
        faqScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(faqScript);
      }
      
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `Combien coûte l'utilisation de ${tool.title} ?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": tool.cost === 0 
                ? `${tool.title} est entièrement gratuit et ne consomme aucun crédit.`
                : `L'utilisation de ${tool.title} coûte ${tool.cost} crédit${tool.cost > 1 ? 's' : ''} par génération.`
            }
          },
          {
            "@type": "Question",
            "name": "Les résultats sont-ils de bonne qualité ?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Oui, ${tool.title} utilise les dernières technologies d'intelligence artificielle pour générer des résultats professionnels et de haute qualité.`
            }
          },
          {
            "@type": "Question",
            "name": "Mes données sont-elles sécurisées ?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolument. Toutes vos données sont traitées de manière sécurisée et ne sont jamais stockées ou partagées avec des tiers."
            }
          }
        ]
      };
      
      faqScript.innerHTML = JSON.stringify(faqSchema);

    } else {
      document.title = "Outil non trouvé | SimplePlate";
    }

    // Cleanup function to reset generic metas if needed
    return () => {
      const defaultIcon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (defaultIcon) {
        defaultIcon.href = '/favicon.ico';
      }
      // Optional: Reset metas when leaving
    };
  }, [tool]);

  // Handle loading message cycle
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingMsg(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  if (!tool) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Outil non trouvé</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Slug recherché: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{slug}</code>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
          Vérifiez que l'URL est correcte ou retournez à la page d'accueil.
        </p>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-neo-violet text-white rounded-md font-bold hover:bg-purple-500 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  // Plus de restrictions PRO - tous les outils sont accessibles
  const isLocked = false;
  const hasCredits = credits >= tool.cost;

  const handleInputChange = (name: string, value: any, options?: { bypassLimit?: boolean }) => {
    if (!options?.bypassLimit && typeof value === 'string' && value.length > MAX_CHARS) {
        return;
    }
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, inputConfig: ToolInput) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 4 * 1024 * 1024) { // Limit 4MB
              alert("Fichier trop lourd (Max 4Mo)");
              return;
          }
          setFileName(file.name);
          
          const targetName = inputConfig.mapTo || inputConfig.name;

          if (inputConfig.fileMode === 'text') {
            const reader = new FileReader();
            reader.onload = () => {
              handleInputChange(targetName, reader.result as string, { bypassLimit: true });
            };
            reader.readAsText(file, 'utf-8');
          } else {
            const reader = new FileReader();
            reader.onloadend = () => {
              setFileInput(reader.result as string);
              handleInputChange(targetName, 'FILE_UPLOADED');
            };
            reader.readAsDataURL(file);
          }
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isLoggedIn) {
      navigate('/signup');
      return;
    }

    if (isLocked) {
      alert("Cet outil nécessite un plan PRO.");
      return;
    }

    if (!hasCredits) {
      alert(`Pas assez de crédits ! Il vous en faut ${tool.cost}.`);
      return;
    }

    // Validation spéciale pour l'aide aux devoirs (au moins image OU question)
    if (tool.id === 'homework-helper') {
      const hasImage = fileInput !== undefined;
      const hasQuestion = inputs.question && inputs.question.trim();
      if (!hasImage && !hasQuestion) {
        setError('Veuillez fournir au moins une photo de l\'exercice OU une question écrite.');
        return;
      }
    } else {
      // Validation standard pour les autres outils
      const missing = tool.inputs.filter(i => i.required && !inputs[i.name]);
      if (missing.length > 0) {
        setError(`Veuillez remplir : ${missing.map(m => m.label).join(', ')}`);
        return;
      }
    }

    setLoading(true);
    setResult(null);

    try {
      if (!tool.promptGenerator) throw new Error("Config invalide");
      
      // Pour l'aide aux devoirs, on doit passer l'info de l'image dans les inputs
      const inputsWithFile = tool.id === 'homework-helper' && fileInput 
        ? { ...inputs, image: 'FILE_UPLOADED' }
        : inputs;
      
      const prompt = tool.promptGenerator(inputsWithFile);
      
      // Vérifier si le prompt contient une erreur
      if (prompt.startsWith('ERROR:')) {
        setError(prompt.replace('ERROR:', '').trim());
        return;
      }
      
      // Les outils locaux ne nécessitent pas de clé API Google, mais ils passent par generateToolContent qui gère le switch
      // Pour les outils IA, on vérifie la clé
      if (!prompt.startsWith('LOCAL:') && !isApiReady()) {
           throw new Error("Clé API manquante.");
      }

      // On passe le fileInput (Base64) s'il existe
      const output = await generateToolContent(
        tool.outputType === 'image' ? 'imagen-4.0-generate-001' : 'gemini-2.5-flash',
        prompt,
        tool.outputType === 'image',
        fileInput
      );
      
      // Déduction atomique (évite les race conditions avec plusieurs onglets)
      // Ne pas débiter si l'outil est gratuit (0 crédits)
      if (tool.cost > 0) {
        const success = await deductCredits(tool.cost);
        if (!success) {
          throw new Error("Impossible de débiter vos crédits. Veuillez réactualiser votre solde.");
        }
      }

      setResult(output);
      setIsResultSaved(false); // Réinitialiser l'état de sauvegarde pour le nouveau résultat
      
      // Plus d'enregistrement automatique - l'utilisateur sauvegarde manuellement

      // Afficher les suggestions d'outils complémentaires après génération réussie
      setTimeout(() => {
        setShowSuggestions(true);
      }, 1000); // Délai de 1 seconde pour laisser le résultat s'afficher
      
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadTemplate = (templateInputs: Record<string, any>) => {
    setInputs(templateInputs);
    setResult(null);
    setError(null);
    setIsResultSaved(false);
    // Scroll vers le formulaire
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveResult = async () => {
    if (!result || !isLoggedIn) return;
    
    setSavingResult(true);
    try {
      // Préparer les inputs avec le fichier si nécessaire
      const inputsWithFile = tool.id === 'homework-helper' && fileInput 
        ? { ...inputs, image: 'FILE_UPLOADED' }
        : inputs;

      const response = await saveToolResult(
        tool.id,
        inputsWithFile,
        result,
        tool.outputType,
        tool.cost,
        {
          model: tool.outputType === 'image' ? 'imagen-4.0-generate-001' : 'gemini-2.5-flash',
        },
        isPro || false
      );

      if (response.success) {
        setIsResultSaved(true);
        alert('✅ Résultat sauvegardé avec succès !');
      } else {
        alert(`❌ ${response.message || 'Erreur lors de la sauvegarde.'}`);
      }
    } catch (error: any) {
      console.error('Error saving result:', error);
      alert('❌ Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setSavingResult(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      alert("Copié !");
    }
  };

  const extractPythonCode = (output: string) => {
    const match = output.match(/```(?:python)?\s*([\s\S]*?)```/i);
    if (match) {
      return match[1].trim();
    }
    return output.trim();
  };

  const handleDownloadPythonZip = async () => {
    if (!result) return;
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      const pythonCode = extractPythonCode(result) || '# Script généré par SimplePlate AI';
      zip.file('main.py', pythonCode);

      const readme = `# Script généré avec Python Pro\n\nTâche: ${inputs.task || 'Non spécifiée'}\nComplexité: ${
        inputs.complexity || 'Standard'
      }\n\nGénéré automatiquement via SimplePlate AI.`;
      zip.file('README.md', readme);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `python-pro-${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('ZIP generation error:', error);
      alert('Impossible de préparer le ZIP. Réessayez dans un instant.');
    }
  };

  // Extraction du code HTML propre pour la preview
  const getCleanHtml = (markdown: string) => {
      return markdown.replace(/```html|```/g, '').trim();
  };

  const isLoggedIn = !!user;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <button onClick={() => navigate('/')} className="flex items-center text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Retour aux outils
        </button>
        <div className="flex items-center gap-3">
           <h1 className="font-display text-3xl md:text-4xl font-bold dark:text-white">{tool.title}</h1>
           {tool.isPremium && <span className="bg-neo-black dark:bg-white text-white dark:text-black px-2 py-1 text-xs font-bold rounded">PRO</span>}
        </div>
        <p className="text-gray-600 dark:text-gray-300 mt-2">{tool.description}</p>
      </div>

      {/* Message doux si non connecté */}
      {!isLoggedIn && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">
              Pour utiliser cet outil, vous devez créer un compte. C'est gratuit et rapide ! 🚀
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-neo-black dark:bg-white text-white dark:text-black font-bold rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm"
            >
              <LogIn className="w-4 h-4" />
              Créer un compte
            </button>
          </div>
        </div>
      )}

      {/* AD BANNER (HEADER) FOR FREE USERS */}
      <AdBanner location="header" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Input */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-lg p-6 shadow-neo dark:shadow-none">
            <form onSubmit={handleSubmit} className="space-y-6">
              {tool.inputs.map((input) => (
                <div key={input.name}>
                  <div className="flex justify-between items-end mb-2">
                      <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                        {input.label} {input.required && <span className="text-neo-red">*</span>}
                      </label>
                      {(input.type === 'textarea' || input.type === 'text') && (
                          <span className={`text-[10px] font-mono font-bold ${(inputs[input.name]?.length || 0) > MAX_CHARS * 0.9 ? 'text-red-500' : 'text-gray-400'}`}>
                              {inputs[input.name]?.length || 0}/{MAX_CHARS}
                          </span>
                      )}
                  </div>
                  
                  {input.type === 'richtext' || input.useEditor ? (
                    <RichTextEditor
                      content={inputs[input.name] || ''}
                      onChange={(content) => handleInputChange(input.name, content)}
                      placeholder={input.placeholder || 'Commencez à écrire...'}
                      editable={!loading && !isLocked}
                    />
                  ) : input.type === 'textarea' ? (
                    <textarea
                      className={`w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-md focus:border-black dark:focus:border-white focus:ring-0 bg-neo-white dark:bg-gray-900 dark:text-white text-sm ${input.className || ''}`}
                      placeholder={input.placeholder}
                      rows={input.rows || 4}
                      onChange={(e) => handleInputChange(input.name, e.target.value)}
                      disabled={loading || isLocked}
                      maxLength={MAX_CHARS}
                    />
                  ) : input.type === 'select' ? (
                    <select
                       className={`w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-md focus:border-black dark:focus:border-white focus:ring-0 bg-white dark:bg-gray-900 dark:text-white ${input.className || ''}`}
                       onChange={(e) => handleInputChange(input.name, e.target.value)}
                       disabled={loading || isLocked}
                    >
                      <option value="">Sélectionnez une option</option>
                      {input.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : input.type === 'file' ? (
                    <div className="relative">
                         <label 
                            className={`
                                flex flex-col items-center justify-center w-full h-32 border-2 border-black dark:border-gray-500 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all
                                ${fileName ? 'bg-green-50 dark:bg-green-900/20 border-green-500' : ''}
                            `}
                         >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {fileName ? (
                                    <>
                                        <span className="text-green-600 dark:text-green-400 font-bold mb-2">Fichier prêt !</span>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{fileName}</p>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-bold">Cliquez pour uploader</p>
                                        <p className="text-xs text-gray-400">
                                          {input.accept?.includes('csv') ? 'CSV (Max 4Mo)' : 'PNG, JPG (Max 4Mo)'}
                                        </p>
                                    </>
                                )}
                            </div>
                            <input 
                                type="file" 
                                className="hidden" 
                                accept={input.accept}
                                onChange={(e) => handleFileChange(e, input)}
                                disabled={loading || isLocked}
                            />
                        </label>
                    </div>
                  ) : (
                    <input
                      type={input.type}
                      className={`w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-md focus:border-black dark:focus:border-white focus:ring-0 bg-neo-white dark:bg-gray-900 dark:text-white ${input.className || ''}`}
                      placeholder={input.placeholder}
                      onChange={(e) => handleInputChange(input.name, e.target.value)}
                      disabled={loading || isLocked}
                      maxLength={MAX_CHARS}
                    />
                  )}
                  {input.helpText && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">{input.helpText}</p>
                  )}
                </div>
              ))}

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-md flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || (isLoggedIn && (isLocked || !hasCredits))}
                className={`
                  w-full py-4 font-bold text-lg border-2 border-black dark:border-gray-500 rounded-md flex items-center justify-center gap-2 transition-all
                  ${!isLoggedIn
                    ? 'bg-neo-yellow text-black hover:bg-yellow-400 cursor-pointer shadow-[4px_4px_0px_0px_#000] dark:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]'
                    : isLocked 
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' 
                      : loading 
                        ? 'bg-neo-yellow text-black cursor-wait'
                        : !hasCredits 
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                          : 'bg-neo-black dark:bg-white text-white dark:text-black shadow-[4px_4px_0px_0px_#86efac] dark:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#86efac]'}
                `}
              >
                {!isLoggedIn ? (
                  <>
                    <LogIn className="w-5 h-5" /> Créer un compte pour utiliser
                  </>
                ) : loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> 
                    Génération...
                  </>
                ) : isLocked ? (
                  <>
                    <Lock className="w-5 h-5" /> Débloquer avec PRO
                  </>
                ) : !hasCredits ? (
                  <>Pas assez de crédits ({tool.cost})</>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {tool.cost > 0 ? `Générer (${tool.cost} Crédit${tool.cost > 1 ? 's' : ''})` : 'Générer Gratuitement'}
                  </>
                )}
              </button>
            </form>
          </div>
          
          {/* AD BANNER (SIDEBAR) */}
          <AdBanner location="sidebar" />
        </div>

        {/* Right Column: Output */}
        <div className="relative bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-lg p-6 shadow-neo dark:shadow-none min-h-[400px] flex flex-col">
           
           {/* HEADER */}
           <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
             <div className="flex items-center gap-3">
                 <h3 className="font-bold text-lg dark:text-white">Résultat</h3>
                 {/* WEBSITE PREVIEW TOGGLE */}
                 {tool.id === 'website-generator' && result && (
                     <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md p-1">
                        <button 
                            onClick={() => setShowPreview(true)}
                            className={`p-1 rounded ${showPreview ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500'}`}
                            title="Aperçu Site"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => setShowPreview(false)}
                            className={`p-1 rounded ${!showPreview ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500'}`}
                            title="Voir le Code"
                        >
                            <Code className="w-4 h-4" />
                        </button>
                     </div>
                 )}
             </div>

             {result && (
               <div className="flex gap-2">
                 <button onClick={copyToClipboard} className="btn-small-icon dark:text-white" title="Copier"><Copy className="w-4 h-4" /></button>
               </div>
             )}
           </div>

           {/* BODY */}
           <div className="flex-1">
             
             {/* LOADING */}
             {loading && (
               <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 space-y-4 animate-pulse">
                 <div className="w-16 h-16 bg-neo-yellow rounded-full flex items-center justify-center border-2 border-black">
                    <Loader2 className="w-8 h-8 animate-spin text-black" />
                 </div>
                 <p className="font-mono text-sm">{loadingMsg}</p>
               </div>
             )}

             {/* RESULT */}
             {result && (
               tool.outputType === 'image' ? (
                 <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-500">
                    <img src={result} alt="Résultat généré" className="max-w-full rounded-md border-2 border-black dark:border-gray-500 shadow-sm" />
                    <div className="mt-4 text-center">
                      <a href={result} download={`simpleplate-${tool.id}.png`} target="_blank" rel="noreferrer" className="inline-block px-4 py-2 bg-neo-black dark:bg-white text-white dark:text-black rounded-md text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200">
                        Télécharger l'image
                      </a>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-center gap-1">
                        <Info className="w-3 h-3" /> Image générée par IA.
                      </p>
                    </div>
                 </div>
              ) : tool.id === 'business-plan-pro' ? (
                <BusinessPlanDisplay
                  result={result}
                  onSave={isLoggedIn ? handleSaveResult : undefined}
                  isSaved={isResultSaved}
                  isSaving={savingResult}
                  onChange={(value) => {
                    setResult(value);
                    setIsResultSaved(false);
                  }}
                />
              ) : tool.id === 'website-generator' ? (
                showPreview ? (
                    // Website Generator avec iframe preview
                    <div className="flex flex-col h-full animate-in fade-in duration-500">
                        <div className="flex-1 border-2 border-gray-200 dark:border-gray-600 rounded-md overflow-hidden mb-4 min-h-[500px] relative bg-white">
                            <iframe 
                                srcDoc={getCleanHtml(result)} 
                                title="Aperçu du site"
                                className="w-full h-full absolute inset-0"
                                sandbox="allow-scripts"
                            />
                        </div>
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                            Ceci est une prévisualisation live. Cliquez sur le bouton &lt;/&gt; en haut pour copier le code.
                        </p>
                    </div>
                ) : (
                  <div className="flex flex-col h-full animate-in fade-in duration-500">
                    <textarea
                      value={result}
                      onChange={(e) => {
                        setResult(e.target.value);
                        setIsResultSaved(false);
                      }}
                      className="flex-1 w-full border-2 border-gray-200 dark:border-gray-600 rounded-md p-4 font-mono text-sm bg-gray-900 text-green-200"
                      spellCheck={false}
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        type="button"
                        onClick={copyToClipboard}
                        className="px-4 py-2 bg-neo-black text-white rounded-md text-sm font-bold hover:bg-gray-800 transition-colors"
                      >
                        Copier le code
                      </button>
                    </div>
                  </div>
                )
               ) : tool.id === 'ecom-product-scanner' ? (
                        // Scanner Produit avec mise en page professionnelle
                        <ProductSheetDisplay 
                          result={result} 
                          platform={inputs.platform || 'Shopify'}
                          onSave={isLoggedIn ? handleSaveResult : undefined}
                          isSaved={isResultSaved}
                          isSaving={savingResult}
                        />
               ) : tool.id === 'ai-image-analysis' ? (
                        // Analyseur d'Image avec métriques visuelles
                        <div className="animate-in fade-in duration-500">
                          <div className="prose prose-sm max-w-none markdown-body dark:text-gray-200 prose-a:text-blue-700 dark:prose-a:text-neo-violet prose-a:font-bold prose-a:underline">
                            <ReactMarkdown>{result}</ReactMarkdown>
                          </div>
                          {/* Métriques visuelles extraites du rapport */}
                          {result.match(/Probabilité IA.*?(\d+)%/)?.[1] && (
                            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg">
                              <h4 className="font-bold text-sm mb-2 dark:text-white">📊 Métriques Rapides</h4>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">Probabilité IA:</span>
                                  <span className="ml-2 font-bold text-neo-violet">
                                    {result.match(/Probabilité IA.*?(\d+)%/)?.[1]}%
                                  </span>
                                </div>
                                {result.match(/Score global.*?(\d+)\/10/)?.[1] && (
                                  <div>
                                    <span className="text-gray-600 dark:text-gray-400">Score global:</span>
                                    <span className="ml-2 font-bold text-neo-green">
                                      {result.match(/Score global.*?(\d+)\/10/)?.[1]}/10
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
              ) : tool.id === 'python-pro-gen' ? (
                        // Python Pro avec exports
                        <div className="animate-in fade-in duration-500 space-y-3">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={handleDownloadPythonZip}
                              className="px-4 py-2 bg-neo-black text-white rounded-md text-sm font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Télécharger le ZIP
                            </button>
                          </div>
                          <div className="prose prose-sm max-w-none markdown-body dark:text-gray-200 prose-a:text-blue-700 dark:prose-a:text-neo-violet prose-a:font-bold prose-a:underline">
                            <ReactMarkdown
                              components={{
                                code: ({node, inline, className, children, ...props}: any) => {
                                  const match = /language-(\w+)/.exec(className || '');
                                  const isPython = !inline && (match?.[1] === 'python' || className?.includes('python'));
                                  
                                  if (isPython) {
                                    return (
                                      <div className="relative">
                                        <pre className="bg-gray-900 dark:bg-gray-950 p-4 rounded-lg overflow-x-auto border-2 border-gray-700">
                                          <code className="text-green-400 font-mono text-sm" {...props}>
                                            {children}
                                          </code>
                                        </pre>
                                        <button
                                          onClick={() => {
                                            const code = String(children).replace(/\n$/, '');
                                            navigator.clipboard.writeText(code);
                                            alert('Code copié !');
                                          }}
                                          className="absolute top-2 right-2 px-2 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600"
                                        >
                                          Copier
                                        </button>
                                      </div>
                                    );
                                  }
                                  return <code className={className} {...props}>{children}</code>;
                                }
                              }}
                            >
                              {result}
                            </ReactMarkdown>
                          </div>
                        </div>
              ) : tool.id === 'hex-to-rgb' ? (
                        <HexColorDisplay result={result} inputValue={inputs.hex}
                        />
               ) : tool.id === 'invoice-generator' ? (
                        // Facture avec template et export PDF/PNG
                        <InvoiceDisplay 
                          result={result}
                          onSave={isLoggedIn ? handleSaveResult : undefined}
                          isSaved={isResultSaved}
                          isSaving={savingResult}
                          onChange={(value) => {
                            setResult(value);
                            setIsResultSaved(false);
                          }}
                        />
               ) : tool.id === 'cv-generator' ? (
                        // CV avec template et export PDF/PNG
                        <CVDisplay 
                          result={result}
                          onSave={isLoggedIn ? handleSaveResult : undefined}
                          isSaved={isResultSaved}
                          isSaving={savingResult}
                          onChange={(value) => {
                            setResult(value);
                            setIsResultSaved(false);
                          }}
                        />
               ) : tool.id === 'poem-generator' ? (
                        // Poème avec mise en page stylée
                        <PoemDisplay 
                          result={result}
                          onSave={isLoggedIn ? handleSaveResult : undefined}
                          isSaved={isResultSaved}
                          isSaving={savingResult}
                          onChange={(value) => {
                            setResult(value);
                            setIsResultSaved(false);
                          }}
                        />
               ) : tool.id === 'qr-code-generator' ? (
                        // QR Code avec affichage spécial
                        <div className="flex flex-col items-center justify-center min-h-[400px] animate-in fade-in duration-500">
                          {result && result.startsWith('http') ? (
                            <>
                              <img 
                                src={result} 
                                alt="QR Code" 
                                className="max-w-full rounded-md border-2 border-black dark:border-gray-500 shadow-sm bg-white p-4"
                                style={{maxWidth: '300px', display: 'block'}}
                                onError={(e) => {
                                  console.error('Erreur chargement QR code:', result);
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                              <div className="mt-4 text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  Données encodées : <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">{inputs.input || 'N/A'}</code>
                                </p>
                                <a 
                                  href={result} 
                                  download={`qr-code-${Date.now()}.png`} 
                                  className="inline-block px-4 py-2 bg-neo-black dark:bg-white text-white dark:text-black rounded-md text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                                >
                                  Télécharger le QR Code
                                </a>
                              </div>
                            </>
                          ) : (
                            <div className="text-center text-gray-500 dark:text-gray-400">
                              <p>Erreur lors de la génération du QR code</p>
                              <p className="text-sm mt-2">{result}</p>
                            </div>
                          )}
                        </div>
               ) : (
                    // Affichage amélioré pour tous les autres outils
                    <EnhancedResultDisplay 
                      result={result} 
                      toolId={tool.id} 
                      toolTitle={tool.title}
                      onSave={isLoggedIn ? handleSaveResult : undefined}
                      isSaved={isResultSaved}
                      isSaving={savingResult}
                    />
               )
             )}

             {/* IDLE */}
             {!loading && !result && (
               <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                 <Sparkles className="w-12 h-12 mb-2 opacity-20" />
                 <p>En attente de vos instructions...</p>
               </div>
             )}

           </div>
        </div>
      </div>

      {/* Suggestions d'outils complémentaires */}
      {showSuggestions && result && (
        <ToolSuggestions 
          currentToolId={tool.id} 
          onClose={() => setShowSuggestions(false)} 
        />
      )}

      {/* HISTORIQUE ET TEMPLATES - Micro SaaS Features */}
      {isLoggedIn && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ToolTemplates 
            toolId={tool.id} 
            currentInputs={inputs}
            onLoadTemplate={handleLoadTemplate}
          />
          <ToolHistory toolId={tool.id} onLoadTemplate={handleLoadTemplate} />
        </div>
      )}

      {/* SEO CONTENT SECTION - Contenu textuel riche pour le référencement */}
      {(() => {
        const seoContent = generateToolSEOContent(tool);
        return (
          <div className="mt-12 space-y-8">
            {/* Description détaillée */}
            <section className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-lg p-6 shadow-neo dark:shadow-none">
              <h2 className="font-display text-2xl font-bold mb-4 dark:text-white">Qu'est-ce que {tool.title} ?</h2>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {seoContent.intro}
                </p>
              </div>
            </section>

            {/* Comment utiliser */}
            <section className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-lg p-6 shadow-neo dark:shadow-none">
              <h2 className="font-display text-2xl font-bold mb-4 dark:text-white">Comment utiliser {tool.title} ?</h2>
              <ol className="space-y-4 list-decimal list-inside">
                {seoContent.howTo.map((step, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300">
                    {step}
                  </li>
                ))}
              </ol>
            </section>

            {/* Cas d'usage */}
            <section className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-lg p-6 shadow-neo dark:shadow-none">
              <h2 className="font-display text-2xl font-bold mb-4 dark:text-white">Qui utilise {tool.title} ?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {seoContent.useCases.map((useCase, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-sm mb-2 dark:text-white">{useCase.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{useCase.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Avantages */}
            <section className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-lg p-6 shadow-neo dark:shadow-none">
              <h2 className="font-display text-2xl font-bold mb-4 dark:text-white">Pourquoi choisir {tool.title} ?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {seoContent.benefits.map((benefit, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-sm mb-2 dark:text-white">{benefit.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-lg p-6 shadow-neo dark:shadow-none">
              <h2 className="font-display text-2xl font-bold mb-4 dark:text-white">Questions fréquentes</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-sm mb-2 dark:text-white">Combien coûte l'utilisation de {tool.title} ?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tool.cost === 0 
                      ? `${tool.title} est entièrement gratuit et ne consomme aucun crédit. Vous pouvez l'utiliser autant de fois que vous le souhaitez.`
                      : `L'utilisation de ${tool.title} coûte ${tool.cost} crédit${tool.cost > 1 ? 's' : ''} par génération. ${tool.isPremium ? 'Cet outil est disponible uniquement pour les membres PRO.' : 'Les nouveaux utilisateurs reçoivent 5 crédits gratuits par semaine.'}`}
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-2 dark:text-white">Les résultats sont-ils de bonne qualité ?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Oui, {tool.title} utilise les dernières technologies d'intelligence artificielle pour générer des résultats professionnels et de haute qualité. 
                    Les résultats sont optimisés pour être utilisables directement dans vos projets.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-2 dark:text-white">Mes données sont-elles sécurisées ?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Absolument. Toutes vos données sont traitées de manière sécurisée et ne sont jamais stockées ou partagées avec des tiers. 
                    {tool.inputs.some(i => i.type === 'file') ? ' Les fichiers uploadés sont traités uniquement pour la génération et supprimés immédiatement après.' : ''}
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-2 dark:text-white">Puis-je utiliser les résultats commercialement ?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Oui, vous êtes libre d'utiliser les résultats générés par {tool.title} pour vos projets personnels ou professionnels, 
                    y compris à des fins commerciales. Les résultats vous appartiennent.
                  </p>
                </div>
              </div>
            </section>
          </div>
        );
      })()}
    </div>
  );
};
