import React, { useEffect, useMemo, useState } from 'react';
import { Download, Palette, Sparkles, Save, Edit3, Eye } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface PoemDisplayProps {
  result: string;
  onSave?: () => void;
  isSaved?: boolean;
  isSaving?: boolean;
  onChange?: (content: string) => void;
}

const POEM_STYLES = [
  { name: 'Classique', bg: 'bg-gradient-to-br from-amber-50 to-orange-50', border: 'border-amber-300', textHex: '#92400E' },
  { name: 'Moderne', bg: 'bg-gradient-to-br from-purple-50 to-pink-50', border: 'border-purple-300', textHex: '#86198F' },
  { name: 'Sombre', bg: 'bg-gradient-to-br from-gray-900 to-gray-800', border: 'border-gray-600', textHex: '#F3F4F6' },
  { name: 'Nature', bg: 'bg-gradient-to-br from-green-50 to-emerald-50', border: 'border-green-300', textHex: '#065F46' },
];

export const PoemDisplay: React.FC<PoemDisplayProps> = ({ 
  result,
  onSave,
  isSaved = false,
  isSaving = false,
  onChange,
}) => {
  const [selectedStyle, setSelectedStyle] = useState(0);
  const [textColor, setTextColor] = useState(POEM_STYLES[0].textHex);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(result);
  const poemRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setContent(result);
  }, [result]);

  useEffect(() => {
    setTextColor(POEM_STYLES[selectedStyle].textHex);
  }, [selectedStyle]);

  const lines = useMemo(() => {
    const poemText = content.replace(/^#.*$/m, '').trim();
    return poemText.split('\n');
  }, [content]);

  const handleContentChange = (value: string) => {
    setContent(value);
    onChange?.(value);
  };

  const exportToPDF = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!poemRef.current) return;
    
    try {
      const canvas = await html2canvas(poemRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`poeme-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Erreur export PDF:', error);
      alert('Erreur lors de l\'export PDF. Veuillez réessayer.');
    }
  };

  const exportToPNG = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!poemRef.current) return;
    
    try {
      const canvas = await html2canvas(poemRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `poeme-${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Erreur export PNG:', error);
      alert('Erreur lors de l\'export PNG. Veuillez réessayer.');
    }
  };

  const style = POEM_STYLES[selectedStyle];

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Contrôles */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="font-bold text-sm dark:text-white">Style :</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {POEM_STYLES.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedStyle(idx)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                  selectedStyle === idx
                    ? 'bg-neo-black dark:bg-white text-white dark:text-black'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-300">
            Couleur texte
            <input
              type="color"
              value={textColor}
              onChange={e => setTextColor(e.target.value)}
              className="w-10 h-6 border border-gray-300 rounded cursor-pointer"
            />
          </label>
          <button
            onClick={() => setIsEditing(prev => !prev)}
            className="px-3 py-1.5 rounded-md text-xs font-bold border border-gray-300 dark:border-gray-600 flex items-center gap-1"
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

        <div className="flex gap-2">
          {onSave && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSave();
              }}
              disabled={isSaved || isSaving}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-2 ${
                isSaved
                  ? 'bg-neo-green text-black cursor-not-allowed'
                  : isSaving
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                  : 'bg-neo-violet text-white hover:bg-purple-500'
              }`}
              title={isSaved ? 'Déjà sauvegardé' : 'Sauvegarder ce résultat'}
            >
              <Save className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              {isSaving ? 'Sauvegarde...' : isSaved ? 'Sauvegardé' : 'Sauvegarder'}
            </button>
          )}
          <button
            type="button"
            onClick={exportToPDF}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseUp={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="px-4 py-2 bg-neo-violet text-white rounded-md text-sm font-bold hover:bg-purple-500 transition-colors flex items-center gap-2 select-none cursor-pointer user-select-none"
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
            title="Télécharger en PDF"
          >
            <Download className="w-4 h-4 pointer-events-none" />
            <span className="pointer-events-none">PDF</span>
          </button>
          <button
            type="button"
            onClick={exportToPNG}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseUp={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="px-4 py-2 bg-neo-blue text-white rounded-md text-sm font-bold hover:bg-blue-500 transition-colors flex items-center gap-2 select-none cursor-pointer user-select-none"
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
            title="Télécharger en PNG"
          >
            <Download className="w-4 h-4 pointer-events-none" />
            <span className="pointer-events-none">PNG</span>
          </button>
        </div>
      </div>

      {isEditing && (
        <textarea
          value={content}
          onChange={e => handleContentChange(e.target.value)}
          rows={10}
          className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4 font-mono text-sm bg-white dark:bg-gray-900 dark:text-white"
        />
      )}

      {/* Poème stylisé */}
      <div
        ref={poemRef}
        className={`${style.bg} ${style.border} border-4 rounded-lg p-12 max-w-3xl mx-auto shadow-neo dark:shadow-none`}
      >
        <div className="text-center space-y-4" style={{ color: textColor }}>
          {lines.map((line, idx) => {
            // Détecter les strophes (lignes vides)
            if (!line.trim()) {
              return <div key={idx} className="h-6" />;
            }
            
            // Détecter les titres (lignes courtes ou en gras)
            const isTitle = line.length < 50 || line.startsWith('**');
            const isItalic = line.startsWith('*') && line.endsWith('*');
            
            return (
              <p
                key={idx}
                className={`${
                  isTitle
                    ? 'text-2xl font-display font-bold mb-4'
                    : isItalic
                    ? 'text-lg italic'
                    : 'text-xl leading-relaxed'
                }`}
                dangerouslySetInnerHTML={{
                  __html: line
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                }}
              />
            );
          })}
        </div>
        
        <div className="mt-8 pt-6 border-t-2 border-current opacity-50 text-center">
          <Sparkles className="w-6 h-6 mx-auto mb-2" />
          <p className="text-sm italic">Généré par SimplePlate AI</p>
        </div>
      </div>
    </div>
  );
};

