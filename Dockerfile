# ================================
# Stage 1 : Build des dépendances
# ================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copier uniquement les fichiers de dépendances d'abord (cache Docker optimisé)
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm ci --omit=dev

# ================================
# Stage 2 : Image finale légère
# ================================
FROM node:20-alpine

WORKDIR /app

# Copier les dépendances depuis le builder
COPY --from=builder /app/node_modules ./node_modules

# Copier le code source
COPY backend/ ./backend/
COPY config/ ./config/
COPY frontend/ ./frontend/
COPY package.json ./

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -S bds && adduser -S bds -G bds
USER bds

# Exposer le port
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Démarrer l'application
CMD ["node", "backend/server.js"]
