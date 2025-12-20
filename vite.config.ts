import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig((env) => {
    const { mode } = env;
    // Vite versions differ on the property name (`ssrBuild` vs `isSsrBuild`)
    const isSSR = Boolean((env as any).ssrBuild ?? (env as any).isSsrBuild);
    const loadedEnv = loadEnv(mode, '.', '');

    const envMappings: Record<string, string | undefined> = {
      'process.env.API_KEY': loadedEnv.GEMINI_API_KEY || loadedEnv.REACT_APP_API_KEY,
      'process.env.GEMINI_API_KEY': loadedEnv.GEMINI_API_KEY || loadedEnv.REACT_APP_API_KEY,
      'process.env.REACT_APP_API_KEY': loadedEnv.REACT_APP_API_KEY || loadedEnv.API_KEY,
      'process.env.REACT_APP_SUPABASE_URL': loadedEnv.REACT_APP_SUPABASE_URL,
      'process.env.REACT_APP_SUPABASE_ANON_KEY': loadedEnv.REACT_APP_SUPABASE_ANON_KEY,
      'process.env.REACT_APP_STRIPE_SUB_LINK': loadedEnv.REACT_APP_STRIPE_SUB_LINK,
      'process.env.REACT_APP_STRIPE_PORTAL': loadedEnv.REACT_APP_STRIPE_PORTAL,
      'process.env.REACT_APP_STRIPE_PACK_1': loadedEnv.REACT_APP_STRIPE_PACK_1,
      'process.env.REACT_APP_STRIPE_PACK_50': loadedEnv.REACT_APP_STRIPE_PACK_50,
      'process.env.REACT_APP_STRIPE_PACK_100': loadedEnv.REACT_APP_STRIPE_PACK_100,
      'process.env.REACT_APP_STRIPE_PACK_500': loadedEnv.REACT_APP_STRIPE_PACK_500,
      'process.env.REACT_APP_STRIPE_PRICE_PACK_1': loadedEnv.REACT_APP_STRIPE_PRICE_PACK_1,
      'process.env.REACT_APP_STRIPE_PRICE_PACK_50': loadedEnv.REACT_APP_STRIPE_PRICE_PACK_50,
      'process.env.REACT_APP_STRIPE_PRICE_PACK_100': loadedEnv.REACT_APP_STRIPE_PRICE_PACK_100,
      'process.env.REACT_APP_STRIPE_PRICE_PACK_500': loadedEnv.REACT_APP_STRIPE_PRICE_PACK_500,
      'process.env.REACT_APP_STRIPE_PRICE_PRO_SUBSCRIPTION': loadedEnv.REACT_APP_STRIPE_PRICE_PRO_SUBSCRIPTION,
      'process.env.REACT_APP_GA_ID': loadedEnv.REACT_APP_GA_ID,
      'process.env.REACT_APP_ADSENSE_CLIENT_ID': loadedEnv.REACT_APP_ADSENSE_CLIENT_ID,
      'process.env.REACT_APP_ADSENSE_SLOT_ID': loadedEnv.REACT_APP_ADSENSE_SLOT_ID,
    };

    const define = Object.fromEntries(
      Object.entries(envMappings).map(([key, value]) => [key, JSON.stringify(value || '')])
    );

    return {
      publicDir: 'public',
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
      },
      build: {
        rollupOptions: {
          output: {
            ...(isSSR
              ? {}
              : {
                  manualChunks: {
                    // Séparer les vendors pour un meilleur cache
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'ui-vendor': ['lucide-react', 'react-markdown'],
                    'store-vendor': ['zustand', '@supabase/supabase-js'],
                  },
                }),
            // Améliorer la stabilité des noms de chunks
            chunkFileNames: 'assets/[name]-[hash].js',
            entryFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]',
          },
        },
        chunkSizeWarningLimit: 1000, // Augmenter la limite pour éviter les warnings
        // Améliorer la gestion des erreurs de chargement
        commonjsOptions: {
          include: [/node_modules/],
        },
      },
    };
});
