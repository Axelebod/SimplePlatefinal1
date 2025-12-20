import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safeStorage } from '../utils/safeStorage';

type Language = 'fr' | 'en';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'fr' as Language,
      setLanguage: (lang: Language) => set({ language: lang }),
      toggleLanguage: () => set((state) => ({ language: state.language === 'fr' ? 'en' : 'fr' })),
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => safeStorage as any),
    }
  )
);

