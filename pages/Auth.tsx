
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useUserStore } from '../store/userStore';
import { Loader2, AlertTriangle, Check, Mail } from 'lucide-react';

export const Auth: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useUserStore();
  
  const isSignupInitial = location.pathname.includes('signup');
  const [isSignup, setIsSignup] = useState(isSignupInitial);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);


  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage("Email de confirmation envoyé ! Vérifiez votre boîte mail pour activer le compte.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        if (data.user && data.user.email) {
            // Connexion réussie
            login({ id: data.user.id, email: data.user.email });
            navigate('/');
        }
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };


  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Veuillez entrer votre adresse email.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#/reset-password`,
      });

      if (error) throw error;
      setMessage("Un email de réinitialisation a été envoyé ! Vérifiez votre boîte mail.");
      setShowForgotPassword(false);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'envoi de l'email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        
        {/* TABS */}
        <div className="flex mb-6 border-2 border-black rounded-lg overflow-hidden shadow-neo-sm bg-white">
          <button
            onClick={() => { setIsSignup(false); setError(null); setMessage(null); }}
            className={`flex-1 py-3 font-bold text-sm uppercase tracking-wider transition-colors ${!isSignup ? 'bg-neo-black text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            Connexion
          </button>
          <button
            onClick={() => { setIsSignup(true); setError(null); setMessage(null); }}
            className={`flex-1 py-3 font-bold text-sm uppercase tracking-wider transition-colors ${isSignup ? 'bg-neo-yellow text-black border-l-2 border-black' : 'bg-white text-gray-500 hover:bg-gray-50 border-l-2 border-gray-200'}`}
          >
            Inscription
          </button>
        </div>

        {/* CARD */}
        <div className="bg-white border-2 border-black rounded-lg p-8 shadow-neo relative">
           <div className="absolute -top-3 -right-3 w-8 h-8 bg-neo-violet border-2 border-black rounded-full flex items-center justify-center shadow-sm z-10">
               <span className="font-bold text-lg">!</span>
           </div>

           <h2 className="font-display text-3xl font-bold mb-2 text-center">
             {isSignup ? "Rejoignez le club." : "Bon retour."}
           </h2>
           <p className="text-center text-gray-500 mb-8 text-sm">
             {isSignup ? "Créez un compte pour sauvegarder vos crédits." : "Connectez-vous pour accéder à vos outils."}
           </p>

           {showForgotPassword ? (
             <form onSubmit={handleForgotPassword} className="space-y-4">
               <div className="mb-4">
                 <p className="text-sm text-gray-600 mb-4">
                   Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                 </p>
               </div>
               <div>
                 <label className="block text-sm font-bold mb-1">Email</label>
                 <input 
                   type="email" 
                   required
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="w-full p-3 border-2 border-black rounded-md bg-neo-white focus:ring-0 focus:shadow-[2px_2px_0px_0px_#000] transition-all"
                   placeholder="votre@email.com"
                 />
               </div>

               {error && (
                 <div className="p-3 bg-red-50 border-2 border-red-100 text-red-600 text-xs font-bold rounded flex items-center">
                   <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" /> {error}
                 </div>
               )}
               {message && (
                 <div className="p-3 bg-green-50 border-2 border-green-100 text-green-600 text-xs font-bold rounded flex items-center">
                   <Mail className="w-4 h-4 mr-2 flex-shrink-0" /> {message}
                 </div>
               )}

               <div className="flex gap-3">
                 <button 
                   type="button"
                   onClick={() => { setShowForgotPassword(false); setError(null); setMessage(null); }}
                   className="flex-1 py-3 bg-gray-100 text-black font-bold border-2 border-black rounded-md hover:bg-gray-200 transition-all"
                 >
                   Annuler
                 </button>
                 <button 
                   type="submit" 
                   disabled={loading}
                   className="flex-1 py-3 bg-neo-black text-white font-bold border-2 border-black rounded-md shadow-[3px_3px_0px_0px_#86efac] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-70 disabled:cursor-wait flex justify-center items-center gap-2"
                 >
                   {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                   Envoyer
                 </button>
               </div>
             </form>
           ) : (
           <form onSubmit={handleAuth} className="space-y-4">
             <div>
               <label className="block text-sm font-bold mb-1">Email</label>
               <input 
                 type="email" 
                 required
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full p-3 border-2 border-black rounded-md bg-neo-white focus:ring-0 focus:shadow-[2px_2px_0px_0px_#000] transition-all"
                 placeholder="votre@email.com"
               />
             </div>
             <div>
               <div className="flex justify-between items-center mb-1">
                 <label className="block text-sm font-bold">Mot de passe</label>
                 {!isSignup && (
                   <button
                     type="button"
                     onClick={() => setShowForgotPassword(true)}
                     className="text-xs text-neo-violet hover:underline font-bold"
                   >
                     Mot de passe oublié ?
                   </button>
                 )}
               </div>
               <input 
                 type="password" 
                 required={!showForgotPassword}
                 minLength={6}
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 disabled={showForgotPassword}
                 className="w-full p-3 border-2 border-black rounded-md bg-neo-white focus:ring-0 focus:shadow-[2px_2px_0px_0px_#000] transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
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
               {isSignup ? "Créer mon compte" : "Se connecter"}
             </button>
           </form>
           )}

        </div>
        
        <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
                En continuant, vous acceptez nos <a href="#/legal" className="underline font-bold text-black">CGU</a>.
            </p>
        </div>

      </div>
    </div>
  );
};
