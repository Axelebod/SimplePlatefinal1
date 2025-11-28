import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // Ici vous pourriez envoyer l'erreur à un service de monitoring (Sentry, etc.)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-neo-white dark:bg-gray-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 border-2 border-red-500 rounded-lg p-6 shadow-neo">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
                Oups, une erreur est survenue
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {this.state.error?.message || 'Une erreur inattendue s\'est produite.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2 bg-neo-black dark:bg-white text-white dark:text-black font-bold rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retour à l'accueil
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Recharger
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

