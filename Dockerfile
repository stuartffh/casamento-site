# Etapa 1 - Build do frontend (Vite)
FROM node:18-alpine AS client-build

WORKDIR /app

# Copiar arquivos principais
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/client ./apps/client

# Instalar dependências do frontend e buildar
RUN npm install -g pnpm && \
    pnpm install --filter ./apps/client && \
    cd apps/client && pnpm build

# Etapa 2 - Build final para rodar backend e servir frontend
FROM node:18-alpine

WORKDIR /app

# Copiar arquivos principais e do backend
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server ./apps/server
COPY database.sqlite ./

# Copiar build do client para public do server
COPY --from=client-build /app/apps/client/dist ./apps/server/public

# Instalar dependências do server
RUN npm install -g pnpm && \
    pnpm install --filter ./apps/server

# Expõe a porta padrão usada pelo backend
EXPOSE 3000

# Inicia o backend (que serve o frontend)
CMD ["pnpm", "--filter", "./apps/server", "npm run start"]
