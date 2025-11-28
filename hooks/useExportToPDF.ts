import { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface UseExportToPDFOptions {
  filename?: string;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
}

export const useExportToPDF = (options: UseExportToPDFOptions = {}) => {
  const { filename = 'export', onError, onSuccess } = options;

  const exportToPDF = async (elementRef: React.RefObject<HTMLElement>) => {
    if (!elementRef.current) {
      onError?.(new Error('Élément non trouvé'));
      return;
    }

    try {
      const canvas = await html2canvas(elementRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: elementRef.current.offsetWidth,
        height: elementRef.current.offsetHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

      // Calculate dimensions to fit A4 while maintaining aspect ratio
      const imgAspectRatio = canvas.width / canvas.height;
      const pdfAspectRatio = pdfWidth / pdfHeight;

      let finalWidth = pdfWidth;
      let finalHeight = pdfHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (imgAspectRatio > pdfAspectRatio) {
        // Image is wider, fit to width
        finalHeight = pdfWidth / imgAspectRatio;
        offsetY = (pdfHeight - finalHeight) / 2;
      } else {
        // Image is taller, fit to height
        finalWidth = pdfHeight * imgAspectRatio;
        offsetX = (pdfWidth - finalWidth) / 2;
      }

      pdf.addImage(imgData, 'PNG', offsetX, offsetY, finalWidth, finalHeight);
      pdf.save(`${filename}-${Date.now()}.pdf`);
      onSuccess?.();
    } catch (error) {
      console.error('Erreur export PDF:', error);
      const err = error instanceof Error ? error : new Error('Erreur inconnue lors de l\'export PDF');
      onError?.(err);
      throw err;
    }
  };

  return { exportToPDF };
};

