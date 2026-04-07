<template>
  <div class="loader-wrapper">
    <svg class="loader" viewBox="0 0 200 200">
      <!-- Левая линия -->
      <path
          d="M 20 160 L 60 40"
          class="line"
          style="animation-delay: 0s"
      />

      <!-- Средняя левая -->
      <path
          d="M 60 40 L 100 120"
          class="line"
          style="animation-delay: 0.2s"
      />

      <!-- Средняя правая -->
      <path
          d="M 100 120 L 140 40"
          class="line"
          style="animation-delay: 0.4s"
      />

      <!-- Правая линия -->
      <path
          d="M 140 40 L 180 160"
          class="line"
          style="animation-delay: 0.6s"
      />
    </svg>

    <div class="glow"></div>
  </div>
</template>

<script setup>
// логики не надо — чисто визуал
</script>

<style scoped>
.loader-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* SVG */
.loader {
  width: 100%;
  height: 100%;
}

/* линии M */
.line {
  fill: none;
  stroke: #00d4ff;
  stroke-width: 6;
  stroke-linecap: round;
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: draw 1.6s ease-in-out infinite;
  filter: drop-shadow(0 0 6px #00d4ff);
}

/* эффект рисования */
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

/* свечение фона */
.glow {
  position: absolute;
  width: 140%;
  height: 140%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(60, 217, 244, 0.74) 0%, transparent 70%);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(0.9);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}
</style>