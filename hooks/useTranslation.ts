import { useLanguageStore } from '../store/languageStore';
import { fr } from '../locales/fr';
import { en } from '../locales/en';
import { useCallback } from 'react';

type TranslationKey = keyof typeof fr;

export const useTranslation = () => {
  const { language } = useLanguageStore();
  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let value: any = language === 'fr' ? fr : en;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return value || key;
  }, [language]);
  
  return { t, language };
};

