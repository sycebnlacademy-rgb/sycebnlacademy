# Plateforme SYCEBNL - Formation en ligne

## Description

Plateforme de formation en ligne complète pour le Système Comptable des Entités à But Non Lucratif (SYCEBNL). Cette application React offre une expérience d'apprentissage moderne avec gestion des utilisateurs, système de paiement intégré et interface d'administration.

## Fonctionnalités

### 🎓 Formation
- **6 modules de formation** progressifs et structurés
- **Module 1 gratuit** - Introduction au SYCEBNL
- **Modules 2-6 premium** - Contenu avancé
- **Quiz d'évaluation** pour chaque module
- **Certificat officiel** téléchargeable
- **Suivi de progression** personnalisé

### 👥 Gestion des utilisateurs
- **Inscription/Connexion** sécurisée
- **Profils utilisateurs** complets
- **Système Premium** avec deux modes d'activation :
  - Paiement en ligne via FedaPay
  - Approbation par l'administrateur
- **Chiffrement des données** sensibles

### 🛡️ Administration
- **Tableau de bord administrateur** complet
- **Gestion des utilisateurs** (activation/désactivation Premium)
- **Système d'approbation** des demandes Premium
- **Statistiques** et analytics
- **Gestion des modules** de formation

### 💳 Paiement
- **Intégration FedaPay** pour les paiements
- **Moyens de paiement** : Orange Money, MTN Mobile Money, Cartes bancaires
- **Prix** : 20 000 FCFA (paiement unique)
- **Alternative gratuite** : Demande d'approbation admin

## Comptes par défaut

### Administrateur
- **Email** : admin@sycebnl.com
- **Mot de passe** : admin123
- **Accès** : Interface d'administration complète

### Utilisateur Premium
- **Email** : premium@sycebnl.com
- **Mot de passe** : premium123
- **Accès** : Tous les modules débloqués

### Utilisateur Gratuit
- **Email** : demo@sycebnl.com
- **Mot de passe** : demo123
- **Accès** : Module 1 uniquement

## Installation

### Prérequis
- Node.js 18+ 
- npm ou pnpm
- Navigateur moderne

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone [URL_DU_REPO]
cd sycebnl-react-platform-final
```

2. **Installer les dépendances**
```bash
npm install
# ou
pnpm install
```

3. **Démarrer en développement**
```bash
npm run dev
# ou
pnpm run dev
```

4. **Construire pour la production**
```bash
npm run build
# ou
pnpm run build
```

5. **Prévisualiser la production**
```bash
npm run preview
# ou
pnpm run preview
```

## Déploiement

### Option 1 : Serveur statique
```bash
# Après avoir construit le projet
cd dist
python3 -m http.server 8000
```

### Option 2 : Serveur Node.js
```bash
# Utiliser un serveur comme serve
npm install -g serve
serve -s dist -l 8000
```

### Option 3 : Plateformes cloud
- **Vercel** : Déploiement automatique depuis Git
- **Netlify** : Glisser-déposer le dossier `dist`
- **GitHub Pages** : Configuration avec GitHub Actions

## Structure du projet

```
sycebnl-react-platform-final/
├── src/
│   ├── components/          # Composants réutilisables
│   ├── contexts/           # Contextes React (Auth, Progress)
│   ├── pages/              # Pages de l'application
│   ├── utils/              # Utilitaires et helpers
│   └── App.jsx             # Composant principal
├── public/                 # Fichiers statiques
├── dist/                   # Build de production
└── package.json           # Dépendances et scripts
```

## Technologies utilisées

- **React 18** - Framework frontend
- **React Router** - Routage
- **Tailwind CSS** - Styles
- **Shadcn/ui** - Composants UI
- **Lucide React** - Icônes
- **React Hot Toast** - Notifications
- **CryptoJS** - Chiffrement
- **Vite** - Build tool

## Sécurité

- **Chiffrement AES** des données utilisateur
- **Hachage SHA256** des mots de passe
- **Validation côté client** des formulaires
- **Protection CSRF** via tokens
- **Stockage sécurisé** en localStorage chiffré

## Support

Pour toute question ou problème :
- **Email** : support@sycebnl.com
- **Documentation** : Consultez ce README
- **Issues** : Utilisez le système d'issues du repository

## Licence

© 2024 SYCEBNL. Tous droits réservés.

---

## Notes de développement

### Fonctionnalités implémentées ✅
- Système d'authentification complet
- Interface d'administration fonctionnelle
- Gestion des modules de formation
- Système de paiement intégré
- Demandes d'approbation admin
- Génération de certificats
- Interface responsive
- Comptes par défaut

### Améliorations futures 🚀
- API backend pour la persistance
- Base de données réelle
- Système de notifications push
- Analytics avancées
- Tests automatisés
- PWA (Progressive Web App)
- Multilingue (français/anglais)

### Configuration de production 🔧
- Variables d'environnement pour les clés API
- Configuration HTTPS
- Optimisation des performances
- Monitoring et logs
- Sauvegarde des données
- CDN pour les assets statiques

