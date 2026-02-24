# Сборка
FROM node:18.18.2-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Запуск
FROM node:18.18.2-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY --from=build /app/.output ./dist
COPY --from=build /app/nuxt.config.ts ./

EXPOSE 3000
CMD ["node", "dist/server/index.mjs"]