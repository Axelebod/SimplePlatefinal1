import type { Plugin } from 'vite';

export function removeConsole(): Plugin {
  return {
    name: 'remove-console',
    enforce: 'post',
    apply: 'build',
    transform(code, id) {
      if (id.includes('node_modules')) {
        return null;
      }
      
      // Supprimer console.log, console.warn, console.error, console.debug en production
      if (process.env.NODE_ENV === 'production') {
        return {
          code: code
            .replace(/console\.(log|warn|error|debug|info)\([^)]*\);?/g, '')
            .replace(/console\.(log|warn|error|debug|info)\([^)]*\)/g, ''),
          map: null,
        };
      }
      return null;
    },
  };
}

