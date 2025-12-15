import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Loader2, AlertTriangle, Check, Lock } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier la session Supabase pour voir si on est en mode réinitialisation
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      // Si pas de session, on vérifie les paramètres URL
      if (!session) {
        const hash = searchParams.get('hash');
        const type = searchParams.get('type');
        // Les paramètres peuvent être dans l'URL ou dans le hash
        if (!hash && !type) {
          // Pas d'erreur immédiate, l'utilisateur peut quand même essayer
          // Supabase gérera la validation côté serveur
        }
      }
    };
    checkSession();
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password.length < 6) {
      setError(t('resetPassword.minLengthError'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('resetPassword.mismatchError'));
      return;
    }

    setLoading(true);

    try {
      // Vérifier d'abord qu'on a une session valide (créée par le lien de réinitialisation)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error(t('resetPassword.sessionExpired'));
      }

      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setMessage(t('resetPassword.success'));
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || t('resetPassword.genericError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border-2 border-black rounded-lg p-8 shadow-neo relative">
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-neo-violet border-2 border-black rounded-full flex items-center justify-center shadow-sm z-10">
            <Lock className="w-4 h-4 text-white" />
          </div>

          <h2 className="font-display text-3xl font-bold mb-2 text-center">
            {t('resetPassword.title')}
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            {t('resetPassword.subtitle')}
          </p>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1">{t('resetPassword.newPassword')}</label>
              <input 
                type="password" 
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border-2 border-black rounded-md bg-neo-white focus:ring-0 focus:shadow-[2px_2px_0px_0px_#000] transition-all"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">{t('resetPassword.minLengthHint')}</p>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">{t('resetPassword.confirmPassword')}</label>
              <input 
                type="password" 
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border-2 border-black rounded-md bg-neo-white focus:ring-0 focus:shadow-[2px_2px_0px_0px_#000] transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border-2 border-red-100 text-red-600 text-xs font-bold rounded flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" /> {error}
              </div>
            )}
            {message && (
              <div className="p-3 bg-green-50 border-2 border-green-100 text-green-600 text-xs font-bold rounded flex items-center">
                <Check className="w-4 h-4 mr-2 flex-shrink-0" /> {message}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-neo-black text-white font-bold border-2 border-black rounded-md shadow-[3px_3px_0px_0px_#86efac] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-70 disabled:cursor-wait flex justify-center items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {t('resetPassword.submit')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-neo-violet hover:underline font-bold"
            >
              {t('resetPassword.backToLogin')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

