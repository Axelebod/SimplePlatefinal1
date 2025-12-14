import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    }
  )
);

