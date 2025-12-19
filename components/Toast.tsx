import React, { useEffect } from 'react';
import { Check, X, AlertTriangle, Info, XCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastComponent: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  const icons = {
    success: Check,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: 'bg-neo-green border-neo-green text-black',
    error: 'bg-neo-red border-neo-red text-white',
    warning: 'bg-neo-yellow border-neo-yellow text-black',
    info: 'bg-neo-blue border-neo-blue text-white',
  };

  const Icon = icons[toast.type];

  return (
    <div
      className={`${colors[toast.type]} border-2 border-black dark:border-white rounded-lg p-4 shadow-neo dark:shadow-[2px_2px_0px_0px_#fff] flex items-start gap-3 min-w-[300px] max-w-md animate-in slide-in-from-right fade-in duration-300`}
      role="alert"
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="flex-1 font-bold text-sm">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastComponent toast={toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
};

