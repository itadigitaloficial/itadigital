#!/bin/bash

# Verifica se o Node.js está instalado
if ! command -v node &> /dev/null
then
    echo "Node.js não encontrado. Por favor, instale o Node.js versão 18 ou superior."
    exit 1
fi

# Verifica a versão do Node.js
NODE_VERSION=$(node -v)
REQUIRED_VERSION="v18.0.0"
if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "Versão do Node.js incompatível. Por favor, use Node.js 18 ou superior."
    exit 1
fi

# Copia o arquivo .env.example para .env se não existir
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Arquivo .env criado a partir do .env.example"
fi

# Instala as dependências
echo "Instalando dependências..."
npm install

# Configura os git hooks
npm run prepare

# Mensagem de sucesso
echo "Ambiente de desenvolvimento configurado com sucesso!"
echo "Use 'npm run dev' para iniciar o servidor de desenvolvimento"
