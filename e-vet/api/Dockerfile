FROM node:18-alpine

WORKDIR /usr/src/app

# Gerekli build araçlarını ekle
RUN apk add --no-cache python3 make g++

COPY package*.json ./

# Modülleri yükle ve bcrypt'i yeniden derle
RUN npm install
RUN npm rebuild bcrypt --build-from-source

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]