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
      const uuid = crypto.randomUUID();
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
        const winner = choices[Math.floor(Math.random() * choices.length)];
        return Promise.resolve(`### 🎲 Le sort a décidé :\n\n# **${winner}**`);

    case 'SLUG_GEN':
        const slug = input.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
        return Promise.resolve(`### Slug URL optimisé :\n\n\`${slug}\``);

    case 'PX_TO_REM':
        const px = parseFloat(input);
        if (isNaN(px)) return Promise.resolve("❌ Entrez un nombre valide.");
        const rem = px / 16;
        return Promise.resolve(`### Conversion :\n\n**${px}px** = \`${rem}rem\`\n\n*(Basé sur une racine de 16px)*`);

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
        const hex = input.replace('#', '');
        if (hex.length !== 6) return Promise.resolve("❌ Code Hex invalide (doit être 6 caractères, ex: FFFFFF)");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return Promise.resolve(`### Conversion Couleur 🎨\n\n**HEX :** #${hex.toUpperCase()}\n**RGB :** rgb(${r}, ${g}, ${b})\n\n<div style="width:100%; height:50px; background-color:#${hex}; border:2px solid #000; border-radius:8px;"></div>`);

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
        // Génération locale du QR code (100% côté client)
        // Utilise une API QR code en ligne gratuite comme fallback si la bibliothèque locale échoue
        try {
            const win = window as any;
            
            // Essayer d'abord avec la bibliothèque locale
            const tryLocalQRCode = (): Promise<string> => {
                return new Promise((resolve, reject) => {
                    // Vérifier plusieurs façons dont la bibliothèque peut s'exposer
                    let QRCodeLib: any = null;
                    
                    if (win.QRCode && typeof win.QRCode.toCanvas === 'function') {
                        QRCodeLib = win.QRCode;
                    } else if (win.qrcode && typeof win.qrcode.toCanvas === 'function') {
                        QRCodeLib = win.qrcode;
                    } else if (typeof QRCode !== 'undefined' && typeof (QRCode as any).toCanvas === 'function') {
                        QRCodeLib = QRCode;
                    }
                    
                    if (!QRCodeLib) {
                        reject(new Error('Bibliothèque locale non disponible'));
                        return;
                    }
                    
                    // Créer un canvas temporaire pour générer le QR code
                    const canvas = document.createElement('canvas');
                    QRCodeLib.toCanvas(canvas, input, {
                        width: 300,
                        margin: 2,
                        color: {
                            dark: '#000000',
                            light: '#FFFFFF'
                        },
                        errorCorrectionLevel: 'M'
                    }, (error: any) => {
                        if (error) {
                            reject(error);
                        } else {
                            const qrDataUrl = canvas.toDataURL('image/png');
                            resolve(qrDataUrl);
                        }
                    });
                });
            };
            
            // Fallback: Utiliser une API QR code en ligne gratuite
            const useOnlineQRCode = (): Promise<string> => {
                return new Promise((resolve, reject) => {
                    // Utiliser api.qrserver.com (gratuit, pas de clé API requise)
                    const encodedInput = encodeURIComponent(input);
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedInput}`;
                    
                    // Vérifier que l'image se charge correctement
                    const img = new Image();
                    img.onload = () => {
                        // Utiliser directement l'URL de l'API (plus simple et plus fiable)
                        resolve(qrUrl);
                    };
                    img.onerror = () => {
                        // Si l'image ne charge pas, essayer de convertir en base64 comme fallback
                        const img2 = new Image();
                        img2.crossOrigin = 'anonymous';
                        img2.onload = () => {
                            const canvas = document.createElement('canvas');
                            canvas.width = img2.width;
                            canvas.height = img2.height;
                            const ctx = canvas.getContext('2d');
                            if (ctx) {
                                ctx.drawImage(img2, 0, 0);
                                const qrDataUrl = canvas.toDataURL('image/png');
                                resolve(qrDataUrl);
                            } else {
                                reject(new Error('Impossible de créer le canvas'));
                            }
                        };
                        img2.onerror = () => reject(new Error('Erreur de chargement de l\'image QR code'));
                        img2.src = qrUrl;
                    };
                    img.src = qrUrl;
                });
            };
            
            // Essayer d'abord la bibliothèque locale, puis fallback en ligne
            let qrDataUrl: string;
            try {
                qrDataUrl = await tryLocalQRCode();
            } catch (localError) {
                console.warn('Bibliothèque locale QR Code non disponible, utilisation du fallback en ligne:', localError);
                qrDataUrl = await useOnlineQRCode();
            }
            
            // Retourner le QR code avec un format markdown simple pour un meilleur affichage
            return Promise.resolve(`### QR Code généré 📱\n\n![QR Code](${qrDataUrl})\n\n**Données encodées :** \`${input}\`\n\n*Scannez le QR code avec votre téléphone pour accéder au contenu.*`);
        } catch (error) {
            console.error('QR Code service error:', error);
            return Promise.resolve(`❌ **Erreur lors de la génération** : ${error instanceof Error ? error.message : 'Erreur inconnue'}\n\n**Solution** : Vérifiez votre connexion Internet et réessayez.`);
        }
    
    default:
      return Promise.resolve("Commande locale inconnue.");
  }
};