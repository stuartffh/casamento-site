# Etapa 1 - Build do frontend (Vite)
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar arquivos do monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/client ./apps/client

# Instalar dependências e buildar o client
RUN npm install -g pnpm && \
    pnpm install --filter client... && \
    cd apps/client && pnpm build

# Etapa 2 - Rodar o backend e servir o frontend
FROM node:18-alpine

WORKDIR /app

# Instalar dependências necessárias
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server ./apps/server
COPY database.sqlite ./

# Copiar build do client para o public do server
COPY --from=builder /app/apps/client/dist ./apps/server/public

RUN npm install -g pnpm && pnpm install --filter server...

EXPOSE 3000

# Comando para iniciar o backend (que já serve o frontend buildado)
CMD ["pnpm", "--filter", "server", "start"]
