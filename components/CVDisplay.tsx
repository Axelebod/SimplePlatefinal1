import React from 'react';
import { Download, Save } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ReactMarkdown from 'react-markdown';

interface CVDisplayProps {
  result: string;
  onSave?: () => void;
  isSaved?: boolean;
  isSaving?: boolean;
}

export const CVDisplay: React.FC<CVDisplayProps> = ({ 
  result,
  onSave,
  isSaved = false,
  isSaving = false
}) => {
  const cvRef = React.useRef<HTMLDivElement>(null);

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

      {/* CV avec template professionnel */}
      <div
        ref={cvRef}
        className="bg-white border-2 border-black rounded-lg p-12 max-w-4xl mx-auto shadow-neo print:shadow-none print:p-8"
        style={{ minHeight: '297mm' }}
      >
        <div className="prose prose-sm max-w-none markdown-body cv-template">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => (
                <h1 className="text-4xl font-display font-bold mb-2 text-neo-black border-b-4 border-neo-violet pb-3" {...props} />
              ),
              h2: ({node, ...props}) => (
                <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-neo-violet uppercase tracking-wide" {...props} />
              ),
              h3: ({node, ...props}) => (
                <h3 className="text-lg font-bold mt-4 mb-2 text-neo-black" {...props} />
              ),
              ul: ({node, ...props}) => (
                <ul className="list-disc list-inside space-y-1 my-2" {...props} />
              ),
              li: ({node, ...props}) => (
                <li className="text-gray-700" {...props} />
              ),
              p: ({node, ...props}) => (
                <p className="text-gray-700 leading-relaxed my-2" {...props} />
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

