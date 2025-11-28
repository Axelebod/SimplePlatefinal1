import React, { useMemo } from 'react';
import { TrendingUp, FileText, Clock, Hash, BarChart3 } from 'lucide-react';
import { EnhancedResultDisplay } from './EnhancedResultDisplay';

interface TextAnalyzerDisplayProps {
  result: string;
  toolId: string;
  toolTitle: string;
  onSave?: () => void;
  isSaved?: boolean;
  isSaving?: boolean;
}

export const TextAnalyzerDisplay: React.FC<TextAnalyzerDisplayProps> = ({
  result,
  toolId,
  toolTitle,
  onSave,
  isSaved,
  isSaving
}) => {
  // Parser les statistiques depuis le résultat
  const stats = useMemo(() => {
    const text = result.replace(/[#*`\[\]()]/g, '').trim();
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n\n/).filter(p => p.trim().length > 0).length;
    const readingTime = Math.ceil(words.length / 200);
    const speakingTime = Math.ceil(words.length / 150);
    
    // Longueur moyenne des mots
    const avgWordLength = words.length > 0 
      ? (words.reduce((sum, w) => sum + w.length, 0) / words.length).toFixed(1)
      : '0';
    
    // Densité de mots-clés (top 5)
    const wordFreq: Record<string, number> = {};
    words.forEach(w => {
      const clean = w.toLowerCase().replace(/[.,!?;:]/g, '');
      if (clean.length > 3) {
        wordFreq[clean] = (wordFreq[clean] || 0) + 1;
      }
    });
    const topWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({ word, count }));
    
    return {
      words: words.length,
      chars,
      charsNoSpaces,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
      avgWordLength,
      topWords
    };
  }, [result]);

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Statistiques détaillées */}
      <div className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-lg p-6 shadow-neo dark:shadow-none">
        <h3 className="font-display text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-neo-violet" />
          Analyse détaillée
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-neo-blue/10 border-2 border-neo-blue/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-neo-blue" />
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Mots</span>
            </div>
            <p className="text-2xl font-bold text-neo-black dark:text-white">{stats.words.toLocaleString()}</p>
          </div>
          
          <div className="p-4 bg-neo-green/10 border-2 border-neo-green/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-neo-green" />
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Caractères</span>
            </div>
            <p className="text-2xl font-bold text-neo-black dark:text-white">{stats.chars.toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {stats.charsNoSpaces.toLocaleString()} sans espaces
            </p>
          </div>
          
          <div className="p-4 bg-neo-yellow/10 border-2 border-neo-yellow/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-neo-yellow" />
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Lecture</span>
            </div>
            <p className="text-2xl font-bold text-neo-black dark:text-white">{stats.readingTime} min</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {stats.speakingTime} min à l'oral
            </p>
          </div>
          
          <div className="p-4 bg-neo-violet/10 border-2 border-neo-violet/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-neo-violet" />
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Phrases</span>
            </div>
            <p className="text-2xl font-bold text-neo-black dark:text-white">{stats.sentences}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {stats.paragraphs} paragraphe{stats.paragraphs > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Métriques avancées */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h4 className="font-bold text-sm mb-2 dark:text-white">Métriques moyennes</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Longueur moyenne des mots:</span>
                <span className="font-bold dark:text-white">{stats.avgWordLength} caractères</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Mots par phrase:</span>
                <span className="font-bold dark:text-white">
                  {stats.sentences > 0 ? (stats.words / stats.sentences).toFixed(1) : '0'}
                </span>
              </div>
            </div>
          </div>

          {stats.topWords.length > 0 && (
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-bold text-sm mb-2 dark:text-white">Mots les plus fréquents</h4>
              <div className="flex flex-wrap gap-2">
                {stats.topWords.map(({ word, count }, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-neo-yellow/30 dark:bg-neo-yellow/20 text-neo-black dark:text-white rounded text-xs font-bold"
                  >
                    {word} ({count})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Affichage du texte avec EnhancedResultDisplay */}
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

