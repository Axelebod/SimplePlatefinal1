import { supabase } from '../lib/supabaseClient';

/**
 * Enregistre un clic sur le bouton "Générer" pour les statistiques
 * Ne sauvegarde pas le résultat, juste le compteur
 */
export const incrementGenerationCounter = async (toolId: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Si l'utilisateur n'est pas connecté, on ne compte pas (optionnel : on pourrait compter anonymement)
    if (!user) {
      return;
    }

    // Insérer dans la table generation_counter
    await supabase
      .from('generation_counter')
      .insert({
        tool_id: toolId,
        user_id: user.id,
      });
    
    // Ignorer les erreurs silencieusement (ne pas perturber l'utilisateur)
  } catch (error) {
    console.log('Generation counter error (silent):', error);
  }
};

