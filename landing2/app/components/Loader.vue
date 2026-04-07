<template>
  <div class="loader-wrapper">
    <svg class="loader" viewBox="0 0 200 200">
      <defs>
        <!-- Анимированный градиент -->
        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#00f0ff">
            <animate attributeName="offset" values="-1;1" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stop-color="#8a2eff">
            <animate attributeName="offset" values="0;2" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stop-color="#00f0ff">
            <animate attributeName="offset" values="1;3" dur="2s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>

      <!-- M shape -->
      <path d="M 20 160 L 60 40" class="line" />
      <path d="M 60 40 L 100 120" class="line" />
      <path d="M 100 120 L 140 40" class="line" />
      <path d="M 140 40 L 180 160" class="line" />
    </svg>

    <div class="glow"></div>
  </div>
</template>

<script setup>
// без логики — чисто визуал
</script>

<style scoped>
.loader-wrapper {
  position: relative;
  width: 130px;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* SVG */
.loader {
  width: 100%;
  height: 100%;
}

/* линии */
.line {
  fill: none;
  stroke: url(#flowGradient);
  stroke-width: 6;
  stroke-linecap: round;

  stroke-dasharray: 200;
  stroke-dashoffset: 200;

  animation: draw 2s ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(0, 240, 255, 0.8));
}

/* эффект прорисовки */
@keyframes draw {
  0% {
    stroke-dashoffset: 200;
    opacity: 0.2;
  }
  50% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
  100% {
    stroke-dashoffset: -200;
    opacity: 0.2;
  }
}

/* фоновое пульсирующее свечение */
.glow {
  position: absolute;
  width: 150%;
  height: 150%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0,240,255,0.15) 0%, transparent 70%);
  animation: pulse 2.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(0.9);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
  }
}
</style>