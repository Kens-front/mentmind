# Vue 3
FROM node:16

WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходный код
COPY . .

# Собираем проект
RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "serve"]