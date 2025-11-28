import React, { useState, useEffect } from 'react';
import { History, Star, Trash2, Download, FileText, Copy, Check } from 'lucide-react';
import { ToolResult, ExportOptions } from '../types/toolHistory';
import { getToolHistory, deleteToolResult, toggleFavorite, exportResult } from '../services/toolHistoryService';
import { useUserStore } from '../store/userStore';

interface ToolHistoryProps {
  toolId: string;
  onLoadTemplate: (inputs: Record<string, any>) => void;
}

export const ToolHistory: React.FC<ToolHistoryProps> = ({ toolId, onLoadTemplate }) => {
  const { isPro } = useUserStore();
  const [history, setHistory] = useState<ToolResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, [toolId]);

  const loadHistory = async () => {
    setLoading(true);
    const results = await getToolHistory(toolId, 50);
    setHistory(results);
    setLoading(false);
  };

  const handleDelete = async (resultId: string) => {
    if (confirm('Supprimer ce résultat ?')) {
      const success = await deleteToolResult(resultId);
      if (success) {
        setHistory(history.filter(r => r.id !== resultId));
      }
    }
  };

  const handleToggleFavorite = async (resultId: string, currentState: boolean) => {
    const result = await toggleFavorite(resultId, !currentState, isPro);
    if (result.success) {
      setHistory(history.map(r => 
        r.id === resultId ? { ...r, is_favorite: !currentState } : r
      ));
    } else if (result.message) {
      alert(result.message);
    }
  };

  const handleExport = (result: ToolResult, format: ExportOptions['format']) => {
    exportResult(result, {
      format,
      includeInputs: true,
      includeMetadata: true
    });
  };

  const handleCopy = async (text: string, resultId: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(resultId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-lg p-6">
        <p className="text-gray-500 dark:text-gray-400">Chargement de l'historique...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-lg p-6 text-center">
        <History className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Aucun résultat sauvegardé</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Sauvegardez vos résultats manuellement avec le bouton "Sauvegarder" pour les retrouver ici</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-lg flex items-center gap-2">
          <History className="w-5 h-5" />
          Historique ({history.length})
        </h3>
        <button
          onClick={loadHistory}
          className="text-sm text-neo-blue hover:underline font-bold"
        >
          Actualiser
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {history.map((result) => (
          <div
            key={result.id}
            className={`border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-black dark:hover:border-white transition-colors ${
              result.is_favorite ? 'bg-neo-yellow/20 dark:bg-neo-yellow/10' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(result.created_at).toLocaleString('fr-FR')}
                  </span>
                  {result.is_favorite && (
                    <Star className="w-4 h-4 text-neo-yellow fill-current" />
                  )}
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                    {result.credits_used} crédit{result.credits_used > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {result.output_type === 'image' 
                    ? '🖼️ Image générée' 
                    : result.output.substring(0, 100) + (result.output.length > 100 ? '...' : '')
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <button
                onClick={() => handleToggleFavorite(result.id, result.is_favorite || false)}
                className={`p-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  result.is_favorite ? 'text-neo-yellow' : 'text-gray-400'
                }`}
                title={result.is_favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                <Star className={`w-4 h-4 ${result.is_favorite ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => onLoadTemplate(result.inputs)}
                className="p-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-neo-blue"
                title="Réutiliser ces paramètres"
              >
                <FileText className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleCopy(result.output, result.id)}
                className="p-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
                title="Copier le résultat"
              >
                {copiedId === result.id ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              <div className="relative group">
                <button
                  className="p-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
                  title="Exporter"
                >
                  <Download className="w-4 h-4" />
                </button>
                <div className="absolute left-0 top-full mt-1 bg-white dark:bg-gray-800 border-2 border-black dark:border-white rounded-lg shadow-neo p-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col gap-1 min-w-[120px]">
                  <button
                    onClick={() => handleExport(result, 'json')}
                    className="text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
                  >
                    JSON
                  </button>
                  <button
                    onClick={() => handleExport(result, 'txt')}
                    className="text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
                  >
                    TXT
                  </button>
                  <button
                    onClick={() => handleExport(result, 'markdown')}
                    className="text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
                  >
                    Markdown
                  </button>
                  <button
                    onClick={() => handleExport(result, 'pdf')}
                    className="text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
                  >
                    PDF
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleDelete(result.id)}
                className="p-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-500"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

