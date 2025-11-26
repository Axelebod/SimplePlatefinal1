# Templates d'Emails Supabase pour SimplePlate

Ces templates doivent être copiés dans le dashboard Supabase : **Authentication > Email Templates**

## Configuration dans Supabase

1. Allez dans votre projet Supabase
2. **Authentication** > **Email Templates**
3. Sélectionnez le type d'email à personnaliser
4. Copiez-collez le template correspondant ci-dessous
5. Sauvegardez

---

## 1. Email de Confirmation d'Inscription (Confirm signup)

**Subject:** `Confirmez votre email pour SimplePlate AI`

**Body (HTML):**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmez votre email</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #FAFAFA;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFAFA; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 2px solid #050505; border-radius: 8px; overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #050505; padding: 30px; text-align: center;">
                            <div style="display: inline-block; width: 50px; height: 50px; background-color: #fde047; border: 2px solid #050505; border-radius: 4px; margin-bottom: 15px;">
                                <div style="color: #050505; font-weight: bold; font-size: 24px; line-height: 50px; font-family: 'Space Grotesk', sans-serif;">SP</div>
                            </div>
                            <h1 style="color: #FFFFFF; margin: 0; font-size: 28px; font-weight: bold; font-family: 'Space Grotesk', sans-serif;">SimplePlate AI</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #050505; margin: 0 0 20px 0; font-size: 24px; font-weight: bold; font-family: 'Space Grotesk', sans-serif;">
                                Bienvenue sur SimplePlate ! 🚀
                            </h2>
                            
                            <p style="color: #333333; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                                Merci de vous être inscrit sur <strong>SimplePlate AI</strong> ! Pour activer votre compte et commencer à utiliser nos 50+ outils IA, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous.
                            </p>
                            
                            <p style="color: #333333; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
                                <strong>🎁 Bonus :</strong> Vous recevrez <strong>5 crédits gratuits</strong> dès l'activation de votre compte !
                            </p>
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #050505; color: #FFFFFF; text-decoration: none; padding: 16px 32px; border-radius: 6px; font-weight: bold; font-size: 16px; border: 2px solid #050505; box-shadow: 4px 4px 0px 0px #86efac; font-family: 'Space Grotesk', sans-serif;">
                                            Confirmer mon email
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #666666; margin: 30px 0 0 0; font-size: 14px; line-height: 1.5;">
                                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                                <a href="{{ .ConfirmationURL }}" style="color: #d8b4fe; word-break: break-all;">{{ .ConfirmationURL }}</a>
                            </p>
                            
                            <p style="color: #999999; margin: 30px 0 0 0; font-size: 12px; line-height: 1.5;">
                                Ce lien expire dans 24 heures. Si vous n'avez pas créé de compte sur SimplePlate, vous pouvez ignorer cet email.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F3F4F6; padding: 20px 30px; border-top: 2px solid #050505; text-align: center;">
                            <p style="color: #666666; margin: 0 0 10px 0; font-size: 14px;">
                                <strong>SimplePlate AI</strong> - La boîte à outils ultime pour le web moderne
                            </p>
                            <p style="color: #999999; margin: 0; font-size: 12px;">
                                <a href="https://simpleplate.dev" style="color: #d8b4fe; text-decoration: none;">simpleplate.dev</a> | 
                                <a href="https://simpleplate.dev/contact" style="color: #d8b4fe; text-decoration: none;">Contact</a> | 
                                <a href="https://simpleplate.dev/legal" style="color: #d8b4fe; text-decoration: none;">Mentions légales</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

---

## 2. Email de Réinitialisation de Mot de Passe (Reset password)

**Subject:** `Réinitialisez votre mot de passe SimplePlate`

