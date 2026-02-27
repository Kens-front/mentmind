# === Stage 1: Build Vue app ===
# 👇 ОБЯЗАТЕЛЬНО: "as builder" именуем эту стадию
FROM node:22.12-alpine as builder

WORKDIR /app

# Копируем манифесты и устанавливаем зависимости (кешируется)
COPY package*.json ./
RUN npm ci

# Копируем исходный код и собираем проект
COPY . .
RUN npm run build

# === Stage 2: Serve with Nginx ===
FROM nginx:alpine

# Копируем конфиг nginx (если есть)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 👇 Копируем сборку из именованной стадии "builder"
COPY --from=builder /app/dist /usr/share/nginx/html/vue

# Открываем порт
EXPOSE 80

# Запускаем nginx в foreground-режиме
CMD ["nginx", "-g", "daemon off;"]