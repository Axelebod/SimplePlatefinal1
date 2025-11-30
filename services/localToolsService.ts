export const handleLocalTool = async (command: string): Promise<string> => {
  // Parsing de la commande : LOCAL:ACTION|PARAM1|PARAM2...
  const [action, ...params] = command.replace('LOCAL:', '').split(';;;');
  const input = params[0];

  switch (action) {
    // --- EXISTING TOOLS ---
    case 'PASSWORD_GEN':
      const length = parseInt(input) || 12;
      const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
      let retVal = "";
      for (let i = 0, n = charset.length; i < length; ++i) {
          retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      return Promise.resolve(`### Mot de passe généré :\n\n\`${retVal}\`\n\n*Copiez-le et gardez-le en lieu sûr.*`);

    case 'JSON_FORMAT':
      try {
        const obj = JSON.parse(input);
        return Promise.resolve(`\`\`\`json\n${JSON.stringify(obj, null, 2)}\n\`\`\``);
      } catch (e) {
        return Promise.resolve("❌ **Erreur JSON** : Le format est invalide.\nVérifiez les virgules et les guillemets.");
      }

    case 'UUID_GEN':
      // Fonction de génération UUID v4 compatible avec tous les navigateurs
      const generateUUID = (): string => {
        // Utiliser crypto.randomUUID si disponible (navigateurs modernes)
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
          return crypto.randomUUID();
        }
        // Fallback pour les navigateurs plus anciens
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };
      const uuid = generateUUID();
      return Promise.resolve(`### UUID v4 :\n\n\`${uuid}\``);

    case 'CASE_CONVERT':
      return Promise.resolve(`**Majuscules :**\n${input.toUpperCase()}\n\n**Minuscules :**\n${input.toLowerCase()}\n\n**Capitalisé :**\n${input.replace(/\b\w/g, l => l.toUpperCase())}`);

    case 'LOREM_GEN':
        return Promise.resolve("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.");

    case 'TEXT_STATS':
        const words = input.trim().split(/\s+/).length;
        const chars = input.length;
        const readTime = Math.ceil(words / 200);
        return Promise.resolve(`### Statistiques :\n\n- **Mots :** ${words}\n- **Caractères :** ${chars}\n- **Temps de lecture :** ~${readTime} min`);

    case 'DECISION_MAKER':
        const choices = input.split(',').map(s => s.trim()).filter(s => s);
        if (choices.length < 2) return Promise.resolve("❌ Il faut au moins 2 choix séparés par des virgules.");
        // Retourner les choix en JSON pour la roue
        return Promise.resolve(JSON.stringify({ choices, type: 'wheel' }));

    case 'SLUG_GEN':
        const slug = input.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
        return Promise.resolve(`### Slug URL optimisé :\n\n\`${slug}\``);

    case 'PX_TO_REM_EMPTY': {
        const baseSize = parseFloat(params[0] || '16') || 16;
        return Promise.resolve(`### Conversions (Base: ${baseSize}px)\n\n| Original | Pixels | REM | EM |\n|---------|--------|-----|-----|\n\n*Utilisez l'interface graphique ci-dessous pour ajouter des conversions.*`);
    }
    
    case 'PX_TO_REM': {
        const [valuesInput, baseSizeInput, showTableInput] = params;
        const baseSize = parseFloat(baseSizeInput || '16') || 16;
        const showTable = showTableInput === 'true' || showTableInput === 'Oui';
        
        if (!valuesInput || !valuesInput.trim()) {
            return Promise.resolve("❌ Entrez au moins une valeur à convertir.");
        }
        
        // Parser les valeurs (séparées par virgules, lignes, ou espaces)
        const values = valuesInput
            .split(/[,\n\r]+/)
            .map(v => v.trim())
            .filter(v => v.length > 0);
        
        if (values.length === 0) {
            return Promise.resolve("❌ Aucune valeur valide trouvée.");
        }
        
        let result = `### Conversions (Base: ${baseSize}px)\n\n`;
        const conversions: Array<{ original: string; px: number; rem: number; em: number }> = [];
        
        // Traiter chaque valeur
        for (const value of values) {
            const pxMatch = value.match(/^([\d.]+)\s*px$/i);
            const remMatch = value.match(/^([\d.]+)\s*rem$/i);
            const emMatch = value.match(/^([\d.]+)\s*em$/i);
            const numMatch = value.match(/^([\d.]+)$/);
            
            let px: number;
            let rem: number;
            let em: number;
            let original = value;
            
            if (pxMatch) {
                // Conversion px → rem
                px = parseFloat(pxMatch[1]);
                rem = px / baseSize;
                em = rem; // em = rem si parent = root
                original = `${px}px`;
            } else if (remMatch) {
                // Conversion rem → px
                rem = parseFloat(remMatch[1]);
                px = rem * baseSize;
                em = rem;
                original = `${rem}rem`;
            } else if (emMatch) {
                // Conversion em → px (en supposant parent = root)
                em = parseFloat(emMatch[1]);
                rem = em;
                px = em * baseSize;
                original = `${em}em`;
            } else if (numMatch) {
                // Nombre seul → on assume px
                px = parseFloat(numMatch[1]);
                rem = px / baseSize;
                em = rem;
                original = `${px}px`;
            } else {
                continue; // Ignorer les valeurs invalides
            }
            
            if (isNaN(px) || isNaN(rem)) continue;
            
            conversions.push({ original, px, rem, em });
        }
        
        if (conversions.length === 0) {
            return Promise.resolve("❌ Aucune valeur valide trouvée. Format attendu : 16px, 1rem, 24px, etc.");
        }
        
        // Afficher les conversions
        result += '| Original | Pixels | REM | EM |\n';
        result += '|---------|--------|-----|-----|\n';
        
        for (const conv of conversions) {
            const pxRounded = Math.round(conv.px * 100) / 100;
            const remRounded = Math.round(conv.rem * 1000) / 1000;
            const emRounded = Math.round(conv.em * 1000) / 1000;
            result += `| \`${conv.original}\` | \`${pxRounded}px\` | \`${remRounded}rem\` | \`${emRounded}em\` |\n`;
        }
        
        // Code CSS prêt à copier
        result += '\n### Code CSS prêt à copier :\n\n```css\n';
        for (const conv of conversions) {
            const remRounded = Math.round(conv.rem * 1000) / 1000;
            result += `font-size: ${remRounded}rem; /* ${conv.px}px */\n`;
        }
        result += '```\n';
        
        // Tableau de références courantes
        if (showTable) {
            result += '\n### 📊 Tableau de références courantes :\n\n';
            result += '| Pixels | REM (base 16px) | Usage courant |\n';
            result += '|--------|-----------------|---------------|\n';
            
            const commonSizes = [
                { px: 8, usage: 'Très petit (spacing)' },
                { px: 10, usage: 'Petit texte' },
                { px: 12, usage: 'Texte secondaire' },
                { px: 14, usage: 'Texte standard mobile' },
                { px: 16, usage: 'Texte de base (root)' },
                { px: 18, usage: 'Texte légèrement plus grand' },
                { px: 20, usage: 'Sous-titres' },
                { px: 24, usage: 'Titres H4' },
                { px: 32, usage: 'Titres H3' },
                { px: 40, usage: 'Titres H2' },
                { px: 48, usage: 'Titres H1' },
                { px: 64, usage: 'Titres hero' },
            ];
            
            for (const size of commonSizes) {
                const rem = Math.round((size.px / baseSize) * 1000) / 1000;
                result += `| \`${size.px}px\` | \`${rem}rem\` | ${size.usage} |\n`;
            }
        }
        
        result += `\n*💡 Astuce : La taille de base par défaut est 16px. Vous pouvez la modifier dans les paramètres.*`;
        
        return Promise.resolve(result);
    }

    case 'BASE64':
        try {
            const encoded = btoa(input);
            // Tentative de decode pour voir si c'était du base64
            let decoded = "";
            let isAlreadyBase64 = false;
            try {
                decoded = atob(input);
                isAlreadyBase64 = true;
            } catch(e) { isAlreadyBase64 = false; }

            return Promise.resolve(`### Résultat :\n\n**Encodé (Base64) :**\n\`${encoded}\`\n\n${isAlreadyBase64 ? `**Décodé (Depuis Base64) :**\n\`${decoded}\`` : ''}`);
        } catch (e) {
            return Promise.resolve("Erreur de conversion.");
        }

    case 'ROI_CALC':
        const argsROI = command.replace('LOCAL:ROI_CALC;;;', '').split(';;;');
        const invest = parseFloat(argsROI[0]);
        const gain = parseFloat(argsROI[1]);
        
        if (isNaN(invest) || isNaN(gain)) return Promise.resolve("❌ Valeurs invalides.");
        
        const roi = ((gain - invest) / invest) * 100;
        const benef = gain - invest;
        
        return Promise.resolve(`### Résultat Financier 💰\n\n- **Bénéfice net :** ${benef} €\n- **ROI :** \`${roi.toFixed(2)}%\`\n\n${roi > 0 ? "✅ C'est rentable !" : "⚠️ Perte d'argent."}`);

    case 'FREELANCE_CALC':
        const tjm = parseFloat(input);
        if (isNaN(tjm)) return Promise.resolve("❌ TJM invalide.");
        const brut = tjm * 20;
        const netEstime = brut * 0.75; 
        return Promise.resolve(`### Estimation Mensuelle (Solo) 👨‍💻\n\nSur une base de 20 jours travaillés :\n\n- **Chiffre d'affaires :** ${brut} €\n- **Net estimé (après charges ~25%) :** \`${netEstime} €\`\n\n*Ceci est une estimation brute pour auto-entrepreneur.*`);

    // --- NEW NON-AI TOOLS ---

    case 'CSV_JSON':
        try {
            const lines = input.trim().split('\n');
            if (lines.length < 2) return Promise.resolve("❌ Il faut au moins une ligne d'en-tête et une ligne de données.");
            
            const headers = lines[0].split(',').map(h => h.trim());
            const result = lines.slice(1).map(line => {
                const data = line.split(',').map(d => d.trim());
                return headers.reduce((obj: any, nextKey, index) => {
                    obj[nextKey] = data[index];
                    return obj;
                }, {});
            });
            return Promise.resolve(`\`\`\`json\n${JSON.stringify(result, null, 2)}\n\`\`\``);
        } catch (e) {
            return Promise.resolve("❌ Format CSV invalide. Assurez-vous d'utiliser des virgules.");
        }

    case 'HEX_RGB':
        // Détecter si c'est un code Hex ou RGB
        const hexMatch = input.match(/^#?([0-9A-Fa-f]{6})$/);
        const rgbMatch = input.match(/rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)/i);
        
        if (hexMatch) {
            // Conversion Hex -> RGB
            const hex = hexMatch[1];
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return Promise.resolve(`HEX: #${hex.toUpperCase()}\nRGB: rgb(${r}, ${g}, ${b})`);
        } else if (rgbMatch) {
            // Conversion RGB -> Hex
            const r = parseInt(rgbMatch[1]);
            const g = parseInt(rgbMatch[2]);
            const b = parseInt(rgbMatch[3]);
            if (r > 255 || g > 255 || b > 255 || r < 0 || g < 0 || b < 0) {
                return Promise.resolve("❌ Valeurs RGB invalides (doivent être entre 0 et 255)");
            }
            const hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
            return Promise.resolve(`HEX: #${hex}\nRGB: rgb(${r}, ${g}, ${b})`);
        } else {
            return Promise.resolve("❌ Format invalide. Utilisez un code Hex (ex: #FF0000) ou RGB (ex: rgb(255, 0, 0))");
        }

    case 'MORSE_ENCODE':
        const morseCode: Record<string, string> = {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
            'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
            'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
            'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
            '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': ' / '
        };
        return Promise.resolve(`### Traduction Morse 📡\n\n\`${input.toUpperCase().split('').map(c => morseCode[c] || c).join(' ')}\``);

    case 'PERCENT_CALC':
        const argsPercent = command.replace('LOCAL:PERCENT_CALC;;;', '').split(';;;');
        const val = parseFloat(argsPercent[0]);
        const total = parseFloat(argsPercent[1]);
        if(isNaN(val) || isNaN(total)) return Promise.resolve("❌ Valeurs invalides");
        const res = (val / 100) * total;
        return Promise.resolve(`### Résultat 📊\n\n**${val}%** de **${total}** = **${res}**`);

    case 'META_TAGS':
        const argsMeta = command.replace('LOCAL:META_TAGS;;;', '').split(';;;');
        const title = argsMeta[0];
        const desc = argsMeta[1];
        const author = argsMeta[2];
        return Promise.resolve(`\`\`\`html
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="author" content="${author}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta name="twitter:card" content="summary_large_image">
\`\`\``);

    case 'QR_CODE':
        // Utilisation de l'API QR code en ligne (api.qrserver.com - gratuit, pas de clé API requise)
        try {
            const encodedInput = encodeURIComponent(input);
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedInput}`;
            
            // Retourner directement l'URL du QR code (ToolPage.tsx a un affichage spécialisé)
            return Promise.resolve(qrUrl);
        } catch (error) {
            console.error('QR Code service error:', error);
            return Promise.resolve(`❌ **Erreur lors de la génération** : ${error instanceof Error ? error.message : 'Erreur inconnue'}\n\n**Solution** : Vérifiez votre connexion Internet et réessayez.`);
        }
    
    default:
      return Promise.resolve("Commande locale inconnue.");
  }
};