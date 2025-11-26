
import { ToolCategory } from './types';

export const CATEGORIES: ToolCategory[] = ['Text', 'Image', 'Dev', 'Life', 'Business', 'Security'];

// CONFIGURATION DE PROD
// Remplissez ces variables dans Vercel (Settings > Environment Variables)
export const SITE_CONFIG = {
    gaMeasurementId: process.env.REACT_APP_GA_ID || '', 
    contactEmail: 'contact@simpleplate.dev',
    
    // GOOGLE ADSENSE
    adsense: {
        clientId: process.env.REACT_APP_ADSENSE_CLIENT_ID || '', // Format: ca-pub-XXXXXXXXXX
        slotId: process.env.REACT_APP_ADSENSE_SLOT_ID || '',    // Format: 1234567890
    },
    
    // STRIPE LINKS (À récupérer dans votre Dashboard Stripe > Products)
    stripe: {
        subscription: process.env.REACT_APP_STRIPE_SUB_LINK || 'https://buy.stripe.com/votre_lien_abo_pro',
        customerPortal: process.env.REACT_APP_STRIPE_PORTAL || 'https://billing.stripe.com/p/login/5kQ28r3JR0Jgg7C7KL0Fi00',
        packs: {
            1: process.env.REACT_APP_STRIPE_PACK_1 || 'https://buy.stripe.com/votre_lien_pack_1',
            50: process.env.REACT_APP_STRIPE_PACK_50 || 'https://buy.stripe.com/votre_lien_pack_50',
            100: process.env.REACT_APP_STRIPE_PACK_100 || 'https://buy.stripe.com/votre_lien_pack_100',
            500: process.env.REACT_APP_STRIPE_PACK_500 || 'https://buy.stripe.com/votre_lien_pack_500',
        }
    }
};

export const CATEGORY_COLORS: Record<ToolCategory, string> = {
  Text: 'bg-neo-violet',
  Image: 'bg-fuchsia-300',
  Dev: 'bg-neo-blue',
  Life: 'bg-neo-green',
  Business: 'bg-neo-orange',
  Security: 'bg-neo-red',
};

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  Text: 'Texte',
  Image: 'Image',
  Dev: 'Dév',
  Life: 'Lifestyle',
  Business: 'Business',
  Security: 'Sécurité',
};

export const LOADING_MESSAGES = [
  "Consultation de l'oracle numérique...",
  "Préchauffage du hamster GPU...",
  "Traduction du binaire en génie...",
  "Infusion de café pixelisé...",
  "Calcul de la réponse universelle...",
  "Négociation avec les algorithmes...",
  "Analyse quantique en cours...",
  "Assemblage des nanobots...",
  "Lecture de la matrice...",
];
