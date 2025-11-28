import React, { useMemo, useState } from 'react';
import { Copy, CheckCircle, Download } from 'lucide-react';

interface HexColorDisplayProps {
  result: string;
  inputValue?: string;
}

const clamp = (value: number) => Math.max(0, Math.min(255, value));

const adjustColor = (hex: string, amount: number) => {
  const num = parseInt(hex, 16);
  const r = clamp((num >> 16) + amount);
  const g = clamp(((num >> 8) & 0x00ff) + amount);
  const b = clamp((num & 0x0000ff) + amount);
  return (
    (r.toString(16).padStart(2, '0') +
      g.toString(16).padStart(2, '0') +
      b.toString(16).padStart(2, '0')).toUpperCase()
  );
};

const parseColorData = (result: string) => {
  const hexMatch = result.match(/HEX\s*:?\s*#?([0-9A-Fa-f]{6})/);
  const rgbMatch = result.match(/RGB\s*:?\s*rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)/i);
  return {
    hex: hexMatch ? hexMatch[1].toUpperCase() : null,
    rgb: rgbMatch ? rgbMatch.slice(1).join(', ') : null,
  };
};

export const HexColorDisplay: React.FC<HexColorDisplayProps> = ({ result, inputValue }) => {
  const { hex, rgb } = useMemo(() => parseColorData(result), [result]);
  const [copied, setCopied] = useState<string | null>(null);

  const copyColor = async (value: string, format: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };

  const exportPalette = () => {
    const palette = [-60, -30, 0, 30, 60].map(delta => adjustColor(hex!, delta));
    const content = `Palette de couleurs générée depuis #${hex}\n\n` +
      palette.map((color, idx) => {
        const r = parseInt(color.substring(0, 2), 16);
        const g = parseInt(color.substring(2, 4), 16);
        const b = parseInt(color.substring(4, 6), 16);
        return `#${color} - rgb(${r}, ${g}, ${b})`;
      }).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palette-${hex}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!hex || !rgb) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
        Impossible de lire la couleur. Entrez un code Hex valide.
      </div>
    );
  }

  const palette = useMemo(
    () => [-60, -30, 0, 30, 60].map(delta => adjustColor(hex, delta)),
    [hex]
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1 bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-700 rounded-xl p-6 shadow-neo dark:shadow-none">
          <div
            className="w-full h-48 rounded-lg border-2 border-black mb-4"
            style={{ backgroundColor: `#${hex}` }}
          />
          <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 font-bold mb-1">
            Couleur principale
          </p>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-2xl font-display font-bold text-neo-black dark:text-white">#{hex}</p>
            <button
              onClick={() => copyColor(`#${hex}`, 'hex')}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Copier Hex"
            >
              {copied === 'hex' ? (
                <CheckCircle className="w-4 h-4 text-neo-green" />
              ) : (
                <Copy className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-lg text-gray-600 dark:text-gray-300">rgb({rgb})</p>
            <button
              onClick={() => copyColor(`rgb(${rgb})`, 'rgb')}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Copier RGB"
            >
              {copied === 'rgb' ? (
                <CheckCircle className="w-4 h-4 text-neo-green" />
              ) : (
                <Copy className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
          {inputValue && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              Valeur saisie : <code>{inputValue}</code>
            </p>
          )}
        </div>

        <div className="flex-1 bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-700 rounded-xl p-6 shadow-neo dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 font-bold">
              Palette automatique
            </p>
            <button
              onClick={exportPalette}
              className="px-3 py-1.5 bg-neo-black dark:bg-white text-white dark:text-black rounded-md text-xs font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Download className="w-3 h-3" />
              Exporter
            </button>
          </div>
          <div className="space-y-3">
            {palette.map((color, idx) => {
              const r = parseInt(color.substring(0, 2), 16);
              const g = parseInt(color.substring(2, 4), 16);
              const b = parseInt(color.substring(4, 6), 16);
              return (
                <div key={color} className="flex items-center gap-4 group">
                  <div
                    className="w-16 h-10 rounded border border-gray-300 cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: `#${color}` }}
                    onClick={() => copyColor(`#${color}`, `palette-${idx}`)}
                    title="Cliquer pour copier"
                  />
                  <div className="flex-1 border-b border-dashed border-gray-200 dark:border-gray-600" />
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-neo-black dark:text-white">#{color}</p>
                      <button
                        onClick={() => copyColor(`#${color}`, `palette-${idx}`)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all"
                        title="Copier"
                      >
                        {copied === `palette-${idx}` ? (
                          <CheckCircle className="w-3 h-3 text-neo-green" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-500" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      rgb({r}, {g}, {b})
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

