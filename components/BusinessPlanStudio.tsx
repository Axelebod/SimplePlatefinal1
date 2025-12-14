import React, { useState, useEffect, useRef } from 'react';
import { Download, Palette, Save, Edit3, Eye, FileText, Copy, CheckCircle, Sparkles, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useExportToPDF } from '../hooks/useExportToPDF';
import { useTranslation } from '../hooks/useTranslation';
import { ToolConfig } from '../types';
import { useUserStore } from '../store/userStore';
import { useNavigate } from 'react-router-dom';

const PLAN_TEMPLATES = [
  { name: 'Classique', border: 'border-black', background: 'bg-white', accent: '#6C47FF' },
  { name: 'Corporate', border: 'border-gray-400', background: 'bg-gray-50', accent: '#0F98B0' },
  { name: 'Noir & Or', border: 'border-yellow-500', background: 'bg-stone-900 text-white', accent: '#F5B301' },
];

interface BusinessPlanStudioProps {
  result: string;
  inputValue?: string;
  onSave?: () => void;
  isSaved?: boolean;
  isSaving?: boolean;
  onChange?: (content: string) => void;
  onSubmit?: (data: any) => void;
  tool?: ToolConfig;
  hasCredits?: boolean;
  loading?: boolean;
}

export const BusinessPlanStudio: React.FC<BusinessPlanStudioProps> = ({
  result,
  inputValue,
  onSave,
  isSaved = false,
  isSaving = false,
  onChange,
  onSubmit,
  tool,
  hasCredits,
  loading = false,
}) => {
  const { t } = useTranslation();
  const planRef = useRef<HTMLDivElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [accentColor, setAccentColor] = useState(PLAN_TEMPLATES[0]?.accent || '#6C47FF');
  const [editableContent, setEditableContent] = useState(result || '');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Formulaire intégré
  const [businessIdea, setBusinessIdea] = useState(inputValue || '');
  const [targetMarket, setTargetMarket] = useState('');
  const [businessType, setBusinessType] = useState('Startup');
  const { user } = useUserStore();
  const navigate = useNavigate();

  const { exportToPDF } = useExportToPDF({ 
    filename: 'business-plan',
    onError: (err) => alert(`Erreur export PDF: ${err.message}`)
  });

  useEffect(() => {
    if (result) {
      // Nettoyer le résultat si nécessaire
      let cleanedResult = result;
      
      if (cleanedResult.startsWith('```')) {
        const lines = cleanedResult.split('\n');
        let startIndex = 0;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim().startsWith('```')) {
            startIndex = i + 1;
            break;
          }
        }
        let endIndex = lines.length;
        for (let i = lines.length - 1; i >= 0; i--) {
          if (lines[i].trim().startsWith('```')) {
            endIndex = i;
            break;
          }
        }
        cleanedResult = lines.slice(startIndex, endIndex).join('\n');
      }
      
      setEditableContent(cleanedResult);
    } else {
      setEditableContent('');
    }
  }, [result]);

  useEffect(() => {
    if (inputValue) {
      setBusinessIdea(inputValue);
    }
  }, [inputValue]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/signup');
      return;
    }

    if (!hasCredits) {
      alert(`${t('tools.noCredits')} ${t('tools.creditsRequired')} ${tool?.cost || 3}.`);
      return;
    }

    if (!businessIdea.trim()) {
      alert('Veuillez décrire votre idée d\'entreprise');
      return;
    }

    if (onSubmit && tool?.promptGenerator) {
      const data = { input: businessIdea, targetMarket, businessType };
      const prompt = tool.promptGenerator(data);
      if (prompt && !prompt.startsWith('ERROR:')) {
        onSubmit({ prompt, data });
      }
    }
  };

  const handleContentChange = (value: string) => {
    setEditableContent(value);
    onChange?.(value);
  };

  const handleExportPDF = async () => {
    await exportToPDF(planRef);
  };

  const copyToMarkdown = async () => {
    await navigator.clipboard.writeText(editableContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportToMarkdown = () => {
    const blob = new Blob([editableContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `business-plan-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Formulaire de génération intégré */}
      {!editableContent || editableContent.trim().length === 0 ? (
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-500 rounded-lg p-6 border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl border-2 border-white/30 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-white">
                {t('businessPlanStudio.title')}
              </h2>
              <p className="text-sm text-white/80">{t('businessPlanStudio.subtitle')}</p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                {t('businessPlanStudio.businessIdea')} *
              </label>
              <textarea
                value={businessIdea}
                onChange={(e) => setBusinessIdea(e.target.value)}
                placeholder={t('businessPlanStudio.businessIdeaPlaceholder')}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:border-white/60 focus:bg-white/20"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  {t('businessPlanStudio.targetMarket')}
                </label>
                <input
                  type="text"
                  value={targetMarket}
                  onChange={(e) => setTargetMarket(e.target.value)}
                  placeholder={t('businessPlanStudio.targetMarketPlaceholder')}
                  className="w-full px-4 py-3 rounded-lg border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:border-white/60 focus:bg-white/20"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  {t('businessPlanStudio.businessType')}
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white focus:outline-none focus:border-white/60 focus:bg-white/20"
                >
                  <option value="Startup" className="bg-gray-800">Startup</option>
                  <option value="SME" className="bg-gray-800">PME</option>
                  <option value="E-commerce" className="bg-gray-800">E-commerce</option>
                  <option value="Service" className="bg-gray-800">Service</option>
                  <option value="SaaS" className="bg-gray-800">SaaS</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !hasCredits}
              className={`w-full py-4 font-bold text-lg border-2 border-white rounded-lg flex items-center justify-center gap-2 transition-all ${
                loading
                  ? 'bg-white/50 cursor-wait'
                  : !hasCredits
                  ? 'bg-red-500/50 cursor-not-allowed'
                  : 'bg-white text-purple-600 hover:bg-gray-100 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  {t('tools.loading')}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {t('businessPlanStudio.generate')} ({tool?.cost || 3} {t('brandStudio.credits')})
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* Contrôles */}
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              {PLAN_TEMPLATES.map((tpl, idx) => (
                <button
                  key={tpl.name}
                  onClick={() => {
                    setSelectedTemplate(idx);
                    setAccentColor(tpl.accent);
                  }}
                  className={`px-3 py-1 rounded-md text-sm font-bold border ${
                    selectedTemplate === idx
                      ? 'bg-neo-black text-white border-black'
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  {tpl.name}
                </button>
              ))}
              <label className="flex items-center gap-2 text-sm font-bold">
                <Palette className="w-4 h-4" />
                <span>{t('businessPlanStudio.accent')}</span>
                <input
                  type="color"
                  value={accentColor}
                  onChange={e => setAccentColor(e.target.value)}
                  className="w-10 h-7 border border-gray-300 rounded cursor-pointer"
                />
              </label>
              <button
                onClick={() => setIsEditing(prev => !prev)}
                className="px-3 py-1.5 rounded-md text-sm font-bold border border-gray-300 dark:border-gray-600 flex items-center gap-2"
              >
                {isEditing ? (
                  <>
                    <Eye className="w-4 h-4" />
                    {t('businessPlan.preview')}
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4" />
                    {t('businessPlan.edit')}
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyToMarkdown}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                title={t('tools.copy')}
              >
                {copied ? <CheckCircle className="w-4 h-4 text-neo-green" /> : <Copy className="w-4 h-4" />}
                {copied ? t('tools.copied') : t('tools.copy')}
              </button>
              <button
                onClick={exportToMarkdown}
                className="px-3 py-2 bg-gray-600 text-white rounded-md text-sm font-bold hover:bg-gray-700 transition-colors flex items-center gap-2"
                title={t('tools.export')}
              >
                <FileText className="w-4 h-4" />
                MD
              </button>
              <button
                onClick={handleExportPDF}
                className="px-3 py-2 bg-neo-black text-white rounded-md text-sm font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
              {onSave && (
                <button
                  onClick={onSave}
                  disabled={isSaved || isSaving}
                  className={`px-3 py-2 rounded-md text-sm font-bold flex items-center gap-2 ${
                    isSaved
                      ? 'bg-neo-green text-black cursor-not-allowed'
                      : isSaving
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-neo-violet text-white hover:bg-purple-500'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? t('tools.saving') : isSaved ? t('tools.saved') : t('tools.save')}
                </button>
              )}
            </div>
          </div>

          {isEditing && (
            <textarea
              value={editableContent}
              onChange={e => handleContentChange(e.target.value)}
              rows={12}
              className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4 font-mono text-sm bg-white dark:bg-gray-900 dark:text-white"
            />
          )}

          <div
            ref={planRef}
            className={`mx-auto border-2 rounded-xl p-10 shadow-neo dark:shadow-none ${PLAN_TEMPLATES[selectedTemplate]?.border || PLAN_TEMPLATES[0].border} ${PLAN_TEMPLATES[selectedTemplate]?.background || PLAN_TEMPLATES[0].background}`}
            style={{ width: '210mm', minHeight: '297mm' }}
          >
            <div className="mb-6">
              <h2 className="font-display text-3xl font-bold mb-2" style={{ color: accentColor }}>
                {t('businessPlan.title')}
              </h2>
              <div className="w-24 h-1 rounded-full" style={{ backgroundColor: accentColor }} />
            </div>
            <div className="prose prose-sm max-w-none dark:prose-invert text-gray-800 dark:text-gray-100 leading-relaxed">
              {editableContent && editableContent.trim() ? (
                <ReactMarkdown
                  components={{
                    code: ({node, inline, className, children, ...props}: any) => {
                      if (inline) {
                        return <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>{children}</code>;
                      }
                      return (
                        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4">
                          <code className="text-sm" {...props}>{children}</code>
                        </pre>
                      );
                    },
                    p: ({node, children, ...props}: any) => (
                      <p className="mb-4" {...props}>{children}</p>
                    ),
                    h1: ({node, children, ...props}: any) => (
                      <h1 className="text-3xl font-bold mb-4 mt-6" style={{ color: accentColor }} {...props}>{children}</h1>
                    ),
                    h2: ({node, children, ...props}: any) => (
                      <h2 className="text-2xl font-bold mb-3 mt-5" style={{ color: accentColor }} {...props}>{children}</h2>
                    ),
                    h3: ({node, children, ...props}: any) => (
                      <h3 className="text-xl font-bold mb-2 mt-4" style={{ color: accentColor }} {...props}>{children}</h3>
                    ),
                    ul: ({node, children, ...props}: any) => (
                      <ul className="list-disc list-inside mb-4 space-y-2" {...props}>{children}</ul>
                    ),
                    ol: ({node, children, ...props}: any) => (
                      <ol className="list-decimal list-inside mb-4 space-y-2" {...props}>{children}</ol>
                    ),
                    li: ({node, children, ...props}: any) => (
                      <li className="ml-4" {...props}>{children}</li>
                    ),
                    table: ({node, children, ...props}: any) => (
                      <div className="overflow-x-auto my-4">
                        <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600" {...props}>{children}</table>
                      </div>
                    ),
                    th: ({node, children, ...props}: any) => (
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-bold" {...props}>{children}</th>
                    ),
                    td: ({node, children, ...props}: any) => (
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2" {...props}>{children}</td>
                    ),
                    blockquote: ({node, children, ...props}: any) => (
                      <blockquote className="border-l-4 pl-4 italic my-4 border-gray-300 dark:border-gray-600" style={{ borderLeftColor: accentColor }} {...props}>{children}</blockquote>
                    ),
                    a: ({node, children, ...props}: any) => (
                      <a className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300" {...props}>{children}</a>
                    ),
                    strong: ({node, children, ...props}: any) => (
                      <strong className="font-bold" style={{ color: accentColor }} {...props}>{children}</strong>
                    ),
                  }}
                >
                  {editableContent}
                </ReactMarkdown>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p>{t('businessPlan.noContent')}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

