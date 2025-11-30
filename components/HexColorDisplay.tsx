import React, { useMemo, useState, useEffect } from 'react';
import { Copy, CheckCircle, Download, Palette, Sparkles } from 'lucide-react';

interface HexColorDisplayProps {
  result: string;
  inputValue?: string;
}

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("").toUpperCase();
};

const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

const rgbToCmyk = (r: number, g: number, b: number): { c: number; m: number; y: number; k: number } => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const k = 1 - Math.max(r, g, b);
  const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
  const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
  const y = k === 1 ? 0 : (1 - b - k) / (1 - k);
  
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
};

// Palette Pantone approximative (couleurs les plus courantes)
const pantoneColors: Array<{ name: string; hex: string; rgb: { r: number; g: number; b: number } }> = [
  { name: 'PANTONE 19-1664 TPX (Rouge)', hex: '#E63946', rgb: { r: 230, g: 57, b: 70 } },
  { name: 'PANTONE 18-1664 TPX (Rouge Vif)', hex: '#D62828', rgb: { r: 214, g: 40, b: 40 } },
  { name: 'PANTONE 17-2031 TPX (Rose)', hex: '#FF6B9D', rgb: { r: 255, g: 107, b: 157 } },
  { name: 'PANTONE 19-4052 TPX (Bleu Royal)', hex: '#1E3A8A', rgb: { r: 30, g: 58, b: 138 } },
  { name: 'PANTONE 15-4020 TPX (Bleu Ciel)', hex: '#4A90E2', rgb: { r: 74, g: 144, b: 226 } },
  { name: 'PANTONE 18-4525 TPX (Turquoise)', hex: '#06B6D4', rgb: { r: 6, g: 182, b: 212 } },
  { name: 'PANTONE 17-1456 TPX (Orange)', hex: '#FF6B35', rgb: { r: 255, g: 107, b: 53 } },
  { name: 'PANTONE 15-1264 TPX (Corail)', hex: '#FF8C69', rgb: { r: 255, g: 140, b: 105 } },
  { name: 'PANTONE 18-1664 TPX (Rouge Tomate)', hex: '#E63946', rgb: { r: 230, g: 57, b: 70 } },
  { name: 'PANTONE 19-1664 TPX (Rouge Sang)', hex: '#C1121F', rgb: { r: 193, g: 18, b: 31 } },
  { name: 'PANTONE 15-0343 TPX (Vert Lime)', hex: '#84CC16', rgb: { r: 132, g: 204, b: 22 } },
  { name: 'PANTONE 18-6026 TPX (Vert Forêt)', hex: '#166534', rgb: { r: 22, g: 101, b: 52 } },
  { name: 'PANTONE 19-0419 TPX (Vert Émeraude)', hex: '#10B981', rgb: { r: 16, g: 185, b: 129 } },
  { name: 'PANTONE 19-3832 TPX (Violet)', hex: '#6B21A8', rgb: { r: 107, g: 33, b: 168 } },
  { name: 'PANTONE 18-3011 TPX (Violet Lavande)', hex: '#9333EA', rgb: { r: 147, g: 51, b: 234 } },
  { name: 'PANTONE 19-1862 TPX (Rouge Bordeaux)', hex: '#7F1D1D', rgb: { r: 127, g: 29, b: 29 } },
  { name: 'PANTONE 19-4052 TPX (Bleu Marine)', hex: '#1E3A8A', rgb: { r: 30, g: 58, b: 138 } },
  { name: 'PANTONE 19-1664 TPX (Rouge Cerise)', hex: '#DC2626', rgb: { r: 220, g: 38, b: 38 } },
  { name: 'PANTONE 15-0343 TPX (Jaune)', hex: '#FCD34D', rgb: { r: 252, g: 211, b: 77 } },
  { name: 'PANTONE 19-3832 TPX (Indigo)', hex: '#4C1D95', rgb: { r: 76, g: 29, b: 149 } },
  { name: 'PANTONE 19-1664 TPX (Rouge)', hex: '#EF4444', rgb: { r: 239, g: 68, b: 68 } },
  { name: 'PANTONE 15-1264 TPX (Saumon)', hex: '#FB7185', rgb: { r: 251, g: 113, b: 133 } },
  { name: 'PANTONE 18-4525 TPX (Cyan)', hex: '#06B6D4', rgb: { r: 6, g: 182, b: 212 } },
  { name: 'PANTONE 19-0419 TPX (Vert Menthe)', hex: '#14B8A6', rgb: { r: 20, g: 184, b: 166 } },
  { name: 'PANTONE 19-3832 TPX (Pourpre)', hex: '#9333EA', rgb: { r: 147, g: 51, b: 234 } },
  { name: 'PANTONE 19-1664 TPX (Rouge Framboise)', hex: '#DC2626', rgb: { r: 220, g: 38, b: 38 } },
  { name: 'PANTONE 15-0343 TPX (Jaune Moutarde)', hex: '#F59E0B', rgb: { r: 245, g: 158, b: 11 } },
  { name: 'PANTONE 18-6026 TPX (Vert Olive)', hex: '#65A30D', rgb: { r: 101, g: 163, b: 13 } },
  { name: 'PANTONE 19-4052 TPX (Bleu Acier)', hex: '#3B82F6', rgb: { r: 59, g: 130, b: 246 } },
  { name: 'PANTONE 19-3832 TPX (Violet Profond)', hex: '#7C3AED', rgb: { r: 124, g: 58, b: 237 } },
];

