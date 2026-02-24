# Используем официальный Node.js образ
FROM node:20-alpine

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY . .

# Собираем проект для продакшн
RUN npm run build

# Стартуем сервер
CMD ["npm", "run", "start"]

# Открываем порт для доступа к приложению
EXPOSE 3000