import React, { useState } from 'react';
import { Download, Palette, Sparkles, Save } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface PoemDisplayProps {
  result: string;
  onSave?: () => void;
  isSaved?: boolean;
  isSaving?: boolean;
}

const POEM_STYLES = [
  { name: 'Classique', bg: 'bg-gradient-to-br from-amber-50 to-orange-50', border: 'border-amber-300', text: 'text-amber-900' },
  { name: 'Moderne', bg: 'bg-gradient-to-br from-purple-50 to-pink-50', border: 'border-purple-300', text: 'text-purple-900' },
  { name: 'Sombre', bg: 'bg-gradient-to-br from-gray-800 to-gray-900', border: 'border-gray-600', text: 'text-gray-100' },
  { name: 'Nature', bg: 'bg-gradient-to-br from-green-50 to-emerald-50', border: 'border-green-300', text: 'text-green-900' },
];

export const PoemDisplay: React.FC<PoemDisplayProps> = ({ 
  result,
  onSave,
  isSaved = false,
  isSaving = false
}) => {
  const [selectedStyle, setSelectedStyle] = useState(0);
  const poemRef = React.useRef<HTMLDivElement>(null);

  // Extraire le poème du markdown
  const poemText = result.replace(/^#.*$/m, '').trim();
  const lines = poemText.split('\n').filter(line => line.trim());

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
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="font-bold text-sm dark:text-white">Style :</span>
          <div className="flex gap-2">
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

      {/* Poème stylisé */}
      <div
        ref={poemRef}
        className={`${style.bg} ${style.border} border-4 rounded-lg p-12 max-w-3xl mx-auto shadow-neo dark:shadow-none`}
      >
        <div className={`${style.text} text-center space-y-4`}>
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

