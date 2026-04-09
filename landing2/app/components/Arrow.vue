<!-- components/SwipeHint.vue -->
<template>
  <Transition name="hint-appear" appear>
    <div v-if="isVisible" @click="isVisible=false" class="swipe-hint" :class="`swipe-hint--${position}`">
      <div class="swipe-hint__glass">
        <!-- Анимированные стрелки -->
        <div class="swipe-hint__arrows">
          <svg class="swipe-hint__arrow swipe-hint__arrow--1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <svg class="swipe-hint__arrow swipe-hint__arrow--2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </div>

        <span class="swipe-hint__text">{{ text }}</span>

        <!-- Опциональная кнопка скрытия -->
        <button v-if="closable" class="swipe-hint__close" @click.stop="isVisible = false" aria-label="Скрыть подсказку">
          <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <!-- Постоянный индикатор активности -->
        <div class="swipe-hint__glow" />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  text?: string
  position?: 'bottom-center' | 'bottom-right' | 'top-center'
  closable?: boolean
}>()

const text = computed(() => props.text || 'Свайп для просмотра')
const position = computed(() => props.position || 'bottom-center')
const closable = computed(() => props.closable !== false)

// Всегда виден по умолчанию
const isVisible = ref(true)
</script>

<style scoped>
/* ========================
   WRAPPER (не блокирует свайпы)
   ======================== */
.swipe-hint {
  position: absolute;
  z-index: 10;
  pointer-events: none;
}

.swipe-hint--bottom-center { bottom: 24px; left: 50%; transform: translateX(-50%); }
.swipe-hint--bottom-right  { bottom: 24px; right: 24px; }
.swipe-hint--top-center    { top: 24px; left: 50%; transform: translateX(-50%); }

/* ========================
   GLASS PILL
   ======================== */
.swipe-hint__glass {
  position: relative;
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px 14px;
  background: rgba(15, 15, 35, 0.65);
  backdrop-filter: blur(12px) saturate(150%);
  -webkit-backdrop-filter: blur(12px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.swipe-hint__glass:hover {
  transform: translateY(-2px);
  box-shadow:
      0 12px 40px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(99, 102, 241, 0.3) inset;
}

/* ========================
   ARROWS ANIMATION
   ======================== */
.swipe-hint__arrows {
  display: flex;
  align-items: center;
  gap: 2px;
}

.swipe-hint__arrow {
  width: 16px;
  height: 16px;
  color: #818cf8;
  animation: swipeSlide 1.8s ease-in-out infinite;
}

.swipe-hint__arrow--2 {
  animation-delay: 0.4s;
  opacity: 0.6;
}

@keyframes swipeSlide {
  0%, 100% { transform: translateX(0); opacity: 0.4; }
  40%      { transform: translateX(8px); opacity: 1; }
  60%      { transform: translateX(8px); opacity: 1; }
  100%     { transform: translateX(0); opacity: 0.4; }
}

/* ========================
   TEXT & CLOSE
   ======================== */
.swipe-hint__text {
  font-size: 13px;
  font-weight: 500;
  color: #cbd5e1;
  white-space: nowrap;
  letter-spacing: 0.3px;
}

.swipe-hint__close {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.06);
  border: none;
  border-radius: 50%;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 4px;
  flex-shrink: 0;
}

.swipe-hint__close:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #e2e8f0;
}

/* ========================
   GLOW INDICATOR (замена прогресс-бара)
   ======================== */
.swipe-hint__glow {
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 40%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.6), transparent);
  border-radius: 2px;
  animation: glowPulse 2.5s ease-in-out infinite;
  pointer-events: none;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.3; width: 30%; }
  50%      { opacity: 0.8; width: 50%; }
}

/* ========================
   TRANSITIONS
   ======================== */
.hint-appear-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.hint-appear-leave-active {
  transition: all 0.3s ease;
}
.hint-appear-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.95);
}
.hint-appear-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}

/* ========================
   REDUCED MOTION
   ======================== */
@media (prefers-reduced-motion: reduce) {
  .swipe-hint__arrow { animation: none !important; }
  .swipe-hint__glow { animation: none !important; opacity: 0.5; }
  .swipe-hint__glass { transition: none !important; }
}

/* ========================
   RESPONSIVE
   ======================== */
@media (max-width: 640px) {
  .swipe-hint--bottom-center { bottom: 5%; }
  .swipe-hint__glass {
    padding: 12px;
    gap: 8px;
  }
  .swipe-hint__text { font-size: 12px; }
  .swipe-hint__arrow { width: 14px; height: 14px; }
}

.slider-wrapper::before, .slider-wrapper::after {
  content: ''; position: absolute; top: 0; bottom: 0; width: 60px;
  pointer-events: none; z-index: 5;
}
.slider-wrapper::before { left: 0; background: linear-gradient(90deg, rgba(0,0,0,0.4), transparent); }
.slider-wrapper::after { right: 0; background: linear-gradient(270deg, rgba(0,0,0,0.4), transparent); }
</style>