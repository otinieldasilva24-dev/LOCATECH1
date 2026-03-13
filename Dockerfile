# Usando a imagem oficial do Node.js
FROM node:20

# Diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copiar o arquivo de dependências para o container
COPY package*.json ./

# Instalar as dependências dentro do container
RUN npm install  npx prisma generate



# Copiar o restante dos arquivos da aplicação
COPY . .

# Expor a porta em que a API vai rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
