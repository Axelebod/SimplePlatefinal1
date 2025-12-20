
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    // En production, ceci doit être rempli dans les variables d'environnement
    if (typeof window !== 'undefined') {
        console.warn("Supabase URLs manquantes. Veuillez configurer le fichier .env ou les variables Vercel.");
    }
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co', 
    supabaseAnonKey || 'placeholder-key'
);
