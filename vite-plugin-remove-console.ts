import type { Plugin } from 'vite';

export function removeConsole(): Plugin {
  return {
    name: 'remove-console',
    enforce: 'post',
    apply: 'build',
    transform(code, id) {
      // Ignorer les fichiers node_modules et les fichiers de configuration
      if (id.includes('node_modules') || id.includes('vite.config') || id.includes('.config.')) {
        return null;
      }
      
      // Supprimer console.log, console.warn, console.error, console.debug en production
      // Utiliser une regex plus robuste pour gérer les cas complexes
      const cleanedCode = code
        .replace(/console\.(log|warn|error|debug|info|table|group|groupEnd|time|timeEnd)\([^)]*\);?\n?/g, '')
        .replace(/console\.(log|warn|error|debug|info|table|group|groupEnd|time|timeEnd)\([^)]*\)/g, '');
      
      if (cleanedCode !== code) {
        return {
          code: cleanedCode,
          map: null,
        };
      }
      
      return null;
    },
  };
}

