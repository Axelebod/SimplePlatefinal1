import { GoogleGenAI } from "@google/genai";
import { handleLocalTool } from './localToolsService';

// Support both standard React env var and generic API_KEY
const API_KEY = process.env.REACT_APP_API_KEY || process.env.API_KEY || ''; 

// Helper to check if we can actually make calls
export const isApiReady = () => !!API_KEY;

// Fonction dédiée au ChatBot (Réponse textuelle rapide sans gestion d'image/local)
export const askBot = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    return "Désolé, je n'ai pas de clé API configurée pour le moment. Je ne peux pas répondre.";
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    });
    return response.text || "Je suis sans voix...";
  } catch (error) {
    console.error("Bot Error:", error);
    return "Une erreur est survenue lors de ma réflexion.";
  }
};

export const generateToolContent = async (
  modelId: 'gemini-2.5-flash' | 'imagen-4.0-generate-001',
  prompt: string,
  isImageOutput: boolean,
  inputImageBase64?: string // Nouvelle option pour envoyer une image À l'IA
): Promise<string> => {
  
  // LOGIQUE LOCALE (Redirection vers JS pur)
  if (prompt.startsWith('LOCAL:')) {
    // On simule un délai réseau pour l'expérience utilisateur (optionnel)
    await new Promise(resolve => setTimeout(resolve, 300));
    return await handleLocalTool(prompt);
  }

  if (!API_KEY) {
    throw new Error("Clé API manquante. Vérifiez votre fichier .env (REACT_APP_API_KEY)");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    // CAS 1 : Génération d'IMAGE (Text -> Image)
    if (isImageOutput) {
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            aspectRatio: '1:1',
            outputMimeType: 'image/jpeg'
        }
      });
      
      const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
      if (!base64ImageBytes) {
        console.error("Image generation response empty:", response);
        throw new Error("L'IA n'a pas pu générer l'image (Filtre de sécurité ou erreur interne).");
      }
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } 
    
    // CAS 2 : Analyse d'IMAGE (Image + Text -> Text)
    else if (inputImageBase64) {
       // On nettoie le base64 (enlever le préfixe data:image/...)
       const cleanBase64 = inputImageBase64.split(',')[1];
       
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              { 
                inlineData: { 
                  mimeType: 'image/jpeg', // On suppose du jpeg/png standard
                  data: cleanBase64 
                } 
              }
            ]
          }
        ]
      });
       return response.text || "Analyse impossible.";
    }

    // CAS 3 : Génération de TEXTE classique (Text -> Text)
    else {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      });

      return response.text || "Aucune réponse générée.";
    }

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Nice error message for user
    if (error.message?.includes("SAFETY")) {
      throw new Error("La requête a été bloquée par le filtre de sécurité (Contenu sensible).");
    }
    throw new Error("Échec de la génération. Veuillez réessayer.");
  }
};