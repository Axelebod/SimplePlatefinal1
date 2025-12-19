import { supabase } from '../lib/supabaseClient';

/**
 * Upload an image to Supabase Storage
 * @param file - The file to upload
 * @param folder - The folder in storage (e.g., 'project-logos', 'project-screenshots')
 * @returns The public URL of the uploaded image
 */
export async function uploadProjectImage(
  file: File,
  folder: 'project-logos' | 'project-screenshots'
): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User must be authenticated');

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  // Upload file
  const { data, error } = await supabase.storage
    .from('project-assets')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading image:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('project-assets')
    .getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteProjectImage(imageUrl: string): Promise<void> {
  // Extract path from URL
  const urlParts = imageUrl.split('/project-assets/');
  if (urlParts.length < 2) return;

  const filePath = urlParts[1].split('?')[0];

  const { error } = await supabase.storage
    .from('project-assets')
    .remove([filePath]);

  if (error) {
    console.error('Error deleting image:', error);
    // Don't throw, just log - deletion is not critical
  }
}

