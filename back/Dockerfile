# Используем официальный образ Node.js
FROM node:20.19.0

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json (или yarn.lock)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY . .

# Собираем проект
RUN npm run build

# Стартуем приложение в продакшн-режиме
CMD ["npm", "run", "start:prod"]

# Открываем порт для доступа к приложению
EXPOSE 3000