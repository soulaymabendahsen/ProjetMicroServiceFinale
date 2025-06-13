FROM node:18-alpine

# Création d'un répertoire de travail
WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm ci --only=production

# Copie du reste du code source
COPY . .

# Création d'un utilisateur non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

# Exposition du port
EXPOSE 3000

# Variables d'environnement par défaut (peuvent être surchargées lors du déploiement)
ENV NODE_ENV=production
ENV PORT=3000
ENV MONGODB_URI=mongodb://mongo:27017/complaints
ENV EUREKA_HOST=eureka
ENV EUREKA_PORT=8761
ENV APP_NAME=complaint-service
ENV APP_PORT=3000

# Commande de démarrage
CMD ["npm", "start"]
