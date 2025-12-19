// Types pour le système de micro SaaS par outil

export interface ToolResult {
  id: string;
  user_id: string;
  tool_id: string;
  inputs: Record<string, any>; // JSON des inputs utilisés
  output: string; // Résultat généré
  output_type: 'text' | 'image';
  credits_used: number;
  created_at: string;
  updated_at?: string;
  is_favorite?: boolean;
  tags?: string[];
  metadata?: Record<string, any>; // Données additionnelles (ex: temps de génération, modèle utilisé)
}

export interface ToolFavorite {
  id: string;
  user_id: string;
  result_id: string;
  created_at: string;
}

export interface ToolStats {
  tool_id: string;
  total_uses: number;
  total_credits_spent: number;
  last_used?: string;
  favorite_count: number;
}

export interface ExportOptions {
  format: 'pdf' | 'json' | 'csv' | 'txt' | 'markdown';
  includeInputs?: boolean;
  includeMetadata?: boolean;
  filename?: string;
}

