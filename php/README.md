# Configuration du formulaire de contact

## Instructions d'installation

1. **Téléchargez les fichiers PHP** sur votre serveur web dans un dossier accessible (par exemple `/contact/`)

2. **Configuration Gmail** :
   - Connectez-vous à votre compte Gmail (sycebnlacademy@gmail.com)
   - Activez l'authentification à deux facteurs
   - Générez un mot de passe d'application :
     - Allez dans Paramètres Google > Sécurité > Authentification à 2 facteurs > Mots de passe d'application
     - Sélectionnez "Autre" et nommez-le "SYCEBNL Contact Form"
     - Copiez le mot de passe généré (16 caractères)

3. **Modifiez le fichier contact.php** :
   - Remplacez `YOUR_GMAIL_APP_PASSWORD` par le mot de passe d'application généré
   - Ligne 25 : `$mail->Password = 'votre_mot_de_passe_application';`

4. **Testez le formulaire** :
   - Assurez-vous que PHP est installé sur votre serveur
   - Vérifiez que les extensions PHP `openssl` et `mbstring` sont activées
   - Testez l'envoi d'un message via le formulaire

## Structure des fichiers

```
php/
├── contact.php          # Script principal de traitement
├── PHPMailer/          # Bibliothèque PHPMailer
│   ├── Exception.php
│   ├── PHPMailer.php
│   └── SMTP.php
└── README.md           # Ce fichier
```

## Dépannage

- **Erreur SMTP** : Vérifiez que le mot de passe d'application est correct
- **Erreur 500** : Vérifiez les logs PHP du serveur
- **CORS** : Les en-têtes CORS sont déjà configurés dans le script

## Sécurité

- Le script utilise `htmlspecialchars()` pour éviter les injections XSS
- Les en-têtes CORS sont configurés pour accepter les requêtes cross-origin
- Utilisez HTTPS en production pour sécuriser les communications

