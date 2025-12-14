
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { tools } from '../tools-config';
import { useUserStore } from '../store/userStore';
import { isApiReady } from '../services/geminiService';
import { ArrowLeft, Lock, Sparkles, Loader2, Copy, AlertTriangle, Info, Upload, Maximize, Eye, Code, LogIn, Save, Download } from 'lucide-react';
import { LOADING_MESSAGES } from '../constants';
import ReactMarkdown from 'react-markdown';
import { generateToolSEOContent } from '../utils/toolContentGenerator';
import { ToolHistory } from '../components/ToolHistory';
import { ToolTemplates } from '../components/ToolTemplates';
import { saveToolResult } from '../services/toolHistoryService';
import { incrementGenerationCounter } from '../services/generationCounterService';
import { RichTextEditor } from '../components/RichTextEditor';
import { ProductSheetDisplay } from '../components/ProductSheetDisplay';
import { InvoiceDisplay } from '../components/InvoiceDisplay';
import { CVDisplay } from '../components/CVDisplay';
import { PoemDisplay } from '../components/PoemDisplay';
import { EnhancedResultDisplay } from '../components/EnhancedResultDisplay';
import { ToolSuggestions } from '../components/ToolSuggestions';
import { BusinessPlanStudio } from '../components/BusinessPlanStudio';
import { HexColorDisplay } from '../components/HexColorDisplay';
import { TextAnalyzerDisplay } from '../components/TextAnalyzerDisplay';
import { JsonFormatterDisplay } from '../components/JsonFormatterDisplay';
import { DecisionWheel } from '../components/DecisionWheel';
import { HtmlResultDisplay } from '../components/HtmlResultDisplay';
import { PxRemDisplay } from '../components/PxRemDisplay';
import { BrandNameStudio } from '../components/BrandNameStudio';
import { ToolInput } from '../types';
import { useToolSEO } from '../hooks/useToolSEO';
import { useToolGeneration } from '../hooks/useToolGeneration';
import { useDebounce } from '../hooks/useDebounce';
import { useTranslation } from '../hooks/useTranslation';