**Body (HTML):**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de mot de passe</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #FAFAFA;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFAFA; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 2px solid #050505; border-radius: 8px; overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #050505; padding: 30px; text-align: center;">
                            <div style="display: inline-block; width: 50px; height: 50px; background-color: #fde047; border: 2px solid #050505; border-radius: 4px; margin-bottom: 15px;">
                                <div style="color: #050505; font-weight: bold; font-size: 24px; line-height: 50px; font-family: 'Space Grotesk', sans-serif;">SP</div>
                            </div>
                            <h1 style="color: #FFFFFF; margin: 0; font-size: 28px; font-weight: bold; font-family: 'Space Grotesk', sans-serif;">SimplePlate AI</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #050505; margin: 0 0 20px 0; font-size: 24px; font-weight: bold; font-family: 'Space Grotesk', sans-serif;">
                                Réinitialisation de mot de passe 🔒
                            </h2>
                            
                            <p style="color: #333333; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                                Vous avez demandé à réinitialiser votre mot de passe sur <strong>SimplePlate AI</strong>. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe sécurisé.
                            </p>
                            
                            <p style="color: #fca5a5; margin: 0 0 30px 0; font-size: 14px; line-height: 1.5; padding: 12px; background-color: #fef2f2; border-left: 4px solid #fca5a5; border-radius: 4px;">
                                <strong>⚠️ Sécurité :</strong> Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe actuel reste inchangé.
                            </p>
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #050505; color: #FFFFFF; text-decoration: none; padding: 16px 32px; border-radius: 6px; font-weight: bold; font-size: 16px; border: 2px solid #050505; box-shadow: 4px 4px 0px 0px #86efac; font-family: 'Space Grotesk', sans-serif;">
                                            Réinitialiser mon mot de passe
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #666666; margin: 30px 0 0 0; font-size: 14px; line-height: 1.5;">
                                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                                <a href="{{ .ConfirmationURL }}" style="color: #d8b4fe; word-break: break-all;">{{ .ConfirmationURL }}</a>
                            </p>
                            
                            <p style="color: #999999; margin: 30px 0 0 0; font-size: 12px; line-height: 1.5;">
                                Ce lien expire dans 1 heure. Pour des raisons de sécurité, ne partagez jamais ce lien avec personne.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F3F4F6; padding: 20px 30px; border-top: 2px solid #050505; text-align: center;">
                            <p style="color: #666666; margin: 0 0 10px 0; font-size: 14px;">
                                <strong>SimplePlate AI</strong> - La boîte à outils ultime pour le web moderne
                            </p>
                            <p style="color: #999999; margin: 0; font-size: 12px;">
                                <a href="https://simpleplate.dev" style="color: #d8b4fe; text-decoration: none;">simpleplate.dev</a> | 
                                <a href="https://simpleplate.dev/contact" style="color: #d8b4fe; text-decoration: none;">Contact</a> | 
                                <a href="https://simpleplate.dev/legal" style="color: #d8b4fe; text-decoration: none;">Mentions légales</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

---

## 3. Email de Changement d'Email (Change email)

**Subject:** `Confirmez votre nouvelle adresse email`

**Body (HTML):**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation changement d'email</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #FAFAFA;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFAFA; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 2px solid #050505; border-radius: 8px; overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #050505; padding: 30px; text-align: center;">
                            <div style="display: inline-block; width: 50px; height: 50px; background-color: #fde047; border: 2px solid #050505; border-radius: 4px; margin-bottom: 15px;">
                                <div style="color: #050505; font-weight: bold; font-size: 24px; line-height: 50px; font-family: 'Space Grotesk', sans-serif;">SP</div>
                            </div>
                            <h1 style="color: #FFFFFF; margin: 0; font-size: 28px; font-weight: bold; font-family: 'Space Grotesk', sans-serif;">SimplePlate AI</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #050505; margin: 0 0 20px 0; font-size: 24px; font-weight: bold; font-family: 'Space Grotesk', sans-serif;">
                                Confirmez votre nouvelle adresse email 📧
                            </h2>
                            
                            <p style="color: #333333; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                                Vous avez demandé à changer l'adresse email de votre compte <strong>SimplePlate AI</strong>. Pour finaliser ce changement, veuillez confirmer votre nouvelle adresse email en cliquant sur le bouton ci-dessous.
                            </p>
                            
                            <p style="color: #fca5a5; margin: 0 0 30px 0; font-size: 14px; line-height: 1.5; padding: 12px; background-color: #fef2f2; border-left: 4px solid #fca5a5; border-radius: 4px;">
                                <strong>⚠️ Important :</strong> Si vous n'avez pas demandé ce changement, ignorez cet email et contactez-nous immédiatement.
                            </p>
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #050505; color: #FFFFFF; text-decoration: none; padding: 16px 32px; border-radius: 6px; font-weight: bold; font-size: 16px; border: 2px solid #050505; box-shadow: 4px 4px 0px 0px #86efac; font-family: 'Space Grotesk', sans-serif;">
                                            Confirmer la nouvelle adresse
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #666666; margin: 30px 0 0 0; font-size: 14px; line-height: 1.5;">
                                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                                <a href="{{ .ConfirmationURL }}" style="color: #d8b4fe; word-break: break-all;">{{ .ConfirmationURL }}</a>
                            </p>
                            
                            <p style="color: #999999; margin: 30px 0 0 0; font-size: 12px; line-height: 1.5;">
                                Ce lien expire dans 24 heures.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F3F4F6; padding: 20px 30px; border-top: 2px solid #050505; text-align: center;">
                            <p style="color: #666666; margin: 0 0 10px 0; font-size: 14px;">
                                <strong>SimplePlate AI</strong> - La boîte à outils ultime pour le web moderne
                            </p>
                            <p style="color: #999999; margin: 0; font-size: 12px;">
                                <a href="https://simpleplate.dev" style="color: #d8b4fe; text-decoration: none;">simpleplate.dev</a> | 
                                <a href="https://simpleplate.dev/contact" style="color: #d8b4fe; text-decoration: none;">Contact</a> | 
                                <a href="https://simpleplate.dev/legal" style="color: #d8b4fe; text-decoration: none;">Mentions légales</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

