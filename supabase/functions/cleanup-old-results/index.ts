// Edge Function pour nettoyer automatiquement les vieux résultats (appelée via cron ou manuellement)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);

Deno.serve(async (req) => {
  try {
    // Appeler la fonction RPC pour nettoyer les vieux résultats
    const { data, error } = await supabaseAdmin.rpc('cleanup_old_tool_results');

    if (error) {
      console.error('Error cleaning old results:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const deletedCount = data?.[0]?.deleted_count || 0;

    return new Response(
      JSON.stringify({ 
        success: true, 
        deleted_count: deletedCount,
        message: `Nettoyage terminé : ${deletedCount} résultats supprimés`
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

