import React from 'react';
import { Download, Save } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ReactMarkdown from 'react-markdown';

interface InvoiceDisplayProps {
  result: string;
  onSave?: () => void;
  isSaved?: boolean;
  isSaving?: boolean;
}

export const InvoiceDisplay: React.FC<InvoiceDisplayProps> = ({ 
  result,
  onSave,
  isSaved = false,
  isSaving = false
}) => {
  const invoiceRef = React.useRef<HTMLDivElement>(null);

  const exportToPDF = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!invoiceRef.current) return;
    
    try {
      const canvas = await html2canvas(invoiceRef.current, {
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
      pdf.save(`facture-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Erreur export PDF:', error);
      alert('Erreur lors de l\'export PDF. Veuillez réessayer.');
    }
  };

  const exportToPNG = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!invoiceRef.current) return;
    
    try {
      const canvas = await html2canvas(invoiceRef.current, {
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
          a.download = `facture-${Date.now()}.png`;
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
      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
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
          className="px-4 py-2 bg-neo-red text-white rounded-md text-sm font-bold hover:bg-red-500 transition-colors flex items-center gap-2 select-none cursor-pointer user-select-none"
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

      {/* Facture avec template professionnel */}
      <div
        ref={invoiceRef}
        className="bg-white border-2 border-black rounded-lg p-12 max-w-4xl mx-auto shadow-neo print:shadow-none print:p-8"
        style={{ minHeight: '297mm' }}
      >
        <div className="prose prose-sm max-w-none markdown-body invoice-template">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => (
                <h1 className="text-3xl font-display font-bold mb-6 pb-4 border-b-4 border-neo-black" {...props} />
              ),
              h2: ({node, ...props}) => (
                <h2 className="text-xl font-bold mt-6 mb-3 text-neo-violet" {...props} />
              ),
              table: ({node, ...props}) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full border-2 border-gray-300" {...props} />
                </div>
              ),
              th: ({node, ...props}) => (
                <th className="bg-neo-yellow px-4 py-2 text-left font-bold border border-gray-400" {...props} />
              ),
              td: ({node, ...props}) => (
                <td className="px-4 py-2 border border-gray-300" {...props} />
              ),
              strong: ({node, ...props}) => (
                <strong className="font-bold text-neo-black" {...props} />
              ),
            }}
          >
            {result}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

