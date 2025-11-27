import React, { useState, useEffect } from 'react';
import { FileText, Plus, Star, Trash2, Copy } from 'lucide-react';
import { ToolTemplate } from '../types/toolHistory';
import { getTemplates, saveTemplate, useTemplate } from '../services/toolHistoryService';
import { useUserStore } from '../store/userStore';

interface ToolTemplatesProps {
  toolId: string;
  currentInputs: Record<string, any>;
  onLoadTemplate: (inputs: Record<string, any>) => void;
}

export const ToolTemplates: React.FC<ToolTemplatesProps> = ({ toolId, currentInputs, onLoadTemplate }) => {
  const { user } = useUserStore();
  const [templates, setTemplates] = useState<ToolTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

  useEffect(() => {
    if (user) {
      loadTemplates();
    }
  }, [toolId, user]);

  const loadTemplates = async () => {
    setLoading(true);
    const results = await getTemplates(toolId, true);
    setTemplates(results);
    setLoading(false);
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      alert('Veuillez donner un nom au template');
      return;
    }

    const template = await saveTemplate(
      toolId,
      templateName,
      currentInputs,
      templateDescription || undefined,
      false
    );

    if (template) {
      setTemplates([template, ...templates]);
      setShowSaveForm(false);
      setTemplateName('');
      setTemplateDescription('');
    }
  };

  const handleUseTemplate = async (template: ToolTemplate) => {
    await useTemplate(template.id);
    onLoadTemplate(template.inputs);
    setShowSaveForm(false);
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-lg p-6">
        <p className="text-gray-500 dark:text-gray-400">Chargement des templates...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-lg flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Templates ({templates.length})
        </h3>
        <button
          onClick={() => setShowSaveForm(!showSaveForm)}
          className="px-3 py-1.5 bg-neo-blue text-white rounded-md text-sm font-bold hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Sauvegarder
        </button>
      </div>

      {showSaveForm && (
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-600">
          <input
            type="text"
            placeholder="Nom du template (ex: Email marketing B2B)"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="w-full p-2 border-2 border-gray-300 dark:border-gray-600 rounded-md mb-2 bg-white dark:bg-gray-800 dark:text-white"
          />
          <textarea
            placeholder="Description (optionnel)"
            value={templateDescription}
            onChange={(e) => setTemplateDescription(e.target.value)}
            className="w-full p-2 border-2 border-gray-300 dark:border-gray-600 rounded-md mb-2 bg-white dark:bg-gray-800 dark:text-white"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveTemplate}
              className="px-4 py-2 bg-neo-green text-black rounded-md font-bold hover:bg-green-400 transition-colors"
            >
              Enregistrer
            </button>
            <button
              onClick={() => {
                setShowSaveForm(false);
                setTemplateName('');
                setTemplateDescription('');
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {templates.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Aucun template sauvegardé. Créez-en un pour réutiliser rapidement vos configurations.
        </p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {templates.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-sm">{template.name}</h4>
                  {template.is_public && (
                    <span className="text-xs bg-neo-yellow text-black px-2 py-0.5 rounded">Public</span>
                  )}
                  {template.usage_count > 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {template.usage_count} utilisation{template.usage_count > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                {template.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{template.description}</p>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {new Date(template.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <button
                onClick={() => handleUseTemplate(template)}
                className="px-3 py-1.5 bg-neo-violet text-black rounded-md text-sm font-bold hover:bg-purple-300 transition-colors"
              >
                Utiliser
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

