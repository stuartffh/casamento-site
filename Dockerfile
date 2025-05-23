# Etapa 1 - Build do frontend com Vite
FROM node:18-alpine AS frontend-build

WORKDIR /app

# Copiar arquivos necessários
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/client ./apps/client

# Instalar e buildar o client
RUN npm install -g pnpm && \
    pnpm install --filter client... && \
    pnpm --filter client build

# Etapa 2 - Backend + servir frontend
FROM node:18-alpine

WORKDIR /app

# Copiar arquivos principais
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server ./apps/server
COPY database.sqlite ./

# Copiar build do client para o public do server
COPY --from=frontend-build /app/apps/client/dist ./apps/server/public

# Instalar dependências do server
RUN npm install -g pnpm && \
    pnpm install --filter server...

# Expor a porta que o backend usa
EXPOSE 3001

# Inicia o backend que já serve o frontend
CMD ["pnpm", "--filter", "server", "start"]
