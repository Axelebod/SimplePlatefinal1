import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { removeConsole } from './vite-plugin-remove-console';

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
      publicDir: 'public',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        removeConsole(), // Supprimer console.log en production
      ],
      define,
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: (id) => {
              // Séparer les vendors pour un meilleur cache et réduire la taille
              if (id.includes('node_modules')) {
                if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                  return 'react-vendor';
                }
                if (id.includes('lucide-react') || id.includes('react-markdown')) {
                  return 'ui-vendor';
                }
                if (id.includes('zustand') || id.includes('@supabase')) {
                  return 'store-vendor';
                }
                // Autres vendors dans un chunk séparé
                return 'vendor';
              }
            },
            // Améliorer la stabilité des noms de chunks
            chunkFileNames: 'assets/[name]-[hash].js',
            entryFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]',
          },
        },
        chunkSizeWarningLimit: 1000,
        // Optimisations de build
        minify: 'esbuild',
        cssMinify: true,
        // Réduire la taille des chunks
        target: 'esnext',
        // Désactiver les source maps en production pour réduire la taille
        sourcemap: false,
        // Améliorer la gestion des erreurs de chargement
        commonjsOptions: {
          include: [/node_modules/],
        },
      },
    };
});
