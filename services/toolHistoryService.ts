import { supabase } from '../lib/supabaseClient';
import { ToolResult, ToolTemplate, ToolStats, ExportOptions } from '../types/toolHistory';

// ============================================
// HISTORIQUE DES RÉSULTATS
// ============================================

export const saveToolResult = async (
  toolId: string,
  inputs: Record<string, any>,
  output: string,
  outputType: 'text' | 'image',
  creditsUsed: number,
  metadata?: Record<string, any>,
  isPro: boolean = false
): Promise<{ success: boolean; result?: ToolResult; message?: string }> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: 'Vous devez être connecté pour sauvegarder.' };
  }

  // Vérifier la limite avant de sauvegarder
  const maxResults = isPro ? 20 : 5;
  
  const { count, error: countError } = await supabase
    .from('tool_results')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('tool_id', toolId);

  if (countError) {
    console.error('Error counting results:', countError);
    return { success: false, message: 'Erreur lors de la vérification des limites.' };
  }

  if (count && count >= maxResults) {
    return { 
      success: false, 
      message: isPro 
        ? `Limite atteinte : vous avez déjà ${maxResults} résultats sauvegardés pour cet outil. Supprimez-en un pour en sauvegarder un nouveau.`
        : `Limite atteinte : vous avez déjà ${maxResults} résultats sauvegardés (gratuit). Passez PRO pour avoir 20 résultats.`
    };
  }

  const { data, error } = await supabase
    .from('tool_results')
    .insert({
      user_id: user.id,
      tool_id: toolId,
      inputs,
      output,
      output_type: outputType,
      credits_used: creditsUsed,
      metadata: metadata || {}
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving tool result:', error);
    return { success: false, message: 'Erreur lors de la sauvegarde.' };
  }

  return { success: true, result: data };
};

export const getToolHistory = async (
  toolId: string,
  limit: number = 20
): Promise<ToolResult[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('tool_results')
    .select('*')
    .eq('user_id', user.id)
    .eq('tool_id', toolId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching tool history:', error);
    return [];
  }

  return data || [];
};

export const deleteToolResult = async (resultId: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('tool_results')
    .delete()
    .eq('id', resultId)
    .eq('user_id', user.id);

  return !error;
};

export const toggleFavorite = async (resultId: string, isFavorite: boolean, isPro: boolean = false): Promise<{ success: boolean; message?: string }> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'Non connecté' };

  // Si on essaie d'ajouter aux favoris, vérifier la limite
  if (isFavorite) {
    const maxFavorites = isPro ? 20 : 4;
    
    // Compter les favoris actuels
    const { count } = await supabase
      .from('tool_results')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_favorite', true);

    if (count && count >= maxFavorites) {
      return { 
        success: false, 
        message: isPro 
          ? `Limite atteinte : vous avez déjà ${maxFavorites} favoris. Supprimez-en un pour en ajouter un nouveau.`
          : `Limite atteinte : vous avez déjà ${maxFavorites} favoris (gratuit). Passez PRO pour avoir 20 favoris.`
      };
    }
  }

  const { error } = await supabase
    .from('tool_results')
    .update({ is_favorite: isFavorite })
    .eq('id', resultId)
    .eq('user_id', user.id);

  return { success: !error };
};

// ============================================
// TEMPLATES / PRÉSETS
// ============================================

export const saveTemplate = async (
  toolId: string,
  name: string,
  inputs: Record<string, any>,
  description?: string,
  isPublic: boolean = false
): Promise<ToolTemplate | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('tool_templates')
    .insert({
      user_id: user.id,
      tool_id: toolId,
      name,
      description,
      inputs,
      is_public: isPublic,
      usage_count: 0
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving template:', error);
    return null;
  }

  return data;
};

export const getTemplates = async (
  toolId: string,
  includePublic: boolean = true
): Promise<ToolTemplate[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from('tool_templates')
    .select('*')
    .eq('tool_id', toolId)
    .order('usage_count', { ascending: false });

  if (includePublic) {
    query = query.or(`user_id.eq.${user.id},is_public.eq.true`);
  } else {
    query = query.eq('user_id', user.id);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching templates:', error);
    return [];
  }

  return data || [];
};

export const useTemplate = async (templateId: string): Promise<boolean> => {
  const { error } = await supabase.rpc('increment_template_usage', {
    p_template_id: templateId
  });

  return !error;
};

