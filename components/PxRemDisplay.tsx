import React, { useState, useMemo, useEffect } from 'react';
import { Copy, CheckCircle, Ruler, Settings, Plus, X, Download } from 'lucide-react';

interface Conversion {
  id: string;
  original: string;
  px: number;
  rem: number;
  em: number;
}

interface PxRemDisplayProps {
  result: string;
  inputValue?: string;
  baseSize?: number;
}

const parseConversions = (result: string): { conversions: Conversion[]; baseSize: number } => {
  // Parser le résultat markdown pour extraire les conversions
  const baseSizeMatch = result.match(/Base:\s*(\d+)px/i);
  const baseSize = baseSizeMatch ? parseFloat(baseSizeMatch[1]) : 16;
  
  const conversions: Conversion[] = [];
  const tableMatch = result.match(/\|.*\|\n\|[-\s|]+\|\n([\s\S]*?)(?=\n\n|$)/);
  
  if (tableMatch) {
    const rows = tableMatch[1].trim().split('\n');
    rows.forEach((row, index) => {
      const cells = row.split('|').map(c => c.trim()).filter(c => c);
      if (cells.length >= 4) {
        const original = cells[0].replace(/`/g, '').trim();
        const pxMatch = cells[1].match(/([\d.]+)px/);
        const remMatch = cells[2].match(/([\d.]+)rem/);
        const emMatch = cells[3].match(/([\d.]+)em/);
        
        if (pxMatch && remMatch) {
          conversions.push({
            id: `conv-${index}`,
            original,
            px: parseFloat(pxMatch[1]),
            rem: parseFloat(remMatch[1]),
            em: emMatch ? parseFloat(emMatch[1]) : parseFloat(remMatch[1])
          });
        }
      }
    });
  }
  
  return { conversions, baseSize };
};

export const PxRemDisplay: React.FC<PxRemDisplayProps> = ({ result, inputValue, baseSize: propBaseSize }) => {
  const parsed = useMemo(() => parseConversions(result), [result]);
  const [currentBaseSize, setCurrentBaseSize] = useState(parsed.baseSize || propBaseSize || 16);
  const [conversions, setConversions] = useState<Conversion[]>(parsed.conversions);
  const [newValue, setNewValue] = useState('');
  const [newUnit, setNewUnit] = useState<'px' | 'rem' | 'em'>('px');
  const [copied, setCopied] = useState<string | null>(null);
  const [showTable, setShowTable] = useState(true);
  const [liveConversion, setLiveConversion] = useState<Conversion | null>(null);

  useEffect(() => {
    if (parsed.conversions.length > 0) {
      setConversions(parsed.conversions);
    }
    if (parsed.baseSize) {
      setCurrentBaseSize(parsed.baseSize);
    }
    if (propBaseSize) {
      setCurrentBaseSize(propBaseSize);
    }
  }, [parsed, propBaseSize]);

  // Conversion en temps réel
  useEffect(() => {
    const value = parseFloat(newValue);
    if (isNaN(value) || value <= 0 || !newValue) {
      setLiveConversion(null);
      return;
    }

    let px: number, rem: number, em: number;
    let original: string;

    if (newUnit === 'px') {
      px = value;
      rem = px / currentBaseSize;
      em = rem;
      original = `${px}px`;
    } else if (newUnit === 'rem') {
      rem = value;
      px = rem * currentBaseSize;
      em = rem;
      original = `${rem}rem`;
    } else {
      em = value;
      rem = em;
      px = em * currentBaseSize;
      original = `${em}em`;
    }

    setLiveConversion({
      id: 'live',
      original,
      px: Math.round(px * 100) / 100,
      rem: Math.round(rem * 1000) / 1000,
      em: Math.round(em * 1000) / 1000
    });
  }, [newValue, newUnit, currentBaseSize]);

  const addConversion = () => {
    if (!liveConversion) return;
    setConversions(prev => [...prev, { ...liveConversion, id: `conv-${Date.now()}` }]);
    setNewValue('');
    setLiveConversion(null);
  };

  const removeConversion = (id: string) => {
    setConversions(prev => prev.filter(c => c.id !== id));
  };

  const copyValue = async (value: string, format: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };

  const commonSizes = [
    { px: 8, usage: 'Très petit (spacing)' },
    { px: 10, usage: 'Petit texte' },
    { px: 12, usage: 'Texte secondaire' },
    { px: 14, usage: 'Texte standard mobile' },
    { px: 16, usage: 'Texte de base (root)' },
    { px: 18, usage: 'Texte légèrement plus grand' },
    { px: 20, usage: 'Sous-titres' },
    { px: 24, usage: 'Titres H4' },
    { px: 32, usage: 'Titres H3' },
    { px: 40, usage: 'Titres H2' },
    { px: 48, usage: 'Titres H1' },
    { px: 64, usage: 'Titres hero' },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Header avec réglage de la taille de base */}
      <div className="bg-gradient-to-r from-neo-violet to-purple-600 rounded-lg p-4 border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded border-2 border-white/30 flex items-center justify-center">
              <Ruler className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-white">
                Convertisseur PX ↔ REM
              </h2>
              <p className="text-xs text-white/80">Taille de base personnalisable</p>
            </div>
          </div>
        </div>

        {/* Slider pour la taille de base */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border-2 border-white/20">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Taille de base (px)
            </label>
            <span className="text-lg font-mono font-bold text-white">{currentBaseSize}px</span>
          </div>
          <input
            type="range"
            min="10"
            max="24"
            step="1"
            value={currentBaseSize}
            onChange={(e) => {
              const newBase = parseFloat(e.target.value);
              setCurrentBaseSize(newBase);
              // Recalculer toutes les conversions
              setConversions(prev => prev.map(conv => {
                // Si c'était en px, recalculer rem
                if (conv.original.endsWith('px')) {
                  const px = conv.px;
                  return {
                    ...conv,
                    rem: Math.round((px / newBase) * 1000) / 1000,
                    em: Math.round((px / newBase) * 1000) / 1000
                  };
                }
                // Si c'était en rem, recalculer px
                if (conv.original.endsWith('rem')) {
                  const rem = conv.rem;
                  return {
                    ...conv,
                    px: Math.round(rem * newBase * 100) / 100
                  };
                }
                return conv;
              }));
            }}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
          />
          <div className="flex justify-between text-[10px] text-white/60 mt-1">
            <span>10px</span>
            <span>16px (standard)</span>
            <span>24px</span>
          </div>
        </div>
      </div>

      {/* Convertisseur en temps réel */}
      <div className="bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-700 rounded-lg p-4 shadow-neo dark:shadow-none">
        <div className="flex items-center gap-2 mb-3">
          <Ruler className="w-4 h-4 text-neo-violet" />
          <h3 className="text-base font-display font-bold dark:text-white">Convertisseur en temps réel</h3>
        </div>
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="16"
            className="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm focus:outline-none focus:border-neo-violet dark:bg-gray-800 dark:text-white"
          />
          <select
            value={newUnit}
            onChange={(e) => setNewUnit(e.target.value as 'px' | 'rem' | 'em')}
            className="px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-bold text-sm focus:outline-none focus:border-neo-violet dark:bg-gray-800 dark:text-white"
          >
            <option value="px">px</option>
            <option value="rem">rem</option>
            <option value="em">em</option>
          </select>
          {liveConversion && (
            <button
              onClick={addConversion}
              className="px-4 py-2 bg-neo-violet text-white rounded-lg font-bold hover:bg-purple-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          )}
        </div>
        
        {/* Affichage de la conversion en temps réel */}
        {liveConversion && (
          <div className="p-4 bg-gradient-to-br from-neo-violet/10 to-purple-600/10 border-2 border-neo-violet rounded-lg">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Pixels</p>
                <code className="text-lg font-mono font-bold text-neo-black dark:text-white">{liveConversion.px}px</code>
                <button
                  onClick={() => copyValue(`${liveConversion.px}px`, 'live-px')}
                  className="mt-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  {copied === 'live-px' ? (
                    <CheckCircle className="w-3 h-3 text-neo-green mx-auto" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-500 mx-auto" />
                  )}
                </button>
              </div>
              <div className="text-center p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">REM</p>
                <code className="text-lg font-mono font-bold text-neo-violet">{liveConversion.rem}rem</code>
                <button
                  onClick={() => copyValue(`${liveConversion.rem}rem`, 'live-rem')}
                  className="mt-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  {copied === 'live-rem' ? (
                    <CheckCircle className="w-3 h-3 text-neo-green mx-auto" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-500 mx-auto" />
                  )}
                </button>
              </div>
              <div className="text-center p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">EM</p>
                <code className="text-lg font-mono font-bold text-neo-black dark:text-white">{liveConversion.em}em</code>
                <button
                  onClick={() => copyValue(`${liveConversion.em}em`, 'live-em')}
                  className="mt-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  {copied === 'live-em' ? (
                    <CheckCircle className="w-3 h-3 text-neo-green mx-auto" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-500 mx-auto" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Conversions affichées */}
      {conversions.length > 0 && (
        <div className="bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-700 rounded-lg p-4 shadow-neo dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-display font-bold dark:text-white">Conversions</h3>
            <button
              onClick={() => {
                const css = conversions.map(c => `font-size: ${c.rem}rem; /* ${c.px}px */`).join('\n');
                copyValue(css, 'all-css');
              }}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white rounded-lg font-bold text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3 h-3" />
              Copier CSS
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {conversions.map((conv) => (
              <div
                key={conv.id}
                className="group relative p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-neo-violet dark:hover:border-neo-violet transition-all"
              >
                <button
                  onClick={() => removeConversion(conv.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-all"
                  title="Supprimer"
                >
                  <X className="w-3 h-3 text-red-600 dark:text-red-400" />
                </button>

                {/* Barre visuelle de taille */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Taille visuelle</span>
                    <span className="text-xs font-mono text-gray-600 dark:text-gray-300">{conv.original}</span>
                  </div>
                  <div className="w-full h-8 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded flex items-center justify-center relative overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neo-violet to-purple-600 flex items-center justify-center"
                      style={{ width: `${Math.min((conv.px / 64) * 100, 100)}%` }}
                    >
                      {conv.px <= 32 && (
                        <span className="text-xs font-bold text-white">Aa</span>
                      )}
                    </div>
                    {conv.px > 32 && (
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300 absolute">Aa</span>
                    )}
                  </div>
                </div>

                {/* Valeurs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Pixels</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono font-bold text-neo-black dark:text-white">
                        {conv.px}px
                      </code>
                      <button
                        onClick={() => copyValue(`${conv.px}px`, `px-${conv.id}`)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                      >
                        {copied === `px-${conv.id}` ? (
                          <CheckCircle className="w-3 h-3 text-neo-green" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">REM</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono font-bold text-neo-black dark:text-white">
                        {conv.rem}rem
                      </code>
                      <button
                        onClick={() => copyValue(`${conv.rem}rem`, `rem-${conv.id}`)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                      >
                        {copied === `rem-${conv.id}` ? (
                          <CheckCircle className="w-3 h-3 text-neo-green" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">EM</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono font-bold text-neo-black dark:text-white">
                        {conv.em}em
                      </code>
                      <button
                        onClick={() => copyValue(`${conv.em}em`, `em-${conv.id}`)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                      >
                        {copied === `em-${conv.id}` ? (
                          <CheckCircle className="w-3 h-3 text-neo-green" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tableau de références */}
      <div className="bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-700 rounded-lg p-4 shadow-neo dark:shadow-none">
        <h3 className="text-base font-display font-bold dark:text-white mb-4">📊 Tableau de références</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {commonSizes.map((size) => {
              const rem = Math.round((size.px / currentBaseSize) * 1000) / 1000;
              return (
                <div
                  key={size.px}
                  className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-neo-violet dark:hover:border-neo-violet transition-all cursor-pointer"
                  onClick={() => {
                    const px = size.px;
                    const rem = Math.round((px / currentBaseSize) * 1000) / 1000;
                    const em = rem;
                    setConversions(prev => [...prev, {
                      id: `conv-${Date.now()}`,
                      original: `${px}px`,
                      px: px,
                      rem: rem,
                      em: em
                    }]);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-sm font-mono font-bold text-neo-black dark:text-white">
                      {size.px}px
                    </code>
                    <code className="text-sm font-mono font-bold text-neo-violet">
                      {rem}rem
                    </code>
                  </div>
                  <div className="w-full h-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center relative overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neo-violet to-purple-600"
                      style={{ width: `${Math.min((size.px / 64) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{size.usage}</p>
                </div>
              );
            })}
          </div>
      </div>
    </div>
  );
};

