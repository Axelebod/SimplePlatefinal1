
import { LucideIcon } from 'lucide-react';

export type ToolCategory = 'Text' | 'Image' | 'Dev' | 'Life' | 'Business' | 'Security';

export interface ToolInput {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'file';
  placeholder?: string;
  options?: string[]; // For select inputs
  required?: boolean;
  rows?: number; // Hauteur personnalisée pour les textareas
  className?: string; // Classes CSS spécifiques (ex: font-mono)
  helpText?: string; // Petit texte d'aide sous le label
  accept?: string; // Pour les inputs file (ex: image/*)
}

export interface ToolSEO {
  title: string;
  description: string;
  keywords: string[];
}

export interface ToolConfig {
  id: string;
  slug?: string; // Slug français pour les URLs SEO-friendly (optionnel, utilise id si absent)
  title: string;
  description: string;
  category: ToolCategory;
  cost: number;
  isPremium: boolean;
  iconName: string;
  inputs: ToolInput[];
  
  // Logic Types
  outputType: 'text' | 'image';
  promptGenerator?: (data: Record<string, any>) => string;

  seo: ToolSEO;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
}

export interface UserState {
  user: User | null; // L'utilisateur connecté
  credits: number; // Total (credits_free + credits_paid) - pour compatibilité
  creditsFree: number; // Crédits gratuits (rechargent chaque semaine)
  creditsPaid: number; // Crédits achetés (ne s'expirent jamais)
  isPro: boolean;
  isDarkMode: boolean; // ÉTAT DU MODE NUIT
  
  login: (user: User) => Promise<void>; // Async pour fetch DB
  logout: () => Promise<void>;
  refreshCredits: () => Promise<void>; // Rafraîchir depuis Supabase
  deductCredits: (amount: number) => Promise<boolean>; // Async pour déduction atomique
  refillCredits: () => void;
  buyCredits: (amount: number) => Promise<void>; // Async pour créer checkout avec email
  togglePro: () => Promise<void>; // Async maintenant
  toggleDarkMode: () => void; // ACTION
}
