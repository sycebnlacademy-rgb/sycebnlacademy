# Utiliser Node.js 18 comme image de base
FROM node:18-alpine AS base

# Installer pnpm
RUN npm install -g pnpm

# Étape de build
FROM base AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json pnpm-lock.yaml ./

# Installer les dépendances
RUN pnpm install --frozen-lockfile

# Copier le code source
COPY . .

# Construire l'application
RUN pnpm build

# Étape de production
FROM nginx:alpine AS production

# Installer PHP et les extensions nécessaires
RUN apk add --no-cache \
    php82 \
    php82-fpm \
    php82-mbstring \
    php82-openssl \
    php82-json \
    php82-dom \
    php82-xml \
    php82-xmlwriter \
    php82-tokenizer \
    php82-fileinfo \
    php82-curl \
    php82-zip \
    php82-phar

# Copier les fichiers construits depuis l'étape de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/nginx.conf

# Copier les fichiers PHP
COPY php /var/www/html/php

# Exposer le port 80
EXPOSE 80

# Démarrer nginx et php-fpm
CMD ["sh", "-c", "php-fpm82 -D && nginx -g 'daemon off;'"] 