export const ToolPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
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
  
  const { user, credits, deductCredits } = useUserStore();
  
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

  // Hook SEO (remplace toute la logique SEO)
  useToolSEO(tool);

  // Hook de génération avec retry logic
  const { generate, loading: generationLoading, error: generationError, result: generationResult, setResult: setGenerationResult } = useToolGeneration({
    tool: tool!,
    onSuccess: (result) => {
      setResult(result);
      setTimeout(() => {
        setShowSuggestions(true);
      }, 1000);
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  // Compter chaque génération réussie pour les stats (sans sauvegarder le résultat)
  useEffect(() => {
    if (result && user && tool) {
      // Éviter les comptages multiples pour le même résultat
      const countKey = `${tool.id}-${result.substring(0, 50)}`;
      const lastCountKey = sessionStorage.getItem('last_generation_count');
      
      if (lastCountKey === countKey) return; // Déjà compté
      
      // Compter la génération (silencieux)
      incrementGenerationCounter(tool.id);
      sessionStorage.setItem('last_generation_count', countKey);
    }
  }, [result, user, tool]);

  // Reset states on tool change
  useEffect(() => {
    if (tool) {
      setInputs({});
      setFileInput(undefined);
      setFileName(null);
      setResult(null);
      setError(null);
      setShowPreview(true);
      setShowSuggestions(false);
      setIsResultSaved(false);
    }
  }, [tool?.id]);

  // Sync generation state with local state
  useEffect(() => {
    setLoading(generationLoading);
  }, [generationLoading]);

  useEffect(() => {
    if (generationError) {
      setError(generationError);
    }
  }, [generationError]);

  useEffect(() => {
    if (generationResult) {
      setResult(generationResult);
    }
  }, [generationResult]);

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
        <h2 className="text-2xl font-bold mb-4 dark:text-white">{t('tools.toolNotFound')}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          {t('tools.slugSearched')}: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{slug}</code>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
          {t('tools.checkUrl')}
        </p>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-neo-violet text-white rounded-md font-bold hover:bg-purple-500 transition-colors"
        >
          {t('notFound.backHome')}
        </Link>
      </div>
    );
  }

  const hasCredits = credits >= tool.cost;

  // Pour px-to-rem, initialiser le résultat directement
  useEffect(() => {
    if (tool.id === 'px-to-rem' && !result) {
      setResult('### Conversions (Base: 16px)\n\n| Original | Pixels | REM | EM |\n|---------|--------|-----|-----|\n\n*Utilisez l\'interface graphique ci-dessous pour ajouter des conversions.*');
    }
  }, [tool.id, result]);

  // Debounced input pour les champs texte (optimisation)
  const debouncedInputs = useDebounce(inputs, 300);

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

    if (!hasCredits) {
      alert(`${t('tools.noCredits')} ${t('tools.creditsRequired')} ${tool.cost}.`);
      return;
    }

    // Cas spécial pour l'outil couleur : afficher directement le résultat
    if (tool.id === 'hex-to-rgb' && inputs.hex) {
      const hex = inputs.hex.replace('#', '');
      if (hex.length === 6 && /^[0-9A-Fa-f]{6}$/.test(hex)) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        setResult(`HEX: #${hex.toUpperCase()}\nRGB: rgb(${r}, ${g}, ${b})`);
        return;
      } else {
        setError('Code Hex invalide (doit être 6 caractères, ex: #FF0000)');
        return;
      }
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
        setError(`${t('tools.fillRequired')}: ${missing.map(m => m.label).join(', ')}`);
        return;
      }
    }

    setResult(null); // Clear previous result
    setShowSuggestions(false); // Hide suggestions when generating new result
    setIsResultSaved(false); // Reset saved state on new generation

    // Vérifier la clé API pour les outils IA
    if (!tool.promptGenerator) {
      setError("Config invalide");
      return;
    }

    const inputsWithFile = tool.id === 'homework-helper' && fileInput 
      ? { ...inputs, image: 'FILE_UPLOADED' }
      : inputs;
    
    const prompt = tool.promptGenerator(inputsWithFile);
    
    // Vérifier si le prompt contient une erreur
    if (prompt.startsWith('ERROR:')) {
      setError(prompt.replace('ERROR:', '').trim());
      return;
    }
    
    // Les outils locaux ne nécessitent pas de clé API Google
    if (!prompt.startsWith('LOCAL:') && !isApiReady()) {
      setError("Clé API manquante.");
      return;
    }

    // Générer avec le hook (inclut retry logic)
    await generate(inputsWithFile, fileInput);
    
    // Déduction atomique après génération réussie
    // Ne pas débiter si l'outil est gratuit (0 crédits)
    if (tool.cost > 0 && result) {
      const success = await deductCredits(tool.cost);
      if (!success) {
        setError("Impossible de débiter vos crédits. Veuillez réactualiser votre solde.");
        setResult(null);
      }
    }
  };

  const handleSubmitFromComponent = async (data: { prompt: string; data: any }) => {
    setError(null);
    setResult(null);
    setShowSuggestions(false);
    setIsResultSaved(false);
    
    // Mettre à jour les inputs pour la sauvegarde
    setInputs(data.data);
    
    // Générer avec le prompt fourni - utiliser directement le service
    if (!isApiReady()) {
      setError("Clé API manquante.");
      return;
    }
    
    // Appeler generate normalement - il utilisera le promptGenerator du tool
    await generate(data.data, undefined);
    
    // Déduction atomique après génération réussie
    if (tool.cost > 0 && result) {
      const success = await deductCredits(tool.cost);
      if (!success) {
        setError("Impossible de débiter vos crédits. Veuillez réactualiser votre solde.");
        setResult(null);
      }
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
        false,
        false // skipLimitCheck = false pour sauvegarde manuelle (avec limites)
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

      <div className={`grid grid-cols-1 ${tool.id === 'px-to-rem' || tool.id === 'brand-name-gen' || tool.id === 'business-plan-pro' ? '' : 'lg:grid-cols-2'} gap-8`}>
        {/* Left Column: Input */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-lg p-6 shadow-neo dark:shadow-none">
            {/* Pour px-to-rem et brand-name-gen, afficher directement l'interface graphique */}
            {tool.id === 'px-to-rem' ? (
              <PxRemDisplay result={result || '### Conversions (Base: 16px)\n\n| Original | Pixels | REM | EM |\n|---------|--------|-----|-----|\n\n*Utilisez l\'interface graphique ci-dessous pour ajouter des conversions.*'} baseSize={16} />
            ) : tool.id === 'brand-name-gen' ? (
              <BrandNameStudio 
                result={result ? String(result) : ''} 
                inputValue={inputs.project ? String(inputs.project) : undefined}
                onSave={isLoggedIn ? handleSaveResult : undefined}
                isSaved={isResultSaved}
                isSaving={savingResult}
                onChange={(value) => {
                  setResult(value);
                  setIsResultSaved(false);
                }}
                onSubmit={(data) => {
                  // Gérer la soumission depuis le composant
                  if (tool && tool.promptGenerator) {
                    const prompt = tool.promptGenerator(data);
                    if (prompt && !prompt.startsWith('ERROR:')) {
                      handleSubmitFromComponent({ prompt, data });
                    }
                  }
                }}
                tool={tool}
                hasCredits={hasCredits || false}
                loading={loading || false}
              />
            ) : tool.id === 'business-plan-pro' ? (
              <BusinessPlanStudio
                result={result ? String(result) : ''}
                inputValue={inputs.input ? String(inputs.input) : undefined}
                onSave={isLoggedIn ? handleSaveResult : undefined}
                isSaved={isResultSaved}
                isSaving={savingResult}
                onChange={(value) => {
                  setResult(value);
                  setIsResultSaved(false);
                }}
                onSubmit={(data) => {
                  if (tool && tool.promptGenerator) {
                    const prompt = tool.promptGenerator(data.data);
                    if (prompt && !prompt.startsWith('ERROR:')) {
                      handleSubmitFromComponent({ prompt, data: data.data });
                    }
                  }
                }}
                tool={tool}
                hasCredits={hasCredits || false}
                loading={loading || false}
              />
            ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {tool.inputs.map((input) => (
                <div key={input.name}>
                            <div className="flex justify-between items-end mb-2">
                                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                                  {input.label} {input.required && <span className="text-neo-red">*</span>}
                                </label>
                                {input.type === 'textarea' && (
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
                      editable={!loading}
                    />
                  ) : input.type === 'textarea' ? (
                    <textarea
                      className={`w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-md focus:border-black dark:focus:border-white focus:ring-0 bg-neo-white dark:bg-gray-900 dark:text-white text-sm ${input.className || ''}`}
                      placeholder={input.placeholder}
                      rows={input.rows || 4}
                      onChange={(e) => handleInputChange(input.name, e.target.value)}
                      disabled={loading}
                      maxLength={MAX_CHARS}
                    />
                  ) : input.type === 'select' ? (
                    <select
                       className={`w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-md focus:border-black dark:focus:border-white focus:ring-0 bg-white dark:bg-gray-900 dark:text-white ${input.className || ''}`}
                       onChange={(e) => handleInputChange(input.name, e.target.value)}
                       disabled={loading}
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
                                disabled={loading}
                            />
                        </label>
                    </div>
                  ) : input.type === 'color' ? (
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={inputs[input.name] || '#000000'}
                        onChange={(e) => {
                          handleInputChange(input.name, e.target.value);
                          // Pour l'outil couleur, mettre à jour le résultat automatiquement
                          if (tool.id === 'hex-to-rgb') {
                            const hex = e.target.value.replace('#', '');
                            if (hex.length === 6 && /^[0-9A-Fa-f]{6}$/.test(hex)) {
                              const r = parseInt(hex.substring(0, 2), 16);
                              const g = parseInt(hex.substring(2, 4), 16);
                              const b = parseInt(hex.substring(4, 6), 16);
                              setResult(`HEX: #${hex.toUpperCase()}\nRGB: rgb(${r}, ${g}, ${b})`);
                            }
                          }
                        }}
                        disabled={loading}
                        className="w-24 h-24 rounded-lg border-4 border-black dark:border-white cursor-pointer shadow-neo-sm dark:shadow-[2px_2px_0px_0px_#fff]"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={inputs[input.name] || '#000000'}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^#[0-9A-Fa-f]{6}$/i.test(val)) {
                              handleInputChange(input.name, val.toUpperCase());
                              // Pour l'outil couleur, mettre à jour le résultat automatiquement
                              if (tool.id === 'hex-to-rgb') {
                                const hex = val.replace('#', '').toUpperCase();
                                const r = parseInt(hex.substring(0, 2), 16);
                                const g = parseInt(hex.substring(2, 4), 16);
                                const b = parseInt(hex.substring(4, 6), 16);
                                setResult(`HEX: #${hex}\nRGB: rgb(${r}, ${g}, ${b})`);
                              }
                            }
                          }}
                          className={`w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-md focus:border-black dark:focus:border-white focus:ring-0 bg-neo-white dark:bg-gray-900 dark:text-white font-mono font-bold ${input.className || ''}`}
                          placeholder="#000000"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  ) : (
                    <input
                      type={input.type}
                      className={`w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-md focus:border-black dark:focus:border-white focus:ring-0 bg-neo-white dark:bg-gray-900 dark:text-white ${input.className || ''}`}
                      placeholder={input.placeholder}
                      onChange={(e) => handleInputChange(input.name, e.target.value)}
                      disabled={loading}
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
                disabled={loading || (isLoggedIn && !hasCredits)}
                className={`
                  w-full py-4 font-bold text-lg border-2 border-black dark:border-gray-500 rounded-md flex items-center justify-center gap-2 transition-all
                  ${!isLoggedIn
                    ? 'bg-neo-yellow text-black hover:bg-yellow-400 cursor-pointer shadow-[4px_4px_0px_0px_#000] dark:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]'
                    : loading 
                        ? 'bg-neo-yellow text-black cursor-wait'
                        : !hasCredits 
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                          : 'bg-neo-black dark:bg-white text-white dark:text-black shadow-[4px_4px_0px_0px_#86efac] dark:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#86efac]'}
                `}
              >
                {!isLoggedIn ? (
                  <>
                    <LogIn className="w-5 h-5" /> {t('tools.createAccount')} {t('tools.toUse')}
                  </>
                ) : loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> 
                    {t('tools.loading')}
                  </>
                ) : !hasCredits ? (
                  <>{t('tools.noCredits')} ({tool.cost})</>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {tool.cost > 0 ? `Générer (${tool.cost} Crédit${tool.cost > 1 ? 's' : ''})` : 'Générer Gratuitement'}
                  </>
                )}
              </button>
            </form>
          )}
          </div>
          
        </div>

        {/* Right Column: Output - Masqué pour px-to-rem et brand-name-gen */}
        {tool.id !== 'px-to-rem' && tool.id !== 'brand-name-gen' && (
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
             {!loading && result && (
               tool.outputType === 'image' ? (
                 <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-500">
                    <img src={String(result)} alt="Résultat généré" className="max-w-full rounded-md border-2 border-black dark:border-gray-500 shadow-sm" onError={(e) => { e.currentTarget.src = ''; e.currentTarget.style.display = 'none'; }} />
                    <div className="mt-4 text-center">
                      <a href={String(result)} download={`simpleplate-${tool.id}.png`} target="_blank" rel="noreferrer" className="inline-block px-4 py-2 bg-neo-black dark:bg-white text-white dark:text-black rounded-md text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200">
                        Télécharger l'image
                      </a>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-center gap-1">
                        <Info className="w-3 h-3" /> Image générée par IA.
                      </p>
                    </div>
                 </div>
              ) : tool.id === 'website-generator' ? (
                showPreview ? (
                    // Website Generator avec iframe preview amélioré
                    <div className="flex flex-col h-full animate-in fade-in duration-500">
                        <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-3 text-xs">
                            <span className="px-2 py-1 bg-neo-green text-black rounded font-bold">
                              {result.split('\n').length} lignes
                            </span>
                            <span className="px-2 py-1 bg-neo-blue text-white rounded font-bold">
                              {result.length.toLocaleString()} caractères
                            </span>
                            <span className="px-2 py-1 bg-neo-yellow text-black rounded font-bold">
                              HTML5
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              const blob = new Blob([result], { type: 'text/html;charset=utf-8' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `site-web-${Date.now()}.html`;
                              a.click();
                              URL.revokeObjectURL(url);
                            }}
                            className="px-3 py-1.5 bg-neo-black text-white rounded-md text-xs font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
                          >
                            <Download className="w-3 h-3" />
                            Télécharger HTML
                          </button>
                        </div>
                        <div className="flex-1 border-2 border-black dark:border-gray-600 rounded-md overflow-hidden mb-4 min-h-[500px] relative bg-white shadow-neo dark:shadow-none">
                            <iframe 
                                srcDoc={getCleanHtml(result)} 
                                title="Aperçu du site"
                                className="w-full h-full absolute inset-0"
                                sandbox="allow-scripts allow-same-origin"
                            />
                        </div>
                        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>✅ Code HTML valide</span>
                          <span>•</span>
                          <span>📱 Responsive</span>
                          <span>•</span>
                          <span>🎨 Tailwind CSS</span>
                        </div>
                    </div>
                ) : (
                  <div className="flex flex-col h-full animate-in fade-in duration-500">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>Lignes: {result.split('\n').length}</span>
                        <span>•</span>
                        <span>Caractères: {result.length.toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => {
                          const blob = new Blob([result], { type: 'text/html;charset=utf-8' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `site-web-${Date.now()}.html`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="px-3 py-1.5 bg-neo-green text-black rounded-md text-xs font-bold hover:bg-green-400 transition-colors flex items-center gap-2"
                      >
                        <Download className="w-3 h-3" />
                        Télécharger
                      </button>
                    </div>
                    <textarea
                      value={result}
                      onChange={(e) => {
                        setResult(e.target.value);
                        setIsResultSaved(false);
                      }}
                      className="flex-1 w-full border-2 border-black dark:border-gray-600 rounded-md p-4 font-mono text-sm bg-gray-900 text-green-200 dark:bg-gray-950 dark:text-green-300"
                      spellCheck={false}
                    />
                    <div className="flex justify-end gap-2 mt-3">
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
                              {String(result || '')}
                            </ReactMarkdown>
                          </div>
                        </div>
              ) : tool.id === 'hex-to-rgb' ? (
                        <HexColorDisplay result={result ? String(result) : ''} inputValue={inputs.hex ? String(inputs.hex) : undefined}
                        />
               ) : tool.id === 'invoice-generator' ? (
                        <HtmlResultDisplay
                          result={result ? String(result) : ''}
                          title="Facture"
                          filename="facture"
                          onSave={isLoggedIn ? handleSaveResult : undefined}
                          isSaved={isResultSaved}
                          isSaving={savingResult}
                          onChange={(value) => {
                            setResult(value);
                            setIsResultSaved(false);
                          }}
                        />
               ) : tool.id === 'cv-generator' ? (
                        <HtmlResultDisplay
                          result={result ? String(result) : ''}
                          title="CV"
                          filename="cv"
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
               ) : tool.id === 'text-analyzer' ? (
                    <TextAnalyzerDisplay
                      result={result}
                      toolId={tool.id}
                      toolTitle={tool.title}
                      onSave={isLoggedIn ? handleSaveResult : undefined}
                      isSaved={isResultSaved}
                      isSaving={savingResult}
                    />
               ) : tool.id === 'json-formatter' ? (
                    <JsonFormatterDisplay
                      result={result}
                      toolId={tool.id}
                      toolTitle={tool.title}
                      onSave={isLoggedIn ? handleSaveResult : undefined}
                      isSaved={isResultSaved}
                      isSaving={savingResult}
                    />
               ) : tool.id === 'decision-maker' ? (
                    (() => {
                      try {
                        const parsed = JSON.parse(result);
                        if (parsed.type === 'wheel' && parsed.choices) {
                          return <DecisionWheel choices={parsed.choices} />;
                        }
                      } catch (e) {
                        // Fallback si ce n'est pas du JSON
                      }
                      return <EnhancedResultDisplay result={result} toolId={tool.id} toolTitle={tool.title} />;
                    })()
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

             {/* Suggestions d'outils complémentaires - Bannière */}
             {!loading && showSuggestions && result && (
               <div className="mt-6">
                 <ToolSuggestions 
                   currentToolId={tool.id} 
                   onClose={() => setShowSuggestions(false)} 
                 />
               </div>
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
        )}
      </div>

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
                      : `L'utilisation de ${tool.title} coûte ${tool.cost} crédit${tool.cost > 1 ? 's' : ''} par génération. Les nouveaux utilisateurs reçoivent 5 crédits gratuits par semaine.`}
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
