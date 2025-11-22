
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Check, Copy, Database, AlertTriangle, Loader2 } from 'lucide-react';

export const AdminSetup: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {
    try {
      // On essaie de lire la table profiles
      const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
      
      if (error && error.code === '42P01') { // Code PostgreSQL pour "Table not found"
        setStatus('error');
        setMsg("La base de données est vide. Il faut lancer le script SQL.");
      } else if (error) {
        setStatus('error');
        setMsg("Erreur de connexion : " + error.message);
      } else {
        setStatus('ready');
        setMsg("Tout est opérationnel ! Le backend est installé.");
      }
    } catch (e: any) {
      setStatus('error');
      setMsg("Erreur critique : " + e.message);
    }
  };

  const sqlScript = `
-- 1. TABLES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  credits INTEGER DEFAULT 5 NOT NULL,
  is_pro BOOLEAN DEFAULT FALSE NOT NULL,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Montant en crédits (positif = achat, négatif = usage)
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. SÉCURITÉ (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 3. AUTOMATISATION (Trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, credits)
  VALUES (new.id, new.email, 5);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
`;

  const copySQL = () => {
    navigator.clipboard.writeText(sqlScript);
    alert("SQL copié ! Colle-le dans Supabase.");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white border-2 border-black shadow-[8px_8px_0px_0px_#000] rounded-lg p-8">
        
        <h1 className="font-display text-3xl font-bold mb-6 flex items-center gap-3">
          <Database className="w-8 h-8 text-neo-violet" />
          Installation du Backend
        </h1>

        {/* STATUS */}
        <div className={`p-4 rounded border-2 border-black mb-8 flex items-center gap-3 ${status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {status === 'loading' && <Loader2 className="w-6 h-6 animate-spin" />}
            {status === 'ready' && <Check className="w-6 h-6" />}
            {status === 'error' && <AlertTriangle className="w-6 h-6" />}
            <span className="font-bold">{msg}</span>
        </div>

        {status === 'error' && (
            <div className="space-y-6">
                <div className="prose">
                    <p>Je ne peux pas installer la base de données à ta place (sécurité), mais j'ai écrit le code.</p>
                    <ol>
                        <li>Copie le code ci-dessous.</li>
                        <li>Va dans <strong>Supabase</strong> &gt; <strong>SQL Editor</strong>.</li>
                        <li>Colle et clique sur <strong>Run</strong>.</li>
                    </ol>
                </div>

                <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-xs font-mono h-64 border-2 border-black">
                        {sqlScript}
                    </pre>
                    <button 
                        onClick={copySQL}
                        className="absolute top-4 right-4 bg-neo-yellow text-black px-3 py-1 rounded font-bold border border-black hover:bg-white transition-colors flex items-center gap-2"
                    >
                        <Copy className="w-4 h-4" /> Copier
                    </button>
                </div>
                
                <div className="text-center">
                    <button onClick={checkBackend} className="px-6 py-3 bg-black text-white font-bold rounded hover:bg-gray-800">
                        Vérifier à nouveau
                    </button>
                </div>
            </div>
        )}

        {status === 'ready' && (
            <div className="text-center py-10">
                <p className="text-xl font-bold mb-4">🚀 Tout est prêt !</p>
                <a href="/" className="text-neo-blue underline font-bold text-lg">Aller sur le site</a>
            </div>
        )}

      </div>
    </div>
  );
};
