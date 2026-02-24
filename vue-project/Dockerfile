# Шаг 1: Строим проект
FROM node:16 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Шаг 2: Настроим Nginx для сервера
FROM nginx:alpine

# Копируем собранные файлы из предыдущего шага в директорию Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем кастомный конфиг для Nginx, если нужно
# COPY nginx.conf /etc/nginx/nginx.conf

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]