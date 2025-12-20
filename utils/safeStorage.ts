type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

function createMemoryStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem: (key) => (map.has(key) ? map.get(key)! : null),
    setItem: (key, value) => {
      map.set(key, String(value));
    },
    removeItem: (key) => {
      map.delete(key);
    },
  };
}

/**
 * SSR-safe storage: uses `localStorage` in browser, in-memory storage on server.
 * Useful for Zustand persist, to avoid `ReferenceError: localStorage is not defined`.
 */
export const safeStorage: StorageLike =
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined' ? window.localStorage : createMemoryStorage();

