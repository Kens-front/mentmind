# Сборка
FROM node:18.18.2-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --include=dev

COPY . .
RUN npm run build

# Запуск
FROM node:18.18.2-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --include=production

COPY --from=build /app/dist ./dist
COPY prisma ./prisma

# Для работы Prisma
RUN npm install -g @prisma/client && \
    npx prisma generate

EXPOSE 4000
CMD ["node", "dist/main"]