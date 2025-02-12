# Usa a versão do Node.js compatível com seu sistema
FROM node:22.12.0-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos do projeto
COPY package.json package-lock.json ./
RUN npm install

# Copia o restante do código para o contêiner
COPY . .

# Faz o build do projeto
RUN npm run build

# Expõe a porta que o Next.js roda por padrão
EXPOSE 3000

# Comando para rodar o Next.js no modo produção
CMD ["npm", "run", "start"]
