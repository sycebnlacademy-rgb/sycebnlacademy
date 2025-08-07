# Guide de déploiement SYCEBNL sur Render

## Prérequis

- Un compte Render (gratuit)
- Votre code source sur GitHub/GitLab/Bitbucket
- Node.js 18+ (géré automatiquement par Render)

## Étapes de déploiement

### 1. Préparation du projet

Votre projet est déjà configuré avec :
- ✅ `package.json` avec les scripts de build
- ✅ `vite.config.js` configuré
- ✅ `render.yaml` pour l'automatisation
- ✅ `public/_redirects` pour le routage SPA

### 2. Déploiement sur Render

#### Option A : Déploiement automatique (recommandé)

1. **Connectez-vous à Render**
   - Allez sur [render.com](https://render.com)
   - Créez un compte ou connectez-vous

2. **Créez un nouveau service**
   - Cliquez sur "New +"
   - Sélectionnez "Static Site"

3. **Configurez le service**
   - **Name** : `sycebnl-react-platform`
   - **Repository** : Connectez votre repository GitHub
   - **Branch** : `main` (ou votre branche principale)
   - **Build Command** : `pnpm install && pnpm run build`
   - **Publish Directory** : `dist`

4. **Variables d'environnement (optionnel)**
   Si vous utilisez des variables d'environnement, ajoutez-les :
   ```
   VITE_ENCRYPTION_KEY=sycebnl-platform-2024
   VITE_SMTP_HOST=smtp.gmail.com
   VITE_SMTP_PORT=465
   VITE_SMTP_USER=sycebnlacademy@gmail.com
   VITE_SMTP_PASS=votre_mot_de_passe_application
   ```

5. **Déployez**
   - Cliquez sur "Create Static Site"
   - Render va automatiquement construire et déployer votre application

#### Option B : Déploiement avec render.yaml

Si vous avez le fichier `render.yaml` dans votre repository :
1. Créez un nouveau service "Blueprint"
2. Connectez votre repository
3. Render utilisera automatiquement la configuration du fichier `render.yaml`

### 3. Configuration post-déploiement

#### Domaine personnalisé (optionnel)
1. Dans les paramètres de votre service
2. Allez dans "Custom Domains"
3. Ajoutez votre domaine (ex: `app.sycebnl.com`)
4. Configurez les DNS selon les instructions de Render

#### Variables d'environnement
Si vous avez besoin de variables d'environnement :
1. Allez dans "Environment"
2. Ajoutez vos variables avec le préfixe `VITE_`
3. Redéployez l'application

### 4. Vérification du déploiement

Après le déploiement, vérifiez :
- ✅ L'application se charge correctement
- ✅ Le routage fonctionne (testez les différentes pages)
- ✅ Les formulaires fonctionnent
- ✅ Les images et assets se chargent
- ✅ Le mode responsive fonctionne

### 5. Monitoring et maintenance

#### Logs
- Accédez aux logs dans l'interface Render
- Surveillez les erreurs de build et de runtime

#### Redéploiement automatique
- Render redéploie automatiquement à chaque push sur votre branche principale
- Vous pouvez configurer des branches spécifiques

#### Performance
- Render utilise un CDN global
- Les assets statiques sont optimisés automatiquement
- HTTPS est activé par défaut

## Dépannage

### Erreurs courantes

#### Build échoue
- Vérifiez que `pnpm install` fonctionne localement
- Vérifiez les dépendances dans `package.json`
- Consultez les logs de build dans Render
- **Erreur "Cannot read properties of null"** : Assurez-vous d'utiliser `pnpm` au lieu de `npm` dans la commande de build

#### Routage ne fonctionne pas
- Vérifiez que le fichier `public/_redirects` est présent
- Assurez-vous que le routage SPA est configuré

#### Variables d'environnement
- Vérifiez que les variables commencent par `VITE_`
- Redéployez après avoir ajouté des variables

#### Performance lente
- Optimisez les images
- Vérifiez la taille du bundle
- Utilisez la compression gzip (activée par défaut)

## Support

- **Documentation Render** : [docs.render.com](https://docs.render.com)
- **Support Render** : Via l'interface ou email
- **Issues du projet** : Utilisez GitHub Issues

## Coûts

- **Plan gratuit** : 750 heures/mois
- **Plan payant** : À partir de $7/mois
- **Domaine personnalisé** : Gratuit

---

**Note** : Ce guide est spécifique à Render. Pour d'autres plateformes (Vercel, Netlify, etc.), consultez leur documentation respective.
