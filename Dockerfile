# Usa a imagem oficial do Node.js 22.14 como base
FROM node:22.14

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e package-lock.json (caso exista)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Expõe a porta que a aplicação vai rodar (ajuste se necessário)
EXPOSE 3000

# Comando para iniciar a aplicação (ajuste se usar outro comando)
CMD ["npm", "start"]