---

## 4. Email Magic Link (si utilisé)

**Subject:** `Votre lien de connexion SimplePlate`

**Body (HTML):**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lien de connexion</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #FAFAFA;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFAFA; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 2px solid #050505; border-radius: 8px; overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #050505; padding: 30px; text-align: center;">
                            <div style="display: inline-block; width: 50px; height: 50px; background-color: #fde047; border: 2px solid #050505; border-radius: 4px; margin-bottom: 15px;">
                                <div style="color: #050505; font-weight: bold; font-size: 24px; line-height: 50px; font-family: 'Space Grotesk', sans-serif;">SP</div>
                            </div>
                            <h1 style="color: #FFFFFF; margin: 0; font-size: 28px; font-weight: bold; font-family: 'Space Grotesk', sans-serif;">SimplePlate AI</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #050505; margin: 0 0 20px 0; font-size: 24px; font-weight: bold; font-family: 'Space Grotesk', sans-serif;">
                                Connexion sans mot de passe ✨
                            </h2>
                            
                            <p style="color: #333333; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                                Cliquez sur le bouton ci-dessous pour vous connecter à votre compte <strong>SimplePlate AI</strong> sans mot de passe.
                            </p>
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #050505; color: #FFFFFF; text-decoration: none; padding: 16px 32px; border-radius: 6px; font-weight: bold; font-size: 16px; border: 2px solid #050505; box-shadow: 4px 4px 0px 0px #86efac; font-family: 'Space Grotesk', sans-serif;">
                                            Se connecter
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #666666; margin: 30px 0 0 0; font-size: 14px; line-height: 1.5;">
                                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                                <a href="{{ .ConfirmationURL }}" style="color: #d8b4fe; word-break: break-all;">{{ .ConfirmationURL }}</a>
                            </p>
                            
                            <p style="color: #fca5a5; margin: 30px 0 0 0; font-size: 14px; line-height: 1.5; padding: 12px; background-color: #fef2f2; border-left: 4px solid #fca5a5; border-radius: 4px;">
                                <strong>🔒 Sécurité :</strong> Ce lien est unique et expire dans 1 heure. Ne partagez jamais ce lien avec personne.
                            </p>
                            
                            <p style="color: #999999; margin: 30px 0 0 0; font-size: 12px; line-height: 1.5;">
                                Si vous n'avez pas demandé ce lien de connexion, ignorez cet email.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F3F4F6; padding: 20px 30px; border-top: 2px solid #050505; text-align: center;">
                            <p style="color: #666666; margin: 0 0 10px 0; font-size: 14px;">
                                <strong>SimplePlate AI</strong> - La boîte à outils ultime pour le web moderne
                            </p>
                            <p style="color: #999999; margin: 0; font-size: 12px;">
                                <a href="https://simpleplate.dev" style="color: #d8b4fe; text-decoration: none;">simpleplate.dev</a> | 
                                <a href="https://simpleplate.dev/contact" style="color: #d8b4fe; text-decoration: none;">Contact</a> | 
                                <a href="https://simpleplate.dev/legal" style="color: #d8b4fe; text-decoration: none;">Mentions légales</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