const findClosestPantone = (r: number, g: number, b: number): { name: string; distance: number } => {
  let closest = pantoneColors[0];
  let minDistance = Infinity;

  pantoneColors.forEach(pantone => {
    const dr = r - pantone.rgb.r;
    const dg = g - pantone.rgb.g;
    const db = b - pantone.rgb.b;
    const distance = Math.sqrt(dr * dr + dg * dg + db * db);
    
    if (distance < minDistance) {
      minDistance = distance;
      closest = pantone;
    }
  });

  return { name: closest.name, distance: minDistance };
};

const parseColorData = (result: string) => {
  const hexMatch = result.match(/HEX\s*:?\s*#?([0-9A-Fa-f]{6})/i);
  const rgbMatch = result.match(/RGB\s*:?\s*rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)/i);
  
  if (hexMatch) {
    const hex = hexMatch[1].toUpperCase();
    const rgb = hexToRgb(`#${hex}`);
    return { hex, rgb };
  }
  
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);
    const hex = rgbToHex(r, g, b);
    return { hex: hex.replace('#', ''), rgb: { r, g, b } };
  }
  
  return { hex: null, rgb: null };
};

export const HexColorDisplay: React.FC<HexColorDisplayProps> = ({ result, inputValue }) => {
  const parsed = useMemo(() => parseColorData(result), [result]);
  const [currentColor, setCurrentColor] = useState(`#${parsed.hex || '000000'}`);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (parsed.hex) {
      setCurrentColor(`#${parsed.hex}`);
    }
  }, [parsed.hex]);

  const rgb = parsed.rgb || (currentColor ? hexToRgb(currentColor) : null);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
  const cmyk = rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : null;
  const pantone = rgb ? findClosestPantone(rgb.r, rgb.g, rgb.b) : null;
  const hex = currentColor.replace('#', '').toUpperCase();

  const copyColor = async (value: string, format: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };

  const colorFormats = useMemo(() => {
    if (!rgb) return [];
    
    return [
      { label: 'HEX', value: `#${hex}`, format: 'hex', icon: '#' },
      { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, format: 'rgb', icon: 'RGB' },
      { label: 'RGBA', value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`, format: 'rgba', icon: 'A' },
      hsl ? { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, format: 'hsl', icon: 'HSL' } : null,
      hsl ? { label: 'HSLA', value: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`, format: 'hsla', icon: 'A' } : null,
      cmyk ? { label: 'CMJN', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`, format: 'cmyk', icon: 'CMJN' } : null,
      pantone ? { label: 'Pantone', value: pantone.name, format: 'pantone', icon: 'P' } : null,
      { label: 'Decimal', value: `${(rgb.r << 16) | (rgb.g << 8) | rgb.b}`, format: 'decimal', icon: '#' },
    ].filter(Boolean) as Array<{ label: string; value: string; format: string; icon: string }>;
  }, [hex, rgb, hsl, cmyk, pantone]);

  if (!rgb) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-8">
        <Palette className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-center">Impossible de lire la couleur. Entrez un code Hex ou RGB valide.</p>
      </div>
    );
  }

  // Déterminer si la couleur est claire ou foncée pour le contraste
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  const textColor = luminance > 0.5 ? '#000000' : '#FFFFFF';

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Header compact avec couleur */}
      <div 
        className="relative rounded-lg p-4 border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] overflow-hidden"
        style={{ backgroundColor: currentColor }}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded border-2 border-white/30 flex items-center justify-center">
                <Palette className="w-4 h-4" style={{ color: textColor }} />
              </div>
              <div>
                <h2 className="text-lg font-display font-bold" style={{ color: textColor }}>
                  Couleur Sélectionnée
                </h2>
              </div>
            </div>
            <button
              onClick={() => {
                const allFormats = colorFormats.map(f => `${f.label}: ${f.value}`).join('\n');
                copyColor(allFormats, 'all');
              }}
              className="px-3 py-1.5 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded font-bold text-xs transition-all hover:bg-white/30 flex items-center gap-1.5"
              style={{ color: textColor }}
            >
              <Download className="w-3 h-3" />
              Tout copier
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            <div className="bg-white/10 backdrop-blur-sm rounded p-2 border-2 border-white/20">
              <p className="text-[10px] font-bold uppercase mb-1 opacity-80" style={{ color: textColor }}>HEX</p>
              <div className="flex items-center gap-1.5">
                <code 
                  className="text-sm font-mono font-bold truncate flex-1 cursor-help" 
                  style={{ color: textColor }}
                  title={`#${hex}`}
                >
                  #{hex}
                </code>
                <button
                  onClick={() => copyColor(`#${hex}`, 'hex')}
                  className="p-0.5 hover:bg-white/20 rounded transition-colors flex-shrink-0"
                >
                  {copied === 'hex' ? (
                    <CheckCircle className="w-3 h-3" style={{ color: textColor }} />
                  ) : (
                    <Copy className="w-3 h-3 opacity-70" style={{ color: textColor }} />
                  )}
                </button>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded p-2 border-2 border-white/20">
              <p className="text-[10px] font-bold uppercase mb-1 opacity-80" style={{ color: textColor }}>RGB</p>
              <div className="flex items-center gap-1.5">
                <code 
                  className="text-sm font-mono font-bold truncate flex-1 cursor-help" 
                  style={{ color: textColor }}
                  title={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                >
                  {rgb.r}, {rgb.g}, {rgb.b}
                </code>
                <button
                  onClick={() => copyColor(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}
                  className="p-0.5 hover:bg-white/20 rounded transition-colors flex-shrink-0"
                >
                  {copied === 'rgb' ? (
                    <CheckCircle className="w-3 h-3" style={{ color: textColor }} />
                  ) : (
                    <Copy className="w-3 h-3 opacity-70" style={{ color: textColor }} />
                  )}
                </button>
              </div>
            </div>
            {hsl && (
              <div className="bg-white/10 backdrop-blur-sm rounded p-2 border-2 border-white/20">
                <p className="text-[10px] font-bold uppercase mb-1 opacity-80" style={{ color: textColor }}>HSL</p>
                <div className="flex items-center gap-1.5">
                  <code 
                    className="text-sm font-mono font-bold truncate flex-1 cursor-help" 
                    style={{ color: textColor }}
                    title={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                  >
                    {hsl.h}°, {hsl.s}%, {hsl.l}%
                  </code>
                  <button
                    onClick={() => copyColor(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')}
                    className="p-0.5 hover:bg-white/20 rounded transition-colors flex-shrink-0"
                  >
                    {copied === 'hsl' ? (
                      <CheckCircle className="w-3 h-3" style={{ color: textColor }} />
                    ) : (
                      <Copy className="w-3 h-3 opacity-70" style={{ color: textColor }} />
                    )}
                  </button>
                </div>
              </div>
            )}
            {cmyk && (
              <div className="bg-white/10 backdrop-blur-sm rounded p-2 border-2 border-white/20">
                <p className="text-[10px] font-bold uppercase mb-1 opacity-80" style={{ color: textColor }}>CMJN</p>
                <div className="flex items-center gap-1.5">
                  <code 
                    className="text-xs font-mono font-bold truncate flex-1 cursor-help" 
                    style={{ color: textColor }}
                    title={`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`}
                  >
                    {cmyk.c}%, {cmyk.m}%, {cmyk.y}%, {cmyk.k}%
                  </code>
                  <button
                    onClick={() => copyColor(`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`, 'cmyk')}
                    className="p-0.5 hover:bg-white/20 rounded transition-colors flex-shrink-0"
                  >
                    {copied === 'cmyk' ? (
                      <CheckCircle className="w-3 h-3" style={{ color: textColor }} />
                    ) : (
                      <Copy className="w-3 h-3 opacity-70" style={{ color: textColor }} />
                    )}
                  </button>
                </div>
              </div>
            )}
            {pantone && (
              <div className="bg-white/10 backdrop-blur-sm rounded p-2 border-2 border-white/20">
                <p className="text-[10px] font-bold uppercase mb-1 opacity-80" style={{ color: textColor }}>Pantone</p>
                <div className="flex items-center gap-1.5">
                  <code 
                    className="text-[10px] font-mono font-bold truncate flex-1 cursor-help" 
                    style={{ color: textColor }}
                    title={pantone.name}
                  >
                    {pantone.name.split(' ')[1] || pantone.name.substring(0, 12)}
                  </code>
                  <button
                    onClick={() => copyColor(pantone.name, 'pantone')}
                    className="p-0.5 hover:bg-white/20 rounded transition-colors flex-shrink-0"
                  >
                    {copied === 'pantone' ? (
                      <CheckCircle className="w-3 h-3" style={{ color: textColor }} />
                    ) : (
                      <Copy className="w-3 h-3 opacity-70" style={{ color: textColor }} />
                    )}
                  </button>
                </div>
              </div>
            )}
            <div className="bg-white/10 backdrop-blur-sm rounded p-2 border-2 border-white/20">
              <p className="text-[10px] font-bold uppercase mb-1 opacity-80" style={{ color: textColor }}>Decimal</p>
              <div className="flex items-center gap-1.5">
                <code 
                  className="text-sm font-mono font-bold truncate flex-1 cursor-help" 
                  style={{ color: textColor }}
                  title={`${(rgb.r << 16) | (rgb.g << 8) | rgb.b}`}
                >
                  {(rgb.r << 16) | (rgb.g << 8) | rgb.b}
                </code>
                <button
                  onClick={() => copyColor(`${(rgb.r << 16) | (rgb.g << 8) | rgb.b}`, 'decimal')}
                  className="p-0.5 hover:bg-white/20 rounded transition-colors flex-shrink-0"
                >
                  {copied === 'decimal' ? (
                    <CheckCircle className="w-3 h-3" style={{ color: textColor }} />
                  ) : (
                    <Copy className="w-3 h-3 opacity-70" style={{ color: textColor }} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tous les formats détaillés - compact */}
      <div className="bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-700 rounded-lg p-4 shadow-neo dark:shadow-none">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-neo-violet" />
          <h3 className="text-base font-display font-bold dark:text-white">Tous les Formats</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {colorFormats.map((format) => (
            <div
              key={format.format}
              className="group relative p-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-neo-violet dark:hover:border-neo-violet transition-all"
            >
              <div className="flex items-center gap-3">
                {/* Carré de couleur */}
                <div
                  className="w-10 h-10 rounded border-2 border-black dark:border-white flex-shrink-0 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]"
                  style={{ backgroundColor: currentColor }}
                />
                
                {/* Informations */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {format.label}
                    </span>
                    <button
                      onClick={() => copyColor(format.value, format.format)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all flex-shrink-0"
                      title="Copier"
                    >
                      {copied === format.format ? (
                        <CheckCircle className="w-3 h-3 text-neo-green" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <code 
                    className="block font-mono text-xs font-bold text-neo-black dark:text-white break-all truncate pr-6 cursor-help" 
                    title={format.value}
                  >
                    {format.value}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aperçus pratiques - compact */}
      <div className="bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-700 rounded-lg p-4 shadow-neo dark:shadow-none">
        <h3 className="text-base font-display font-bold dark:text-white mb-3">Aperçus</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center">
            <div
              className="w-full h-16 rounded-lg border-2 border-black dark:border-white mb-1.5 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]"
              style={{ backgroundColor: currentColor }}
            />
            <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400">Fond</p>
          </div>
          <div className="text-center">
            <div
              className="w-full h-16 rounded-lg border-2 border-black dark:border-white mb-1.5 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] flex items-center justify-center bg-white"
            >
              <span
                className="text-xl font-bold"
                style={{ color: currentColor }}
              >
                Aa
              </span>
            </div>
            <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400">Texte</p>
          </div>
          <div className="text-center">
            <div
              className="w-full h-16 rounded-lg border-2 border-black dark:border-white mb-1.5 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] flex items-center justify-center"
              style={{ backgroundColor: currentColor }}
            >
              <span className="text-xl font-bold text-white">Aa</span>
            </div>
            <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400">Contraste</p>
          </div>
          <div className="text-center">
            <div
              className="w-full h-16 rounded-lg border-2 border-black dark:border-white mb-1.5 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]"
              style={{ 
                background: `linear-gradient(135deg, ${currentColor} 0%, ${currentColor}80 100%)`
              }}
            />
            <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400">Dégradé</p>
          </div>
        </div>
      </div>
    </div>
  );
};

