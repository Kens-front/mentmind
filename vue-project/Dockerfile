# 1. Используем легкую версию Node
FROM node:18-alpine

# 2. Устанавливаем рабочую директорию
WORKDIR /app

# 3. Копируем файлы зависимостей
COPY package*.json ./

# 4. Устанавливаем зависимости
RUN npm install

# 5. Копируем исходный код проекта
COPY . .

# 6. Собираем проект (создаётся папка dist)
RUN npm run build

# 7. Контейнер завершает работу после сборки
# Файлы остаются в томе vue_dist, который подключен к Nginx
CMD ["echo", "✅ Vue build complete! Files are in /app/dist"]