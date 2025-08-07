# Déploiement Docker - SYCEBNL Platform

Ce guide vous explique comment déployer l'application SYCEBNL Platform avec Docker.

## Prérequis

- Docker installé sur votre machine
- Docker Compose installé
- Git (pour cloner le projet)

## Configuration

### 1. Variables d'environnement (optionnel)

Créez un fichier `.env` à la racine du projet si nécessaire :

```bash
# Configuration de l'application
NODE_ENV=production
VITE_API_URL=http://localhost/php

# Configuration PHP (si nécessaire)
PHP_FPM_USER=www-data
PHP_FPM_GROUP=www-data
```

## Déploiement en Production

### 1. Construire et démarrer les conteneurs

```bash
# Construire les images et démarrer les services
docker-compose up -d --build

# Vérifier que les conteneurs sont en cours d'exécution
docker-compose ps
```

### 2. Accéder à l'application

- **Frontend React** : http://localhost
- **API PHP** : http://localhost/php

### 3. Arrêter les services

```bash
docker-compose down
```

## Développement

### 1. Mode développement avec hot reload

```bash
# Démarrer en mode développement
docker-compose -f docker-compose.dev.yml up -d --build

# Accéder à l'application
# Frontend : http://localhost:3000
```

### 2. Logs en temps réel

```bash
# Voir les logs du frontend
docker-compose logs -f frontend

# Voir les logs PHP
docker-compose logs -f php
```

## Structure des fichiers Docker

```
├── Dockerfile              # Build de production
├── Dockerfile.dev          # Build de développement
├── docker-compose.yml      # Orchestration production
├── docker-compose.dev.yml  # Orchestration développement
├── nginx.conf             # Configuration nginx
└── .dockerignore          # Fichiers exclus du build
```

## Services

### Frontend (React + Vite)
- **Port** : 80 (production) / 3000 (développement)
- **Technologie** : React + Vite + Tailwind CSS
- **Serveur** : Nginx (production) / Vite Dev Server (développement)

### Backend (PHP)
- **Port** : 9000 (interne)
- **Technologie** : PHP 8.2 + FPM
- **Fonctionnalité** : Formulaire de contact avec PHPMailer

## Commandes utiles

```bash
# Reconstruire les images
docker-compose build --no-cache

# Redémarrer un service spécifique
docker-compose restart frontend

# Supprimer tous les conteneurs et volumes
docker-compose down -v

# Nettoyer les images non utilisées
docker system prune -a
```

## Dépannage

### Problèmes courants

1. **Port déjà utilisé** :
   ```bash
   # Vérifier les ports utilisés
   netstat -tulpn | grep :80
   ```

2. **Erreur de build** :
   ```bash
   # Reconstruire sans cache
   docker-compose build --no-cache
   ```

3. **Problèmes de permissions** :
   ```bash
   # Corriger les permissions
   sudo chown -R $USER:$USER .
   ```

### Logs détaillés

```bash
# Logs du frontend
docker-compose logs frontend

# Logs PHP
docker-compose logs php

# Logs nginx
docker exec -it sycebnl-frontend-1 nginx -t
```

## Sécurité

- Les conteneurs sont isolés dans un réseau Docker
- Nginx est configuré avec des en-têtes de sécurité
- PHP-FPM est configuré avec des permissions restreintes

## Performance

- Compression gzip activée
- Cache des fichiers statiques configuré
- Images optimisées avec Alpine Linux 