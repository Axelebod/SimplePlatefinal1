import { useRef } from 'react';
import html2canvas from 'html2canvas';

interface UseExportToPNGOptions {
  filename?: string;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
}

export const useExportToPNG = (options: UseExportToPNGOptions = {}) => {
  const { filename = 'export', onError, onSuccess } = options;

  const exportToPNG = async (elementRef: React.RefObject<HTMLElement>) => {
    if (!elementRef.current) {
      onError?.(new Error('Élément non trouvé'));
      return;
    }

    try {
      // A4 dimensions in pixels at 300 DPI (standard print quality)
      // A4: 210mm x 297mm = 8.27" x 11.69" = 2480px x 3508px at 300 DPI
      const A4_WIDTH_PX = 2480;
      const A4_HEIGHT_PX = 3508;

      const canvas = await html2canvas(elementRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: elementRef.current.offsetWidth,
        height: elementRef.current.offsetHeight
      });

      // Create a new canvas with A4 dimensions
      const a4Canvas = document.createElement('canvas');
      a4Canvas.width = A4_WIDTH_PX;
      a4Canvas.height = A4_HEIGHT_PX;
      const ctx = a4Canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Impossible de créer le contexte canvas');
      }

      // Fill with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, A4_WIDTH_PX, A4_HEIGHT_PX);

      // Calculate scaling to fit A4 while maintaining aspect ratio
      const imgAspectRatio = canvas.width / canvas.height;
      const a4AspectRatio = A4_WIDTH_PX / A4_HEIGHT_PX;

      let drawWidth = A4_WIDTH_PX;
      let drawHeight = A4_HEIGHT_PX;
      let offsetX = 0;
      let offsetY = 0;

      if (imgAspectRatio > a4AspectRatio) {
        // Image is wider, fit to width
        drawHeight = A4_WIDTH_PX / imgAspectRatio;
        offsetY = (A4_HEIGHT_PX - drawHeight) / 2;
      } else {
        // Image is taller, fit to height
        drawWidth = A4_HEIGHT_PX * imgAspectRatio;
        offsetX = (A4_WIDTH_PX - drawWidth) / 2;
      }

      // Draw the original canvas onto the A4 canvas
      ctx.drawImage(canvas, offsetX, offsetY, drawWidth, drawHeight);

      a4Canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            onSuccess?.();
          }
        },
        'image/png'
      );
    } catch (error) {
      console.error('Erreur export PNG:', error);
      const err = error instanceof Error ? error : new Error('Erreur inconnue lors de l\'export PNG');
      onError?.(err);
      throw err;
    }
  };

  return { exportToPNG };
};

