import React from 'react';
import { Download, Copy, Save } from 'lucide-react';
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
  const copyToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Méthode moderne avec Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(result);
        alert('✅ Copié dans le presse-papiers !');
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
          alert('✅ Copié dans le presse-papiers !');
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

  const exportToTxt = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const blob = new Blob([result], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${toolId}-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur lors de l\'export:', err);
      alert('Erreur lors du téléchargement. Veuillez réessayer.');
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
            onClick={copyToClipboard}
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
            <Copy className="w-4 h-4 pointer-events-none" />
            <span className="pointer-events-none">Copier</span>
          </button>
          <button
            type="button"
            onClick={exportToTxt}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseUp={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="px-3 py-2 bg-neo-green text-white rounded-md text-sm font-bold hover:bg-green-500 transition-colors flex items-center gap-2 select-none cursor-pointer user-select-none"
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
            title="Télécharger"
          >
            <Download className="w-4 h-4 pointer-events-none" />
            <span className="pointer-events-none">TXT</span>
          </button>
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

