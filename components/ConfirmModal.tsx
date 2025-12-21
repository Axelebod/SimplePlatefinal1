import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'warning',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const variantClasses = {
    danger: 'border-red-500 bg-red-50 dark:bg-red-900/20',
    warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    info: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
  };

  const buttonClasses = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 border-2 border-black dark:border-white rounded-lg shadow-neo dark:shadow-[4px_4px_0px_0px_#fff] max-w-md w-full z-10">
        {/* Header */}
        <div className={`flex items-center gap-3 p-4 border-b-2 border-black dark:border-white ${variantClasses[variant]}`}>
          <AlertTriangle className={`w-6 h-6 ${
            variant === 'danger' ? 'text-red-600' : 
            variant === 'warning' ? 'text-yellow-600' : 
            'text-blue-600'
          }`} />
          <h3 className="font-display text-xl font-bold dark:text-white flex-1">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            aria-label="Fermer"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border-2 border-black dark:border-white rounded-md font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-md font-bold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${buttonClasses[variant]}`}
              disabled={isLoading}
            >
              {isLoading ? '...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

