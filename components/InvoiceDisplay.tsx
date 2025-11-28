import React, { useEffect, useState, useRef } from 'react';
import { Download, Save, Palette, Edit3, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useExportToPDF } from '../hooks/useExportToPDF';
import { useExportToPNG } from '../hooks/useExportToPNG';

interface InvoiceDisplayProps {
  result: string;
  onSave?: () => void;
  isSaved?: boolean;
  isSaving?: boolean;
  onChange?: (content: string) => void;
}

const INVOICE_TEMPLATES = [
  { name: 'Neo Brut', wrapper: 'bg-white border-black text-black', accent: '#6C47FF' },
  { name: 'Minimal', wrapper: 'bg-gray-50 border-gray-400 text-gray-900', accent: '#0F98B0' },
  { name: 'Noir & Or', wrapper: 'bg-stone-900 border-amber-400 text-white', accent: '#FACC15' },
];

export const InvoiceDisplay: React.FC<InvoiceDisplayProps> = ({
  result,
  onSave,
  isSaved = false,
  isSaving = false,
  onChange,
}) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState(result);
  const [isEditing, setIsEditing] = useState(false);
  const [templateIndex, setTemplateIndex] = useState(0);
  const [accentColor, setAccentColor] = useState(INVOICE_TEMPLATES[0].accent);

  const { exportToPDF } = useExportToPDF({ 
    filename: 'facture',
    onError: (err) => alert(`Erreur export PDF: ${err.message}`)
  });
  
  const { exportToPNG } = useExportToPNG({ 
    filename: 'facture',
    onError: (err) => alert(`Erreur export PNG: ${err.message}`)
  });

  useEffect(() => {
    setContent(result);
  }, [result]);

  const handleContentChange = (value: string) => {
    setContent(value);
    onChange?.(value);
  };

  useEffect(() => {
    setAccentColor(INVOICE_TEMPLATES[templateIndex].accent);
  }, [templateIndex]);

  const handleExportPDF = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await exportToPDF(invoiceRef);
  };

  const handleExportPNG = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await exportToPNG(invoiceRef);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {INVOICE_TEMPLATES.map((tpl, idx) => (
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
              onClick={e => {
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
            onClick={handleExportPDF}
            className="px-4 py-2 bg-neo-red text-white rounded-md text-sm font-bold hover:bg-red-500 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
          <button
            type="button"
            onClick={handleExportPNG}
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
        ref={invoiceRef}
        className={`${INVOICE_TEMPLATES[templateIndex].wrapper} border-2 rounded-lg p-12 mx-auto shadow-neo print:shadow-none print:p-8`}
        style={{ 
          width: '210mm', // Largeur A4 standard
          minHeight: '297mm', // Hauteur A4 standard
          maxWidth: '100%' // Responsive sur petits écrans
        }}
      >
        <div className="prose prose-sm max-w-none markdown-body invoice-template">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className="text-3xl font-display font-bold mb-6 pb-4 border-b-4"
                  style={{ borderColor: accentColor }}
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-xl font-bold mt-6 mb-3" style={{ color: accentColor }} {...props} />
              ),
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full border-2 border-gray-300 dark:border-gray-600" {...props} />
                </div>
              ),
              th: ({ node, ...props }) => (
                <th
                  className="px-4 py-2 text-left font-bold border border-gray-400"
                  style={{ backgroundColor: accentColor, color: '#fff' }}
                  {...props}
                />
              ),
              td: ({ node, ...props }) => (
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-600" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-bold" style={{ color: accentColor }} {...props} />
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

