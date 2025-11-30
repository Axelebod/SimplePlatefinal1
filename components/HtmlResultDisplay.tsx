import React, { useState, useRef } from 'react';
import { Download, Edit3, Eye, Code, Save, Maximize, Minimize, FileImage, FileText } from 'lucide-react';
import { useExportToPDF } from '../hooks/useExportToPDF';
import { useExportToPNG } from '../hooks/useExportToPNG';

interface HtmlResultDisplayProps {
  result: string;
  title: string;
  filename: string;
  onSave?: () => void;
  isSaved?: boolean;
  isSaving?: boolean;
  onChange?: (content: string) => void;
  editable?: boolean;
}

export const HtmlResultDisplay: React.FC<HtmlResultDisplayProps> = ({
  result,
  title,
  filename,
  onSave,
  isSaved = false,
  isSaving = false,
  onChange,
  editable = true,
}) => {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [htmlContent, setHtmlContent] = useState(result);
  const previewRef = useRef<HTMLDivElement>(null);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const { exportToPDF } = useExportToPDF({ 
    filename,
    onError: (err) => alert(`Erreur export PDF: ${err.message}`)
  });
  
  const { exportToPNG } = useExportToPNG({ 
    filename,
    onError: (err) => alert(`Erreur export PNG: ${err.message}`)
  });

  React.useEffect(() => {
    setHtmlContent(result);
  }, [result]);

  // Synchroniser les modifications depuis l'iframe
  React.useEffect(() => {
    if (!iframeRef.current || !editable || viewMode !== 'preview') return;

    const iframe = iframeRef.current;
    
    // Debounce pour éviter trop de mises à jour
    let updateTimeout: NodeJS.Timeout;
    
    const syncContent = () => {
      clearTimeout(updateTimeout);
      updateTimeout = setTimeout(() => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (!iframeDoc) return;
          
          // Récupérer le HTML complet de l'iframe
          const updatedHtml = iframeDoc.documentElement.outerHTML;
          if (updatedHtml && updatedHtml !== htmlContent) {
            handleContentChange(updatedHtml);
          }
        } catch (e) {
          // Ignorer les erreurs CORS si nécessaire
          console.log('Sync content:', e);
        }
      }, 500); // Debounce de 500ms
    };

    const handleLoad = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) return;

        // Ajouter des listeners sur tous les éléments contentEditable
        const editableElements = iframeDoc.querySelectorAll('[contenteditable="true"]');
        
        editableElements.forEach((el) => {
          el.addEventListener('input', syncContent);
          el.addEventListener('blur', syncContent);
        });

        // Écouter aussi les changements sur le document entier
        iframeDoc.addEventListener('input', syncContent);
        iframeDoc.addEventListener('blur', syncContent, true);
      } catch (e) {
        console.log('Setup editable listeners:', e);
      }
    };

    iframe.addEventListener('load', handleLoad);
    
    // Si déjà chargé
    setTimeout(() => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc && iframeDoc.readyState === 'complete') {
          handleLoad();
        }
      } catch (e) {
        // Ignorer
      }
    }, 100);

    return () => {
      clearTimeout(updateTimeout);
      iframe.removeEventListener('load', handleLoad);
    };
  }, [htmlContent, editable, viewMode, handleContentChange]);

  const handleContentChange = (newContent: string) => {
    setHtmlContent(newContent);
    onChange?.(newContent);
  };

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (viewMode === 'preview' && iframeRef.current) {
      try {
        const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
        if (!iframeDoc) {
          alert('Impossible d\'accéder au contenu de l\'iframe');
          return;
        }

        // Créer un élément temporaire avec le contenu de l'iframe
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = iframeDoc.body.innerHTML;
        // Copier les styles du body
        const bodyStyles = window.getComputedStyle(iframeDoc.body);
        tempDiv.style.width = bodyStyles.width || '210mm';
        tempDiv.style.minHeight = bodyStyles.minHeight || '297mm';
        tempDiv.style.backgroundColor = bodyStyles.backgroundColor || '#ffffff';
        tempDiv.style.padding = bodyStyles.padding || '0';
        tempDiv.style.margin = '0';
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '0';
        document.body.appendChild(tempDiv);
        
        await exportToPDF({ current: tempDiv } as React.RefObject<HTMLDivElement>);
        document.body.removeChild(tempDiv);
      } catch (error) {
        console.error('Erreur export PDF:', error);
        alert('Erreur lors de l\'export PDF. Veuillez réessayer.');
      }
    } else if (previewRef.current) {
      await exportToPDF(previewRef);
    }
  };

  const handleExportPNG = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (viewMode === 'preview' && iframeRef.current) {
      try {
        const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
        if (!iframeDoc) {
          alert('Impossible d\'accéder au contenu de l\'iframe');
          return;
        }

        // Créer un élément temporaire avec le contenu de l'iframe
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = iframeDoc.body.innerHTML;
        // Copier les styles du body
        const bodyStyles = window.getComputedStyle(iframeDoc.body);
        tempDiv.style.width = bodyStyles.width || '210mm';
        tempDiv.style.minHeight = bodyStyles.minHeight || '297mm';
        tempDiv.style.backgroundColor = bodyStyles.backgroundColor || '#ffffff';
        tempDiv.style.padding = bodyStyles.padding || '0';
        tempDiv.style.margin = '0';
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '0';
        document.body.appendChild(tempDiv);
        
        await exportToPNG({ current: tempDiv } as React.RefObject<HTMLDivElement>);
        document.body.removeChild(tempDiv);
      } catch (error) {
        console.error('Erreur export PNG:', error);
        alert('Erreur lors de l\'export PNG. Veuillez réessayer.');
      }
    } else if (previewRef.current) {
      await exportToPNG(previewRef);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg dark:text-white">{title}</h3>
          <span className="px-2 py-1 bg-neo-green text-black text-xs font-bold rounded">
            HTML
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Preview/Code */}
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-md p-1 border border-gray-300 dark:border-gray-600">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-2 ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-gray-600 shadow-sm text-black dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" />
              Aperçu
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-2 ${
                viewMode === 'code'
                  ? 'bg-white dark:bg-gray-600 shadow-sm text-black dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Code className="w-4 h-4" />
              Code
            </button>
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
            title="Plein écran"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Download HTML */}
          <button
            onClick={handleDownload}
            className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
            title="Télécharger HTML"
          >
            <Code className="w-4 h-4" />
            <span className="hidden sm:inline">HTML</span>
          </button>

          {/* Download PDF */}
          <button
            onClick={handleExportPDF}
            className="px-3 py-2 bg-neo-red text-white rounded-md text-xs font-bold hover:bg-red-500 transition-colors flex items-center gap-2"
            title="Télécharger PDF"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          {/* Download PNG */}
          <button
            onClick={handleExportPNG}
            className="px-3 py-2 bg-neo-blue text-white rounded-md text-xs font-bold hover:bg-blue-500 transition-colors flex items-center gap-2"
            title="Télécharger PNG"
          >
            <FileImage className="w-4 h-4" />
            <span className="hidden sm:inline">PNG</span>
          </button>

          {/* Save */}
          {onSave && editable && (
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
              <span className="hidden sm:inline">
                {isSaving ? 'Sauvegarde...' : isSaved ? 'Sauvegardé' : 'Sauvegarder'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {viewMode === 'preview' ? (
        <div ref={previewRef} className="relative border-2 border-black dark:border-gray-600 rounded-lg overflow-hidden bg-white shadow-neo dark:shadow-none">
          <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)', minHeight: '600px' }}>
            <iframe
              ref={iframeRef}
              srcDoc={htmlContent}
              title={title}
              className="w-full border-0"
              sandbox="allow-same-origin allow-scripts"
              style={{ 
                minHeight: '800px',
                height: 'auto',
                width: '100%',
                transform: 'scale(1)',
                transformOrigin: 'top left'
              }}
            />
          </div>
          {/* Overlay pour indiquer que c'est éditable */}
          {editable && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-neo-yellow/90 text-black text-xs font-bold rounded border border-black z-10">
              ✏️ Éditable
            </div>
          )}
        </div>
      ) : (
        <div className="border-2 border-black dark:border-gray-600 rounded-lg overflow-hidden">
          <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)', minHeight: '600px' }}>
            <textarea
              value={htmlContent}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full p-6 font-mono text-base bg-gray-900 text-green-200 dark:bg-gray-950 dark:text-green-300 border-0 focus:outline-none resize-none"
              spellCheck={false}
              style={{ minHeight: '800px', height: 'auto' }}
            />
          </div>
          <div className="p-4 bg-gray-800 dark:bg-gray-900 border-t-2 border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-400 font-bold">
            <span>✏️ Modifiez le code HTML directement</span>
            <span>{htmlContent.length.toLocaleString()} caractères • {htmlContent.split('\n').length} lignes</span>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <span>✅ HTML valide</span>
        <span>•</span>
        <span>📱 Responsive</span>
        <span>•</span>
        <span>🎨 Modifiable</span>
      </div>
    </div>
  );
};

