FROM node:18

WORKDIR /usr/src/app

# Copiar el archivo package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Copiar el código fuente
COPY . .

# Construir el proyecto
RUN npm run build

# Exponer el puerto 3000 (ya que es el puerto en el que corre la app de React)
EXPOSE 3000

# Comando para servir la app construida usando serve
CMD ["npx", "serve", "-s", "build"]
