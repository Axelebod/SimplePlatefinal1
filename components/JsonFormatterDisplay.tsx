import React, { useState, useMemo } from 'react';
import { CheckCircle, AlertCircle, Copy, Download, FileJson, Code } from 'lucide-react';
import { EnhancedResultDisplay } from './EnhancedResultDisplay';

interface JsonFormatterDisplayProps {
  result: string;
  toolId: string;
  toolTitle: string;
  onSave?: () => void;
  isSaved?: boolean;
  isSaving?: boolean;
}

export const JsonFormatterDisplay: React.FC<JsonFormatterDisplayProps> = ({
  result,
  toolId,
  toolTitle,
  onSave,
  isSaved,
  isSaving
}) => {
  const [copied, setCopied] = useState(false);

  // Extraire le JSON du résultat (peut être dans un bloc de code)
  const jsonContent = useMemo(() => {
    const codeBlockMatch = result.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      return codeBlockMatch[1].trim();
    }
    return result.trim();
  }, [result]);

  // Valider le JSON
  const validation = useMemo(() => {
    try {
      const parsed = JSON.parse(jsonContent);
      const size = new Blob([jsonContent]).size;
      const formatted = JSON.stringify(parsed, null, 2);
      
      return {
        valid: true,
        size,
        sizeFormatted: size < 1024 ? `${size} B` : size < 1024 * 1024 ? `${(size / 1024).toFixed(2)} KB` : `${(size / (1024 * 1024)).toFixed(2)} MB`,
        keys: Object.keys(parsed).length,
        formatted,
        depth: getDepth(parsed)
      };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Erreur de parsing'
      };
    }
  }, [jsonContent]);

  function getDepth(obj: any, current = 0): number {
    if (typeof obj !== 'object' || obj === null) return current;
    if (Array.isArray(obj)) {
      return Math.max(...obj.map(item => getDepth(item, current + 1)), current);
    }
    return Math.max(...Object.values(obj).map((val: any) => getDepth(val, current + 1)), current);
  }

  const copyJson = async () => {
    await navigator.clipboard.writeText(validation.valid ? validation.formatted : jsonContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const blob = new Blob([validation.valid ? validation.formatted : jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Validation et métriques */}
      <div className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-lg p-4 shadow-neo dark:shadow-none">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {validation.valid ? (
              <>
                <CheckCircle className="w-5 h-5 text-neo-green" />
                <span className="font-bold text-neo-green">JSON Valide</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-neo-red" />
                <span className="font-bold text-neo-red">JSON Invalide</span>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyJson}
              className="px-3 py-1.5 bg-neo-black dark:bg-white text-white dark:text-black rounded-md text-xs font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copié!' : 'Copier'}
            </button>
            <button
              onClick={downloadJson}
              className="px-3 py-1.5 bg-neo-green text-black rounded-md text-xs font-bold hover:bg-green-400 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              JSON
            </button>
          </div>
        </div>

        {validation.valid ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Taille</div>
              <div className="font-bold dark:text-white">{validation.sizeFormatted}</div>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Clés racine</div>
              <div className="font-bold dark:text-white">{validation.keys}</div>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Profondeur</div>
              <div className="font-bold dark:text-white">{validation.depth} niveaux</div>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Format</div>
              <div className="font-bold dark:text-white flex items-center gap-1">
                <FileJson className="w-3 h-3" />
                JSON
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
            <p className="text-sm text-red-600 dark:text-red-400 font-bold">
              Erreur: {validation.error}
            </p>
          </div>
        )}
      </div>

      {/* Aperçu formaté */}
      {validation.valid && (
        <div className="bg-gray-900 dark:bg-gray-950 border-2 border-black dark:border-gray-600 rounded-lg p-4 shadow-neo dark:shadow-none">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-sm text-gray-300 flex items-center gap-2">
              <Code className="w-4 h-4" />
              Aperçu formaté
            </h4>
          </div>
          <pre className="text-green-400 font-mono text-xs overflow-x-auto max-h-96 overflow-y-auto">
            {validation.formatted}
          </pre>
        </div>
      )}

      {/* Affichage standard */}
      <EnhancedResultDisplay
        result={result}
        toolId={toolId}
        toolTitle={toolTitle}
        onSave={onSave}
        isSaved={isSaved}
        isSaving={isSaving}
      />
    </div>
  );
};

