# Этап 1: Сборка Vue приложения
FROM node:22.13-alpine as vue-builder
WORKDIR /app
COPY ./vue-project/package*.json ./
RUN npm install
COPY ./vue-project .
RUN npm run build

# Этап 2: Настройка Nginx
FROM nginx:alpine
# Копируем конфиг
COPY ./nginx.conf /etc/nginx/nginx.conf
# Копируем собранные файлы из этапа сборки
COPY --from=vue-builder /app/dist /usr/share/nginx/html/vue