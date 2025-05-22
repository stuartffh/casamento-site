# Etapa 1 - Build do client
FROM node:18-alpine AS client-build
WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar arquivos principais do monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copiar apps
COPY apps/client ./apps/client
COPY apps/server ./apps/server

# Instalar dependências
RUN pnpm install

# Build do client
WORKDIR /app/apps/client
RUN pnpm build

# Etapa 2 - Server
FROM node:18-alpine
WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar arquivos principais
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copiar apenas o server
COPY apps/server ./apps/server

# Copiar build do client gerado na etapa anterior
COPY --from=client-build /app/apps/client/dist ./apps/server/public/build

# ✅ Copiar banco de dados SQLite (certifique-se de que esse arquivo exista!)
# Caso não tenha o banco ainda, comente ou remova a linha abaixo:
COPY ./database.sqlite ./apps/server/

# Instalar somente as dependências de produção do server
WORKDIR /app/apps/server
RUN pnpm install --prod

# Prisma
# Se ainda não tiver migrations criadas, você pode pular a linha de deploy
ENV DATABASE_URL="file:./database.sqlite"

RUN apk add --no-cache openssl
RUN npx prisma generate && npx prisma migrate deploy

# Variáveis de ambiente
ENV NODE_ENV=production
ENV DATABASE_URL="file:./database.sqlite"

# Expor a porta
EXPOSE 3001

# Iniciar o servidor
CMD ["node", "src/index.js"]
