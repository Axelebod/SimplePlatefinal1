import React, { useMemo, useState } from 'react';
import { Download, Copy, Save, FileText, Share2, CheckCircle, TrendingUp, FileJson, FileCode } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface EnhancedResultDisplayProps {
  result: string;
  toolId: string;
  toolTitle: string;
  onSave?: () => void;
  isSaved?: boolean;
  isSaving?: boolean;
}

export const EnhancedResultDisplay: React.FC<EnhancedResultDisplayProps> = ({ 
  result, 
  toolId, 
  toolTitle,
  onSave,
  isSaved = false,
  isSaving = false
}) => {
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState<string | null>(null);

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Méthode moderne avec Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
      
      // Fallback pour navigateurs plus anciens
      const textArea = document.createElement('textarea');
      textArea.value = result;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } else {
          throw new Error('execCommand failed');
        }
      } catch (err) {
        throw new Error('Méthode de copie non supportée');
      } finally {
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
      alert('❌ Erreur lors de la copie. Essayez de sélectionner le texte manuellement.');
    }
  };

  const exportToFile = (format: 'txt' | 'md' | 'json') => {
    try {
      let content = result;
      let mimeType = 'text/plain';
      let extension = 'txt';
      
      if (format === 'md') {
        mimeType = 'text/markdown';
        extension = 'md';
      } else if (format === 'json') {
        content = JSON.stringify({ toolId, toolTitle, result, generatedAt: new Date().toISOString() }, null, 2);
        mimeType = 'application/json';
        extension = 'json';
      }
      
      const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${toolId}-${Date.now()}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExported(format);
      setTimeout(() => setExported(null), 2000);
    } catch (err) {
      console.error('Erreur lors de l\'export:', err);
      alert('Erreur lors du téléchargement. Veuillez réessayer.');
    }
  };

  const shareContent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: toolTitle,
          text: result.substring(0, 200) + (result.length > 200 ? '...' : ''),
          url: window.location.href
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      // Fallback: copier le lien
      await copyToClipboard({ preventDefault: () => {}, stopPropagation: () => {} } as any);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Actions bar */}
      <div className="flex items-center justify-between border-b-2 border-gray-200 dark:border-gray-600 pb-3">
        <h3 className="font-display text-xl font-bold dark:text-white">{toolTitle}</h3>
        <div className="flex gap-2">
          {onSave && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSave();
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseUp={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              disabled={isSaved || isSaving}
              className={`px-3 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-2 select-none cursor-pointer user-select-none ${
                isSaved
                  ? 'bg-neo-green text-black cursor-not-allowed'
                  : isSaving
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                  : 'bg-neo-violet text-white hover:bg-purple-500'
              }`}
              style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
              title={isSaved ? 'Déjà sauvegardé' : 'Sauvegarder ce résultat'}
            >
              <Save className={`w-4 h-4 pointer-events-none ${isSaved ? 'fill-current' : ''}`} />
              <span className="pointer-events-none">
                {isSaving ? 'Sauvegarde...' : isSaved ? 'Sauvegardé' : 'Sauvegarder'}
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={(e) => copyToClipboard(e)}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseUp={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 select-none cursor-pointer user-select-none"
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
            title="Copier"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 pointer-events-none text-neo-green" />
                <span className="pointer-events-none">Copié!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 pointer-events-none" />
                <span className="pointer-events-none">Copier</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={shareContent}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="px-3 py-2 bg-neo-violet text-white rounded-md text-sm font-bold hover:bg-purple-500 transition-colors flex items-center gap-2 select-none cursor-pointer user-select-none"
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
            title="Partager"
          >
            <Share2 className="w-4 h-4 pointer-events-none" />
            <span className="pointer-events-none hidden sm:inline">Partager</span>
          </button>
          <div className="relative group">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="px-3 py-2 bg-neo-green text-white rounded-md text-sm font-bold hover:bg-green-500 transition-colors flex items-center gap-2 select-none cursor-pointer user-select-none"
              style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
              title="Exporter"
            >
              <Download className="w-4 h-4 pointer-events-none" />
              <span className="pointer-events-none">Export</span>
            </button>
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-lg shadow-neo dark:shadow-none p-2 min-w-[120px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => exportToFile('txt')}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm font-bold flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                {exported === 'txt' ? '✓ TXT' : 'TXT'}
              </button>
              <button
                onClick={() => exportToFile('md')}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm font-bold flex items-center gap-2"
              >
                <FileCode className="w-4 h-4" />
                {exported === 'md' ? '✓ MD' : 'Markdown'}
              </button>
              <button
                onClick={() => exportToFile('json')}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm font-bold flex items-center gap-2"
              >
                <FileJson className="w-4 h-4" />
                {exported === 'json' ? '✓ JSON' : 'JSON'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content card */}
      <div className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-lg p-6 shadow-neo dark:shadow-none">
        <div 
          className="prose prose-sm max-w-none markdown-body dark:text-gray-200 prose-a:text-blue-700 dark:prose-a:text-neo-violet prose-a:font-bold prose-a:underline"
          onMouseDown={(e) => {
            // Permettre la sélection de texte dans le contenu
            e.stopPropagation();
          }}
        >
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

