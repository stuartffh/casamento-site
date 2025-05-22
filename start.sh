#!/bin/bash
# start.sh

echo "Iniciando servidor..."

# Inicia o backend
node /app/apps/server/src/index.js &

# Inicia o frontend na porta 3000 (Next.js, React ou Vite?)
# Altere o caminho e comando conforme seu framework!
cd /app/apps/client
pnpm start

# Impede que o container finalize imediatamente
wait