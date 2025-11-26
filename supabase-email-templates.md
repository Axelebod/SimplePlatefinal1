# Templates d'emails Supabase - SimplePlate AI

Ces templates sont conçus dans le style néo-brutaliste de SimplePlate avec des couleurs vives et des bordures noires.

## Configuration dans Supabase

1. Allez dans **Authentication** > **Email Templates**
2. Remplacez le contenu de chaque template par celui ci-dessous
3. Les variables disponibles : `{{ .ConfirmationURL }}`, `{{ .Email }}`, `{{ .Token }}`, `{{ .TokenHash }}`, `{{ .SiteURL }}`

---

## 1. Confirmation d'inscription (Signup)

**Subject:** `Confirmez votre email - SimplePlate AI`

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Inter', sans-serif; background: #FAFAFA; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border: 3px solid #050505; padding: 30px; }
    .logo { background: #050505; color: #fde047; padding: 15px; text-align: center; font-weight: bold; font-size: 24px; margin-bottom: 20px; }
    .button { display: inline-block; background: #050505; color: #fde047; padding: 15px 30px; text-decoration: none; font-weight: bold; border: 2px solid #050505; margin: 20px 0; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #050505; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">SP</div>
    <h1 style="color: #050505; margin-top: 0;">Bienvenue sur SimplePlate AI ! 🚀</h1>
    <p>Merci de vous être inscrit. Pour activer votre compte, cliquez sur le bouton ci-dessous :</p>
    <div style="text-align: center;">
      <a href="{{ .ConfirmationURL }}" class="button">Confirmer mon email</a>
    </div>
    <p style="font-size: 12px; color: #666;">Ou copiez ce lien dans votre navigateur :</p>
    <p style="font-size: 12px; word-break: break-all; color: #050505;">{{ .ConfirmationURL }}</p>
    <p>Ce lien expire dans 24 heures.</p>
    <div class="footer">
      <p>SimplePlate AI - La boîte à outils ultime</p>
      <p>Si vous n'avez pas créé de compte, ignorez cet email.</p>
    </div>
  </div>
</body>
</html>
```

---

## 2. Réinitialisation de mot de passe (Password Reset)

**Subject:** `Réinitialisez votre mot de passe - SimplePlate AI`

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Inter', sans-serif; background: #FAFAFA; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border: 3px solid #050505; padding: 30px; }
    .logo { background: #050505; color: #fde047; padding: 15px; text-align: center; font-weight: bold; font-size: 24px; margin-bottom: 20px; }
    .button { display: inline-block; background: #fca5a5; color: #050505; padding: 15px 30px; text-decoration: none; font-weight: bold; border: 2px solid #050505; margin: 20px 0; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #050505; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">SP</div>
    <h1 style="color: #050505; margin-top: 0;">Réinitialisation de mot de passe</h1>
    <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous :</p>
    <div style="text-align: center;">
      <a href="{{ .ConfirmationURL }}" class="button">Réinitialiser mon mot de passe</a>
    </div>
    <p style="font-size: 12px; color: #666;">Ou copiez ce lien dans votre navigateur :</p>
    <p style="font-size: 12px; word-break: break-all; color: #050505;">{{ .ConfirmationURL }}</p>
    <p><strong>Ce lien expire dans 1 heure.</strong></p>
    <p style="color: #fca5a5; font-weight: bold;">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe ne sera pas modifié.</p>
    <div class="footer">
      <p>SimplePlate AI - La boîte à outils ultime</p>
    </div>
  </div>
</body>
</html>
```

---

## 3. Changement d'email (Email Change)

**Subject:** `Confirmez votre nouvelle adresse email - SimplePlate AI`

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Inter', sans-serif; background: #FAFAFA; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border: 3px solid #050505; padding: 30px; }
    .logo { background: #050505; color: #fde047; padding: 15px; text-align: center; font-weight: bold; font-size: 24px; margin-bottom: 20px; }
    .button { display: inline-block; background: #93c5fd; color: #050505; padding: 15px 30px; text-decoration: none; font-weight: bold; border: 2px solid #050505; margin: 20px 0; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #050505; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">SP</div>
    <h1 style="color: #050505; margin-top: 0;">Confirmation de changement d'email</h1>
    <p>Vous avez demandé à changer votre adresse email pour : <strong>{{ .Email }}</strong></p>
    <p>Pour confirmer ce changement, cliquez sur le bouton ci-dessous :</p>
    <div style="text-align: center;">
      <a href="{{ .ConfirmationURL }}" class="button">Confirmer le changement</a>
    </div>
    <p style="font-size: 12px; color: #666;">Ou copiez ce lien dans votre navigateur :</p>
    <p style="font-size: 12px; word-break: break-all; color: #050505;">{{ .ConfirmationURL }}</p>
    <p><strong>Ce lien expire dans 24 heures.</strong></p>
    <p style="color: #fca5a5; font-weight: bold;">Si vous n'avez pas demandé ce changement, ignorez cet email.</p>
    <div class="footer">
      <p>SimplePlate AI - La boîte à outils ultime</p>
    </div>
  </div>
</body>
</html>
```

---

## 4. Magic Link (Connexion sans mot de passe)

**Subject:** `Lien de connexion - SimplePlate AI`

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Inter', sans-serif; background: #FAFAFA; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border: 3px solid #050505; padding: 30px; }
    .logo { background: #050505; color: #fde047; padding: 15px; text-align: center; font-weight: bold; font-size: 24px; margin-bottom: 20px; }
    .button { display: inline-block; background: #d8b4fe; color: #050505; padding: 15px 30px; text-decoration: none; font-weight: bold; border: 2px solid #050505; margin: 20px 0; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #050505; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">SP</div>
    <h1 style="color: #050505; margin-top: 0;">Connexion à SimplePlate AI</h1>
    <p>Cliquez sur le bouton ci-dessous pour vous connecter sans mot de passe :</p>
    <div style="text-align: center;">
      <a href="{{ .ConfirmationURL }}" class="button">Se connecter</a>
    </div>
    <p style="font-size: 12px; color: #666;">Ou copiez ce lien dans votre navigateur :</p>
    <p style="font-size: 12px; word-break: break-all; color: #050505;">{{ .ConfirmationURL }}</p>
    <p><strong>Ce lien expire dans 1 heure.</strong></p>
    <p style="color: #fca5a5; font-weight: bold;">Si vous n'avez pas demandé cette connexion, ignorez cet email.</p>
    <div class="footer">
      <p>SimplePlate AI - La boîte à outils ultime</p>
    </div>
  </div>
</body>
</html>
```

---

## 5. Invitation (si vous utilisez les invitations)

**Subject:** `Invitation à rejoindre SimplePlate AI`

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Inter', sans-serif; background: #FAFAFA; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border: 3px solid #050505; padding: 30px; }
    .logo { background: #050505; color: #fde047; padding: 15px; text-align: center; font-weight: bold; font-size: 24px; margin-bottom: 20px; }
    .button { display: inline-block; background: #86efac; color: #050505; padding: 15px 30px; text-decoration: none; font-weight: bold; border: 2px solid #050505; margin: 20px 0; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #050505; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">SP</div>
    <h1 style="color: #050505; margin-top: 0;">Vous êtes invité ! 🎉</h1>
    <p>Vous avez été invité à rejoindre <strong>SimplePlate AI</strong>, la boîte à outils ultime avec 50+ outils IA.</p>
    <p>Cliquez sur le bouton ci-dessous pour accepter l'invitation et créer votre compte :</p>
    <div style="text-align: center;">
      <a href="{{ .ConfirmationURL }}" class="button">Accepter l'invitation</a>
    </div>
    <p style="font-size: 12px; color: #666;">Ou copiez ce lien dans votre navigateur :</p>
    <p style="font-size: 12px; word-break: break-all; color: #050505;">{{ .ConfirmationURL }}</p>
    <div class="footer">
      <p>SimplePlate AI - La boîte à outils ultime</p>
    </div>
  </div>
</body>
</html>
```

---

## Notes importantes

- Remplacez `{{ .ConfirmationURL }}` par la variable appropriée selon le template Supabase
- Les couleurs utilisées correspondent au style néo-brutaliste de SimplePlate
- Testez chaque template après configuration dans Supabase
- Les liens expirent selon les durées indiquées (configurables dans Supabase)

