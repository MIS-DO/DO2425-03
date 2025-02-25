# Dockerfile para la API Gateway
FROM node:14-alpine

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de dependencias y realiza la instalación
COPY package*.json ./
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto en el que corre la API
EXPOSE 3000

# Comando de inicio
CMD ["node", "index.js"]
