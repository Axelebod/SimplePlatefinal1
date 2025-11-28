import React, { useEffect, useRef, useState } from 'react';
import { Download, Save, Palette, Edit3, Eye } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ReactMarkdown from 'react-markdown';

interface CVDisplayProps {
  result: string;
  onSave?: () => void;
  isSaved?: boolean;
  isSaving?: boolean;
  onChange?: (content: string) => void;
}

const CV_TEMPLATES = [
  { name: 'Moderne', wrapper: 'bg-white border-black text-black', accent: '#6C47FF' },
  { name: 'Minimal', wrapper: 'bg-gray-50 border-gray-400 text-gray-900', accent: '#0F766E' },
  { name: 'Dark', wrapper: 'bg-stone-900 border-stone-700 text-white', accent: '#FACC15' },
];

export const CVDisplay: React.FC<CVDisplayProps> = ({
  result,
  onSave,
  isSaved = false,
  isSaving = false,
  onChange,
}) => {
  const cvRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState(result);
  const [isEditing, setIsEditing] = useState(false);
  const [templateIndex, setTemplateIndex] = useState(0);
  const [accentColor, setAccentColor] = useState(CV_TEMPLATES[0].accent);

  useEffect(() => {
    setContent(result);
  }, [result]);

  useEffect(() => {
    setAccentColor(CV_TEMPLATES[templateIndex].accent);
  }, [templateIndex]);

  const handleContentChange = (value: string) => {
    setContent(value);
    onChange?.(value);
  };

  const exportToPDF = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cvRef.current) return;
    
    try {
      const canvas = await html2canvas(cvRef.current, {
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
      pdf.save(`cv-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Erreur export PDF:', error);
      alert('Erreur lors de l\'export PDF. Veuillez réessayer.');
    }
  };

  const exportToPNG = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cvRef.current) return;
    
    try {
      const canvas = await html2canvas(cvRef.current, {
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
          a.download = `cv-${Date.now()}.png`;
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

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
        {CV_TEMPLATES.map((tpl, idx) => (
          <button
            key={tpl.name}
            onClick={() => setTemplateIndex(idx)}
            className={`px-3 py-1 rounded-md text-xs font-bold border ${
              templateIndex === idx
                ? 'bg-neo-black text-white border-black'
                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'
            }`}
          >
            {tpl.name}
          </button>
        ))}
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-300">
          <Palette className="w-4 h-4" />
          Accent
          <input
            type="color"
            value={accentColor}
            onChange={e => setAccentColor(e.target.value)}
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
        <div className="flex items-center justify-end gap-2">
          {onSave && (
            <button
              type="button"
              onClick={onSave}
              disabled={isSaved || isSaving}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-2 ${
                isSaved
                  ? 'bg-neo-green text-black cursor-not-allowed'
                  : isSaving
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                  : 'bg-neo-violet text-white hover:bg-purple-500'
              }`}
            >
              <Save className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              {isSaving ? 'Sauvegarde...' : isSaved ? 'Sauvegardé' : 'Sauvegarder'}
            </button>
          )}
          <button
            type="button"
            onClick={exportToPDF}
            className="px-4 py-2 bg-neo-violet text-white rounded-md text-sm font-bold hover:bg-purple-500 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
          <button
            type="button"
            onClick={exportToPNG}
            className="px-4 py-2 bg-neo-blue text-white rounded-md text-sm font-bold hover:bg-blue-500 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            PNG
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

      <div
        ref={cvRef}
        className={`${CV_TEMPLATES[templateIndex].wrapper} border-2 rounded-lg p-12 max-w-4xl mx-auto shadow-neo print:shadow-none print:p-8`}
        style={{ minHeight: '297mm' }}
      >
        <div className="prose prose-sm max-w-none markdown-body cv-template">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className="text-4xl font-display font-bold mb-2 border-b-4 pb-3"
                  style={{ borderColor: accentColor }}
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-2xl font-display font-bold mt-8 mb-4 uppercase tracking-wide"
                  style={{ color: accentColor }}
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-lg font-bold mt-4 mb-2" style={{ color: accentColor }} {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-inside space-y-1 my-2" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="text-inherit" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="leading-relaxed my-2" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong style={{ color: accentColor }} {...props} />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

