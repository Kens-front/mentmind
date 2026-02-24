<template>
    <div class="slide-hint">
      <div class="slide-hint__text">пролистните слайд</div>
      <div class="slide-hint__arrow-wrapper">
        <span class="slide-hint__arrow">➜</span>
      </div>
    </div>
  </template>
  
  <script setup>
  // Никакой логики не нужно — всё делает CSS-анимация
  </script>
  
  <style lang="scss" scoped>
  .slide-hint {
    position: absolute;
    bottom: 50%;
    right: 5%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    z-index: 12;

    @media screen and (max-width: 1024px){
        bottom: 85%;
    }
  }
  
  .slide-hint__text {
    font-size: 14px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    opacity: 0.9;
  }
  
  .slide-hint__arrow-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .slide-hint__arrow {
    display: inline-block;
    font-size: 24px;
    /* центр по вертикали, рост вправо */
    transform-origin: left center;
    animation: arrow-pulse 0.9s ease-in-out infinite;
  }
  
  /* Анимация "то уже, то шире" */
  @keyframes arrow-pulse {
    0% {
      transform: scaleX(1);
    }
    50% {
      transform: scaleX(1.6);
    }
    100% {
      transform: scaleX(1);
    }
  }
  </style>
  