---

## 5. Email d'Invitation (si utilisé)

**Subject:** `Vous avez été invité sur SimplePlate AI`

**Body (HTML):**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation SimplePlate</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #FAFAFA;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFAFA; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 2px solid #050505; border-radius: 8px; overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #050505; padding: 30px; text-align: center;">
                            <div style="display: inline-block; width: 50px; height: 50px; background-color: #fde047; border: 2px solid #050505; border-radius: 4px; margin-bottom: 15px;">
                                <div style="color: #050505; font-weight: bold; font-size: 24px; line-height: 50px; font-family: 'Space Grotesk', sans-serif;">SP</div>
                            </div>
                            <h1 style="color: #FFFFFF; margin: 0; font-size: 28px; font-weight: bold; font-family: 'Space Grotesk', sans-serif;">SimplePlate AI</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #050505; margin: 0 0 20px 0; font-size: 24px; font-weight: bold; font-family: 'Space Grotesk', sans-serif;">
                                Vous avez été invité ! 🎉
                            </h2>
                            
                            <p style="color: #333333; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                                Vous avez été invité à rejoindre <strong>SimplePlate AI</strong>, la plateforme avec 50+ outils IA professionnels pour développer, créer et automatiser vos tâches.
                            </p>
                            
                            <p style="color: #333333; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
                                Cliquez sur le bouton ci-dessous pour accepter l'invitation et créer votre compte.
                            </p>
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #050505; color: #FFFFFF; text-decoration: none; padding: 16px 32px; border-radius: 6px; font-weight: bold; font-size: 16px; border: 2px solid #050505; box-shadow: 4px 4px 0px 0px #86efac; font-family: 'Space Grotesk', sans-serif;">
                                            Accepter l'invitation
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #666666; margin: 30px 0 0 0; font-size: 14px; line-height: 1.5;">
                                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                                <a href="{{ .ConfirmationURL }}" style="color: #d8b4fe; word-break: break-all;">{{ .ConfirmationURL }}</a>
                            </p>
                            
                            <p style="color: #999999; margin: 30px 0 0 0; font-size: 12px; line-height: 1.5;">
                                Ce lien expire dans 7 jours.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F3F4F6; padding: 20px 30px; border-top: 2px solid #050505; text-align: center;">
                            <p style="color: #666666; margin: 0 0 10px 0; font-size: 14px;">
                                <strong>SimplePlate AI</strong> - La boîte à outils ultime pour le web moderne
                            </p>
                            <p style="color: #999999; margin: 0; font-size: 12px;">
                                <a href="https://simpleplate.dev" style="color: #d8b4fe; text-decoration: none;">simpleplate.dev</a> | 
                                <a href="https://simpleplate.dev/contact" style="color: #d8b4fe; text-decoration: none;">Contact</a> | 
                                <a href="https://simpleplate.dev/legal" style="color: #d8b4fe; text-decoration: none;">Mentions légales</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

---

## Instructions de Configuration

### Dans Supabase Dashboard :

1. **Allez dans votre projet Supabase**
2. **Authentication** → **Email Templates**
3. Pour chaque type d'email :
   - Sélectionnez le template (Confirm signup, Reset password, etc.)
   - Cliquez sur **"Edit"**
   - Remplacez le **Subject** par celui fourni ci-dessus
   - Remplacez le **Body** par le HTML fourni
   - Cliquez sur **"Save"**

### Variables Supabase disponibles :

- `{{ .ConfirmationURL }}` - Le lien de confirmation/réinitialisation
- `{{ .Email }}` - L'adresse email de l'utilisateur
- `{{ .Token }}` - Le token (rarement utilisé dans les templates HTML)

### Notes importantes :

- Les templates utilisent le style **néo-brutaliste** de SimplePlate (bordures noires, ombres, couleurs vives)
- Tous les emails sont en **français**
- Les liens pointent vers `simpleplate.dev`
- Les emails sont **responsive** et fonctionnent sur mobile
- Le design est cohérent avec le site web

### Test des emails :

Après avoir configuré les templates, testez-les en :
1. Créant un compte de test
2. Demandant une réinitialisation de mot de passe
3. Vérifiant que les emails arrivent correctement dans votre boîte mail

---

**Dernière mise à jour :** 25 novembre 2025

