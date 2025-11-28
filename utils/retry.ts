/**
 * Retry logic pour les appels API avec backoff exponentiel
 */
export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryableErrors?: (error: any) => boolean;
}

const defaultRetryableErrors = (error: any): boolean => {
  // Retry sur erreurs réseau, timeouts, et erreurs 5xx
  if (error?.code === 'NETWORK_ERROR' || error?.code === 'TIMEOUT') {
    return true;
  }
  if (error?.status >= 500 && error?.status < 600) {
    return true;
  }
  return false;
};

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    retryableErrors = defaultRetryableErrors,
  } = options;

  let lastError: any;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Ne pas retry si c'est la dernière tentative ou si l'erreur n'est pas retryable
      if (attempt === maxRetries || !retryableErrors(error)) {
        throw error;
      }

      // Attendre avant de retry avec backoff exponentiel
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * backoffFactor, maxDelay);
    }
  }

  throw lastError;
}

