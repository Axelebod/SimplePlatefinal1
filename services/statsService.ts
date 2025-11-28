import { supabase } from '../lib/supabaseClient';

export interface SiteStats {
  generations: number;
  users: number;
  tools: number;
}

/**
 * Récupère les statistiques réelles du site depuis Supabase
 * Utilise une fonction RPC publique pour contourner RLS
 */
export const getSiteStats = async (): Promise<SiteStats> => {
  try {
    // Appeler la fonction RPC publique get_site_stats
    const { data, error } = await supabase.rpc('get_site_stats');

    if (error) {
      console.error('Error fetching site stats:', error);
      // Fallback : essayer de compter directement (peut échouer si RLS bloque)
      return await getSiteStatsFallback();
    }

    return {
      generations: data?.generations || 0,
      users: data?.users || 0,
      tools: 50, // Nombre réel d'outils
    };
  } catch (error) {
    console.error('Error fetching site stats:', error);
    return await getSiteStatsFallback();
  }
};

/**
 * Fallback si la fonction RPC n'existe pas encore
 */
const getSiteStatsFallback = async (): Promise<SiteStats> => {
  try {
    // Essayer de compter directement (peut échouer si RLS bloque)
    const [generationsResult, usersResult] = await Promise.all([
      supabase.from('tool_results').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
    ]);

    return {
      generations: generationsResult.count || 0,
      users: usersResult.count || 0,
      tools: 50,
    };
  } catch (error) {
    console.error('Fallback stats error:', error);
    return {
      generations: 0,
      users: 0,
      tools: 50,
    };
  }
};

