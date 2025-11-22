import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    const envMappings: Record<string, string | undefined> = {
      'process.env.API_KEY': env.GEMINI_API_KEY || env.REACT_APP_API_KEY,
      'process.env.GEMINI_API_KEY': env.GEMINI_API_KEY || env.REACT_APP_API_KEY,
      'process.env.REACT_APP_API_KEY': env.REACT_APP_API_KEY || env.API_KEY,
      'process.env.REACT_APP_SUPABASE_URL': env.REACT_APP_SUPABASE_URL,
      'process.env.REACT_APP_SUPABASE_ANON_KEY': env.REACT_APP_SUPABASE_ANON_KEY,
      'process.env.REACT_APP_STRIPE_SUB_LINK': env.REACT_APP_STRIPE_SUB_LINK,
      'process.env.REACT_APP_STRIPE_PORTAL': env.REACT_APP_STRIPE_PORTAL,
      'process.env.REACT_APP_STRIPE_PACK_1': env.REACT_APP_STRIPE_PACK_1,
      'process.env.REACT_APP_STRIPE_PACK_50': env.REACT_APP_STRIPE_PACK_50,
      'process.env.REACT_APP_STRIPE_PACK_100': env.REACT_APP_STRIPE_PACK_100,
      'process.env.REACT_APP_STRIPE_PACK_500': env.REACT_APP_STRIPE_PACK_500,
      'process.env.REACT_APP_STRIPE_PRICE_PACK_1': env.REACT_APP_STRIPE_PRICE_PACK_1,
      'process.env.REACT_APP_STRIPE_PRICE_PACK_50': env.REACT_APP_STRIPE_PRICE_PACK_50,
      'process.env.REACT_APP_STRIPE_PRICE_PACK_100': env.REACT_APP_STRIPE_PRICE_PACK_100,
      'process.env.REACT_APP_STRIPE_PRICE_PACK_500': env.REACT_APP_STRIPE_PRICE_PACK_500,
      'process.env.REACT_APP_STRIPE_PRICE_PRO_SUBSCRIPTION': env.REACT_APP_STRIPE_PRICE_PRO_SUBSCRIPTION,
      'process.env.REACT_APP_GA_ID': env.REACT_APP_GA_ID,
      'process.env.REACT_APP_ADSENSE_CLIENT_ID': env.REACT_APP_ADSENSE_CLIENT_ID,
      'process.env.REACT_APP_ADSENSE_SLOT_ID': env.REACT_APP_ADSENSE_SLOT_ID,
    };

    const define = Object.fromEntries(
      Object.entries(envMappings).map(([key, value]) => [key, JSON.stringify(value || '')])
    );

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define,
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
