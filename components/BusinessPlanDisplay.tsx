import React, { useState, useRef, useEffect } from 'react';
import { Download, Palette, Save, Edit3, Eye, FileText, Copy, CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useExportToPDF } from '../hooks/useExportToPDF';

const PLAN_TEMPLATES = [
  { name: 'Classique', border: 'border-black', background: 'bg-white', accent: '#6C47FF' },
  { name: 'Corporate', border: 'border-gray-400', background: 'bg-gray-50', accent: '#0F98B0' },
  { name: 'Noir & Or', border: 'border-yellow-500', background: 'bg-stone-900 text-white', accent: '#F5B301' },
];

interface BusinessPlanDisplayProps {
  result: string;
  onSave?: () => void;
  isSaved?: boolean;
  isSaving?: boolean;
  onChange?: (content: string) => void;
}

export const BusinessPlanDisplay: React.FC<BusinessPlanDisplayProps> = ({
  result,
  onSave,
  isSaved = false,
  isSaving = false,
  onChange,
}) => {
  const planRef = useRef<HTMLDivElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [accentColor, setAccentColor] = useState(PLAN_TEMPLATES[0]?.accent || '#6C47FF');
  const [editableContent, setEditableContent] = useState(result || '');
  const [isEditing, setIsEditing] = useState(false); // Mode aperçu par défaut
  const [copied, setCopied] = useState(false);

  const { exportToPDF } = useExportToPDF({ 
    filename: 'business-plan',
    onError: (err) => alert(`Erreur export PDF: ${err.message}`)
  });

  useEffect(() => {
    if (result) {
      // Nettoyer le résultat si nécessaire (enlever les blocs de code markdown inutiles)
      let cleanedResult = result;
      
      // Si le résultat commence par ```markdown ou ```, on le nettoie
      if (cleanedResult.startsWith('```')) {
        const lines = cleanedResult.split('\n');
        // Trouver la première ligne qui n'est pas ``` ou ```markdown
        let startIndex = 0;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim().startsWith('```')) {
            startIndex = i + 1;
            break;
          }
        }
        // Trouver la dernière ligne avec ```
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
            <span>Accent</span>
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
                Aperçu
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                Modifier
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyToMarkdown}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
            title="Copier en Markdown"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-neo-green" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copié!' : 'Copier'}
          </button>
          <button
            onClick={exportToMarkdown}
            className="px-3 py-2 bg-gray-600 text-white rounded-md text-sm font-bold hover:bg-gray-700 transition-colors flex items-center gap-2"
            title="Télécharger en Markdown"
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
              {isSaving ? 'Sauvegarde...' : isSaved ? 'Sauvegardé' : 'Sauvegarder'}
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
            Business Plan
          </h2>
          <div className="w-24 h-1 rounded-full" style={{ backgroundColor: accentColor }} />
        </div>
        <div className="prose prose-sm max-w-none dark:prose-invert text-gray-800 dark:text-gray-100 leading-relaxed">
          {editableContent && editableContent.trim() ? (
            <ReactMarkdown
              components={{
                // Améliorer le rendu des blocs de code
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
                // Améliorer le rendu des paragraphes
                p: ({node, children, ...props}: any) => (
                  <p className="mb-4" {...props}>{children}</p>
                ),
                // Améliorer le rendu des titres
                h1: ({node, children, ...props}: any) => (
                  <h1 className="text-3xl font-bold mb-4 mt-6" style={{ color: accentColor }} {...props}>{children}</h1>
                ),
                h2: ({node, children, ...props}: any) => (
                  <h2 className="text-2xl font-bold mb-3 mt-5" style={{ color: accentColor }} {...props}>{children}</h2>
                ),
                h3: ({node, children, ...props}: any) => (
                  <h3 className="text-xl font-bold mb-2 mt-4" style={{ color: accentColor }} {...props}>{children}</h3>
                ),
                // Améliorer les listes
                ul: ({node, children, ...props}: any) => (
                  <ul className="list-disc list-inside mb-4 space-y-2" {...props}>{children}</ul>
                ),
                ol: ({node, children, ...props}: any) => (
                  <ol className="list-decimal list-inside mb-4 space-y-2" {...props}>{children}</ol>
                ),
                li: ({node, children, ...props}: any) => (
                  <li className="ml-4" {...props}>{children}</li>
                ),
                // Améliorer les tableaux
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
                // Améliorer les blockquotes
                blockquote: ({node, children, ...props}: any) => (
                  <blockquote className="border-l-4 pl-4 italic my-4 border-gray-300 dark:border-gray-600" style={{ borderLeftColor: accentColor }} {...props}>{children}</blockquote>
                ),
                // Améliorer les liens
                a: ({node, children, ...props}: any) => (
                  <a className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300" {...props}>{children}</a>
                ),
                // Améliorer les strong
                strong: ({node, children, ...props}: any) => (
                  <strong className="font-bold" style={{ color: accentColor }} {...props}>{children}</strong>
                ),
              }}
            >
              {editableContent}
            </ReactMarkdown>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>Aucun contenu à afficher. Générez un business plan pour commencer.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

