# Используем официальный образ Node.js
FROM node:20.19.0

# Рабочая директория внутри контейнера
WORKDIR /app

# 👇 === НОВОЕ: Установка системных зависимостей для Chromium ===
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*
# 👆 === КОНЕЦ блока зависимостей ===

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY . .

# Собираем проект
RUN npm run build

# Создаём директорию для PDF (чтобы не было ошибок при записи)
RUN mkdir -p uploads/pdf

# Стартуем приложение в продакшн-режиме
CMD ["npm", "run", "start:prod"]

# Открываем порт для доступа к приложению
EXPOSE 3000