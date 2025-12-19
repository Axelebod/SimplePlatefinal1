import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Check, Image, Link as LinkIcon, X, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { submitProject } from '../services/studioService';
import { uploadProjectImage } from '../services/imageUploadService';
import type { SubmitProjectData, ProjectCategory, ProjectLink } from '../types/studio';
import { useTranslation } from '../hooks/useTranslation';
import { useSEO } from '../hooks/useSEO';
import { useToast } from '../contexts/ToastContext';

export const StudioSubmit: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { t, language } = useTranslation();
  const { success, error: showError, warning } = useToast();
  const [formData, setFormData] = useState<SubmitProjectData>({
    url: '',
    name: '',
    description: '',
    category: 'saas',
    links: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  const [newLink, setNewLink] = useState<{ type: ProjectLink['type']; url: string; label?: string }>({ type: 'other', url: '', label: '' });
  const logoInputRef = useRef<HTMLInputElement>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  useSEO({
    title: language === 'fr' 
      ? 'Soumettre un projet | SimplePlate Studio - Gratuit'
      : 'Submit Project | SimplePlate Studio - Free',
    description: language === 'fr' 
      ? 'Soumettez votre Micro-SaaS gratuitement à la communauté SimplePlate Studio. Ajoutez votre logo, screenshot et liens. Obtenez un audit IA complet pour 50 crédits.'
      : 'Submit your Micro-SaaS for free to SimplePlate Studio community. Add your logo, screenshot and links. Get a complete AI audit for 50 credits.',
    language,
    keywords: language === 'fr'
      ? ['soumettre projet', 'SimplePlate Studio', 'Micro-SaaS', 'audit IA', 'gratuit', 'communauté']
      : ['submit project', 'SimplePlate Studio', 'Micro-SaaS', 'AI audit', 'free', 'community'],
    noindex: true, // Don't index submit page
  });

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const categories: { value: ProjectCategory; label: { fr: string; en: string } }[] = [
    { value: 'saas', label: { fr: 'SaaS', en: 'SaaS' } },
    { value: 'tool', label: { fr: 'Outil', en: 'Tool' } },
    { value: 'app', label: { fr: 'Application', en: 'App' } },
    { value: 'website', label: { fr: 'Site Web', en: 'Website' } },
    { value: 'other', label: { fr: 'Autre', en: 'Other' } },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.url || !formData.name) {
      const errorMsg = language === 'fr' ? 'URL et nom sont requis' : 'URL and name are required';
      setError(errorMsg);
      showError(errorMsg);
      return;
    }

    // Basic URL validation
    try {
      new URL(formData.url);
    } catch {
      const errorMsg = language === 'fr' ? 'URL invalide' : 'Invalid URL';
      setError(errorMsg);
      showError(errorMsg);
      return;
    }

    setSubmitting(true);
    try {
      const project = await submitProject(formData);
      if (project) {
        success(language === 'fr' ? 'Projet soumis avec succès !' : 'Project submitted successfully!');
        setTimeout(() => navigate(`/studio/project/${project.slug || project.id}`), 1000);
      }
    } catch (err: any) {
      console.error('Error submitting project:', err);
      const errorMsg = err.message || (language === 'fr' ? 'Erreur lors de la soumission' : 'Error submitting');
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      const errorMsg = language === 'fr' ? 'Le fichier doit être une image' : 'File must be an image';
      setError(errorMsg);
      showError(errorMsg);
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      const errorMsg = language === 'fr' ? 'L\'image ne doit pas dépasser 5MB' : 'Image must not exceed 5MB';
      setError(errorMsg);
      showError(errorMsg);
      return;
    }

    setUploadingLogo(true);
    setError(null);
    try {
      const imageUrl = await uploadProjectImage(file, 'project-logos');
      setFormData({ ...formData, logo_url: imageUrl });
      success(language === 'fr' ? 'Logo uploadé avec succès !' : 'Logo uploaded successfully!');
    } catch (err: any) {
      const errorMsg = err.message || (language === 'fr' ? 'Erreur lors de l\'upload du logo' : 'Error uploading logo');
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      const errorMsg = language === 'fr' ? 'Le fichier doit être une image' : 'File must be an image';
      setError(errorMsg);
      showError(errorMsg);
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      const errorMsg = language === 'fr' ? 'L\'image ne doit pas dépasser 5MB' : 'Image must not exceed 5MB';
      setError(errorMsg);
      showError(errorMsg);
      return;
    }

    setUploadingScreenshot(true);
    setError(null);
    try {
      const imageUrl = await uploadProjectImage(file, 'project-screenshots');
      setFormData({ ...formData, screenshot_url: imageUrl });
      success(language === 'fr' ? 'Capture d\'écran uploadée avec succès !' : 'Screenshot uploaded successfully!');
    } catch (err: any) {
      const errorMsg = err.message || (language === 'fr' ? 'Erreur lors de l\'upload de la capture' : 'Error uploading screenshot');
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setUploadingScreenshot(false);
    }
  };

  const addLink = () => {
    if (!newLink.url.trim()) {
      warning(language === 'fr' ? 'Veuillez entrer une URL' : 'Please enter a URL');
      return;
    }
    try {
      new URL(newLink.url); // Validate URL
    } catch {
      warning(language === 'fr' ? 'URL invalide' : 'Invalid URL');
      return;
    }
    setFormData({
      ...formData,
      links: [...(formData.links || []), { type: newLink.type, url: newLink.url, label: newLink.label || undefined }],
    });
    setNewLink({ type: 'other', url: '', label: '' });
    success(language === 'fr' ? 'Lien ajouté !' : 'Link added!');
  };

  const removeLink = (index: number) => {
    setFormData({
      ...formData,
      links: formData.links?.filter((_, i) => i !== index) || [],
    });
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Back Button */}
      <Link
        to="/studio"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white mb-6 font-bold"
      >
        <ArrowLeft className="w-4 h-4" />
        {language === 'fr' ? 'Retour au Studio' : 'Back to Studio'}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold dark:text-white mb-4">
          {language === 'fr' ? 'Soumettre un projet' : 'Submit Project'}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {language === 'fr' 
            ? 'Partagez votre Micro-SaaS avec la communauté. C\'est gratuit!'
            : 'Share your Micro-SaaS with the community. It\'s free!'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-600 border-2 border-black dark:border-white rounded-lg p-6 md:p-8 shadow-neo dark:shadow-[2px_2px_0px_0px_#fff]">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-md">
            <p className="text-red-600 dark:text-red-400 font-bold">{error}</p>
          </div>
        )}

        {/* Project Name */}
        <div className="mb-6">
          <label htmlFor="name" className="block font-bold mb-2 dark:text-white">
            {language === 'fr' ? 'Nom du projet *' : 'Project Name *'}
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border-2 border-black dark:border-white rounded-md bg-white dark:bg-gray-500 text-black dark:text-white font-bold"
            required
            placeholder={language === 'fr' ? 'Mon Super SaaS' : 'My Awesome SaaS'}
          />
        </div>

        {/* URL */}
        <div className="mb-6">
          <label htmlFor="url" className="block font-bold mb-2 dark:text-white">
            {language === 'fr' ? 'URL du projet *' : 'Project URL *'}
          </label>
          <input
            type="url"
            id="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full p-3 border-2 border-black dark:border-white rounded-md bg-white dark:bg-gray-500 text-black dark:text-white font-bold"
            required
            placeholder="https://example.com"
          />
        </div>

        {/* Category */}
        <div className="mb-6">
          <label htmlFor="category" className="block font-bold mb-2 dark:text-white">
            {language === 'fr' ? 'Catégorie *' : 'Category *'}
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
            className="w-full p-3 border-2 border-black dark:border-white rounded-md bg-white dark:bg-gray-500 text-black dark:text-white font-bold"
            required
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label[language]}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block font-bold mb-2 dark:text-white">
            {language === 'fr' ? 'Description *' : 'Description *'}
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              ({language === 'fr' ? 'Utilisée dans l\'audit IA' : 'Used in AI audit'})
            </span>
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-3 border-2 border-black dark:border-white rounded-md bg-white dark:bg-gray-500 text-black dark:text-white"
            rows={5}
            required
            placeholder={language === 'fr' 
              ? 'Décrivez votre projet en quelques phrases. Cette description sera analysée par l\'audit IA pour évaluer la clarté, la proposition de valeur et le copywriting...'
              : 'Describe your project in a few sentences. This description will be analyzed by the AI audit to evaluate clarity, value proposition and copywriting...'}
          />
        </div>

        {/* Logo Upload */}
        <div className="mb-6">
          <label className="block font-bold mb-2 dark:text-white">
            {language === 'fr' ? 'Logo du projet' : 'Project Logo'}
          </label>
          <input
            type="file"
            ref={logoInputRef}
            onChange={handleLogoUpload}
            accept="image/*"
            className="hidden"
          />
          <div className="flex items-center gap-4">
            {formData.logo_url ? (
              <div className="flex items-center gap-4">
                <img src={formData.logo_url} alt="Logo" className="w-20 h-20 object-contain border-2 border-black dark:border-white rounded-md" />
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, logo_url: undefined });
                    if (logoInputRef.current) logoInputRef.current.value = '';
                  }}
                  className="px-3 py-1 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                disabled={uploadingLogo}
                className="px-4 py-2 border-2 border-dashed border-black dark:border-white rounded-md bg-gray-50 dark:bg-gray-500 hover:bg-gray-100 dark:hover:bg-gray-400 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Image className="w-5 h-5" />
                {uploadingLogo 
                  ? (language === 'fr' ? 'Upload...' : 'Uploading...')
                  : (language === 'fr' ? 'Ajouter un logo' : 'Add Logo')}
              </button>
            )}
          </div>
        </div>

        {/* Screenshot Upload */}
        <div className="mb-6">
          <label className="block font-bold mb-2 dark:text-white">
            {language === 'fr' ? 'Capture d\'écran du projet' : 'Project Screenshot'}
          </label>
          <input
            type="file"
            ref={screenshotInputRef}
            onChange={handleScreenshotUpload}
            accept="image/*"
            className="hidden"
          />
          <div className="flex items-center gap-4">
            {formData.screenshot_url ? (
              <div className="flex items-center gap-4">
                <img src={formData.screenshot_url} alt="Screenshot" className="w-32 h-20 object-cover border-2 border-black dark:border-white rounded-md" />
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, screenshot_url: undefined });
                    if (screenshotInputRef.current) screenshotInputRef.current.value = '';
                  }}
                  className="px-3 py-1 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => screenshotInputRef.current?.click()}
                disabled={uploadingScreenshot}
                className="px-4 py-2 border-2 border-dashed border-black dark:border-white rounded-md bg-gray-50 dark:bg-gray-500 hover:bg-gray-100 dark:hover:bg-gray-400 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Image className="w-5 h-5" />
                {uploadingScreenshot 
                  ? (language === 'fr' ? 'Upload...' : 'Uploading...')
                  : (language === 'fr' ? 'Ajouter une capture' : 'Add Screenshot')}
              </button>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="mb-6">
          <label className="block font-bold mb-2 dark:text-white">
            {language === 'fr' ? 'Liens sociaux / autres' : 'Social Links / Other'}
          </label>
          <div className="space-y-2">
            {formData.links && formData.links.length > 0 && (
              <div className="space-y-2 mb-2">
                {formData.links.map((link, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-500 border-2 border-black dark:border-white rounded-md">
                    <span className="font-bold text-sm">{link.type}:</span>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-neo-violet hover:underline flex-1 text-sm">
                      {link.label || link.url}
                    </a>
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <select
                value={newLink.type}
                onChange={(e) => setNewLink({ ...newLink, type: e.target.value as ProjectLink['type'] })}
                className="px-3 py-2 border-2 border-black dark:border-white rounded-md bg-white dark:bg-gray-500 text-black dark:text-white font-bold"
              >
                <option value="github">GitHub</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
                <option value="discord">Discord</option>
                <option value="website">Website</option>
                <option value="other">Other</option>
              </select>
              <input
                type="url"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                placeholder={language === 'fr' ? 'URL' : 'URL'}
                className="flex-1 px-3 py-2 border-2 border-black dark:border-white rounded-md bg-white dark:bg-gray-500 text-black dark:text-white"
              />
              <input
                type="text"
                value={newLink.label || ''}
                onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                placeholder={language === 'fr' ? 'Label (optionnel)' : 'Label (optional)'}
                className="px-3 py-2 border-2 border-black dark:border-white rounded-md bg-white dark:bg-gray-500 text-black dark:text-white"
              />
              <button
                type="button"
                onClick={addLink}
                disabled={!newLink.url.trim()}
                className="px-4 py-2 bg-neo-violet text-white font-bold rounded-md hover:bg-neo-violet/90 transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                {language === 'fr' ? 'Ajouter' : 'Add'}
              </button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mb-6 p-4 bg-neo-yellow border-2 border-black rounded-md">
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-bold mb-1">
                {language === 'fr' ? 'C\'est gratuit!' : 'It\'s free!'}
              </p>
              <p className="text-gray-800">
                {language === 'fr' 
                  ? 'La soumission est gratuite. Vous pourrez débloquer l\'audit IA pour 20 crédits plus tard.'
                  : 'Submission is free. You can unlock the AI audit for 20 credits later.'}
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-neo-black dark:bg-white text-white dark:text-black font-bold border-2 border-black dark:border-white rounded-md shadow-neo dark:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Upload className="w-5 h-5 animate-spin" />
              {language === 'fr' ? 'Soumission...' : 'Submitting...'}
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              {language === 'fr' ? 'Soumettre le projet' : 'Submit Project'}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

