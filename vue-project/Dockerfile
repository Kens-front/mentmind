# 1. Используем легкую версию Node
FROM node:22.12-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
# Копируем сборку в папку, которую будем маунтить
COPY --from=builder /app/dist /usr/share/nginx/html/vue
COPY nginx.conf /etc/nginx/conf.d/default.conf  