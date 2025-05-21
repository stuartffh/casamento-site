FROM node:18-alpine

WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar arquivos de configuração do workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copiar os arquivos do client e server
COPY apps/client ./apps/client
COPY apps/server ./apps/server

# Instalar dependências do workspace
RUN pnpm install

# Build do client
WORKDIR /app/apps/client
RUN pnpm build

# Criar diretório para arquivos estáticos no servidor
WORKDIR /app/apps/server
RUN mkdir -p public/build
RUN mkdir -p public/uploads/pix
RUN mkdir -p public/uploads/album
RUN mkdir -p public/uploads/background

# Copiar build do client para o diretório público do servidor
COPY --from=0 /app/apps/client/dist /app/apps/server/public/build

# Copiar o banco de dados SQLite (se existir)
COPY database.sqlite /app/apps/server/

# Gerar o Prisma Client
RUN npx prisma generate

# Executar as migrações do Prisma
RUN npx prisma migrate deploy

# Executar o seed (opcional, descomente se necessário)
# RUN npx prisma db seed

# Expor a porta do servidor
EXPOSE 3001

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV DATABASE_URL="file:../../../database.sqlite"

# Iniciar o servidor
CMD ["node", "src/index.js"]
