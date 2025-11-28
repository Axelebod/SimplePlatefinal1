import React, { useMemo } from 'react';

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
          <p className="text-2xl font-display font-bold text-neo-black dark:text-white">#{hex}</p>
          <p className="text-lg text-gray-600 dark:text-gray-300">rgb({rgb})</p>
          {inputValue && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              Valeur saisie : <code>{inputValue}</code>
            </p>
          )}
        </div>

        <div className="flex-1 bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-700 rounded-xl p-6 shadow-neo dark:shadow-none">
          <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 font-bold mb-4">
            Palette automatique
          </p>
          <div className="space-y-3">
            {palette.map(color => (
              <div key={color} className="flex items-center gap-4">
                <div
                  className="w-16 h-10 rounded border border-gray-300"
                  style={{ backgroundColor: `#${color}` }}
                />
                <div className="flex-1 border-b border-dashed border-gray-200 dark:border-gray-600" />
                <div className="text-right">
                  <p className="font-bold text-neo-black dark:text-white">#{color}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    rgb(
                    {parseInt(color.substring(0, 2), 16)},{' '}
                    {parseInt(color.substring(2, 4), 16)},{' '}
                    {parseInt(color.substring(4, 6), 16)})
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

