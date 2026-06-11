FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set strict-ssl false && \
    npm install --no-audit --no-fund

# Copier le reste du code
COPY . .

# Variables d'environnement pour Create React App en Docker
ENV HOST=0.0.0.0
ENV PORT=3000
ENV CI=true
ENV BROWSER=none 

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]