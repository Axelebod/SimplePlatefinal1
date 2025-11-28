import { useState, useCallback } from 'react';
import { generateToolContent } from '../services/geminiService';
import { ToolConfig } from '../types';
import { retry } from '../utils/retry';

interface UseToolGenerationOptions {
  tool: ToolConfig;
  onSuccess?: (result: string) => void;
  onError?: (error: Error) => void;
}

export const useToolGeneration = ({ tool, onSuccess, onError }: UseToolGenerationOptions) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const generate = useCallback(async (
    inputs: Record<string, any>,
    fileInput?: string
  ) => {
    if (!tool.promptGenerator) {
      const err = new Error("Config invalide");
      setError(err.message);
      onError?.(err);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Préparer les inputs avec le fichier si nécessaire
      const inputsWithFile = tool.id === 'homework-helper' && fileInput 
        ? { ...inputs, image: 'FILE_UPLOADED' }
        : inputs;
      
      const prompt = tool.promptGenerator(inputsWithFile);
      
      // Vérifier si le prompt contient une erreur
      if (prompt.startsWith('ERROR:')) {
        const err = new Error(prompt.replace('ERROR:', '').trim());
        setError(err.message);
        onError?.(err);
        return;
      }

      // Retry logic avec backoff exponentiel
      const output = await retry(
        async () => {
          return await generateToolContent(
            tool.outputType === 'image' ? 'imagen-4.0-generate-001' : 'gemini-2.5-flash',
            prompt,
            tool.outputType === 'image',
            fileInput
          );
        },
        {
          maxRetries: 3,
          initialDelay: 1000,
          maxDelay: 10000,
          retryableErrors: (err: any) => {
            // Retry sur erreurs réseau et timeouts
            return err?.message?.includes('network') || 
                   err?.message?.includes('timeout') ||
                   err?.code === 'NETWORK_ERROR' ||
                   err?.status >= 500;
          }
        }
      );

      setResult(output);
      onSuccess?.(output);
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(err.message || "Une erreur est survenue.");
      setError(error.message);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [tool, onSuccess, onError]);

  return {
    generate,
    loading,
    error,
    result,
    setResult, // Pour permettre la modification du résultat (editing)
  };
};