// ============================================
// STATISTIQUES
// ============================================

export const getToolStats = async (toolId: string): Promise<ToolStats | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.rpc('get_tool_stats', {
    p_user_id: user.id,
    p_tool_id: toolId
  });

  if (error) {
    console.error('Error fetching tool stats:', error);
    return null;
  }

  return data;
};

export const getRecentActivity = async (limit: number = 5): Promise<ToolResult[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('tool_results')
    .select('id, tool_id, created_at, credits_used, metadata')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }

  return data || [];
};

// ============================================
// EXPORT
// ============================================

export const exportResult = (
  result: ToolResult,
  options: ExportOptions
): void => {
  const { format, includeInputs = true, includeMetadata = false, filename } = options;
  
  let content = '';
  let mimeType = '';
  let extension = '';

  switch (format) {
    case 'json':
      content = JSON.stringify({
        tool_id: result.tool_id,
        created_at: result.created_at,
        ...(includeInputs && { inputs: result.inputs }),
        output: result.output,
        ...(includeMetadata && { metadata: result.metadata })
      }, null, 2);
      mimeType = 'application/json';
      extension = 'json';
      break;

    case 'txt':
      content = result.output;
      mimeType = 'text/plain';
      extension = 'txt';
      break;

    case 'markdown':
      content = `# Résultat - ${result.tool_id}\n\n` +
        `**Date:** ${new Date(result.created_at).toLocaleString('fr-FR')}\n\n` +
        (includeInputs ? `**Inputs:**\n\`\`\`json\n${JSON.stringify(result.inputs, null, 2)}\n\`\`\`\n\n` : '') +
        `**Résultat:**\n\n${result.output}`;
      mimeType = 'text/markdown';
      extension = 'md';
      break;

    case 'csv':
      // Pour CSV, on crée une ligne avec les infos principales
      content = `Date,Output\n"${new Date(result.created_at).toISOString()}","${result.output.replace(/"/g, '""')}"`;
      mimeType = 'text/csv';
      extension = 'csv';
      break;

    case 'pdf':
      // Export PDF (fallback vers HTML pour l'instant)
      exportToPDF(result, includeInputs, includeMetadata, filename);
      return;
  }

  // Télécharger le fichier
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `result-${result.tool_id}-${Date.now()}.${extension}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const exportToPDF = async (
  result: ToolResult,
  includeInputs: boolean,
  includeMetadata: boolean,
  filename?: string
) => {
  try {
    // Importer jsPDF dynamiquement
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    let y = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    
    // Titre
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Résultat - ${result.tool_id}`, margin, y);
    y += 10;
    
    // Date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${new Date(result.created_at).toLocaleString('fr-FR')}`, margin, y);
    y += 10;
    
    // Inputs si demandé
    if (includeInputs) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Inputs:', margin, y);
      y += 7;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const inputsText = JSON.stringify(result.inputs, null, 2);
      const splitInputs = doc.splitTextToSize(inputsText, maxWidth);
      doc.text(splitInputs, margin, y);
      y += splitInputs.length * 4 + 5;
    }
    
    // Résultat
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Résultat:', margin, y);
    y += 7;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Nettoyer le HTML si présent pour le texte
    const cleanOutput = result.output.replace(/<[^>]*>/g, '').replace(/```[\s\S]*?```/g, '');
    const outputText = doc.splitTextToSize(cleanOutput, maxWidth);
    
    // Gérer le débordement de page
    outputText.forEach((line: string) => {
      if (y > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += 5;
    });
    
    doc.save(filename || `result-${result.tool_id}-${Date.now()}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    // Fallback vers HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Résultat - ${result.tool_id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            pre { background: #f5f5f5; padding: 10px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <h1>Résultat - ${result.tool_id}</h1>
          <p><strong>Date:</strong> ${new Date(result.created_at).toLocaleString('fr-FR')}</p>
          ${includeInputs ? `<h2>Inputs:</h2><pre>${JSON.stringify(result.inputs, null, 2)}</pre>` : ''}
          <h2>Résultat:</h2>
          <pre>${result.output}</pre>
        </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (filename || `result-${result.tool_id}-${Date.now()}`).replace('.pdf', '.html');
    a.click();
    URL.revokeObjectURL(url);
  }
};

