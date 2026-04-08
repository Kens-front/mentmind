<!-- components/FixedCTAButton.vue -->
<template>
  <Transition name="cta-slide" appear>
    <div v-if="isVisible" class="fixed-cta" :class="`fixed-cta--${position}`">
      <nuxt-link
          class="fixed-cta__btn"
          :aria-label="label"
          @click="handleClick"
      >
        <span class="fixed-cta__shimmer" />
        <span class="fixed-cta__icon">🎓</span>
        <span class="fixed-cta__text">{{ label }}</span>
        <span class="fixed-cta__pulse" />
      </nuxt-link>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  label?: string
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center'
  showDelay?: number
  hideOnClick?: boolean
}>()

const emit = defineEmits<{
  click: []
}>()

const isVisible = ref(false)
const label = computed(() => props.label || 'Пробное занятие')
const position = computed(() => props.position || 'bottom-right')

// Логика скролла с защитой от дребезга
let lastScrollY = 0
let scrollDirection: 'up' | 'down' = 'up'
let scrollCooldown = false
let scrollTimer: ReturnType<typeof setTimeout> | null = null

function handleScroll() {
  if (!import.meta.client) return

  const currentY = window.scrollY
  scrollDirection = currentY > lastScrollY ? 'down' : 'up'
  lastScrollY = currentY

  // Скрываем при быстром скролле вниз, показываем при скролле вверх или в начале страницы
  if (scrollCooldown) return

  if (scrollDirection === 'down' && currentY > 200) {
    isVisible.value = false
    scrollCooldown = true
    scrollTimer = setTimeout(() => { scrollCooldown = false }, 800)
  } else if (scrollDirection === 'up') {
    isVisible.value = true
  }
}

function handleClick() {
  emit('click')
  scrollTo(0, document.body.offsetHeight)
  if (props.hideOnClick !== false) {
    isVisible.value = false
  }
}

onMounted(() => {
  if (import.meta.client) {
    // Задержка перед появлением
    const delay = props.showDelay ?? 7500
    setTimeout(() => { isVisible.value = true }, delay)
    window.addEventListener('scroll', handleScroll, { passive: true })
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('scroll', handleScroll)
    if (scrollTimer) clearTimeout(scrollTimer)
  }
})
</script>

<style scoped>
.fixed-cta {
  position: fixed;
  z-index: 9998;
  pointer-events: auto;
}

/* Позиционирование */
.fixed-cta--bottom-right { bottom: 24px; right: 24px; }
.fixed-cta--bottom-left  { bottom: 24px; left: 24px; }
.fixed-cta--bottom-center {
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
}

/* Кнопка */
.fixed-cta__btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #ffffff;
  font-weight: 600;
  font-size: 15px;
  line-height: 1.2;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  box-shadow:
      0 4px 20px rgba(99, 102, 241, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  white-space: nowrap;
}

.fixed-cta__btn:hover {
  transform: translateY(-3px) scale(1.04);
  box-shadow:
      0 8px 30px rgba(99, 102, 241, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.2) inset;
}

.fixed-cta__btn:active {
  transform: translateY(-1px) scale(0.98);
  transition-duration: 0.1s;
}

/* Иконка и текст */
.fixed-cta__icon {
  font-size: 18px;
  transition: transform 0.3s ease;
}

.fixed-cta__btn:hover .fixed-cta__icon {
  transform: rotate(-12deg) scale(1.15);
}

/* Пульсация (привлекает внимание) */
.fixed-cta__pulse {
  position: absolute;
  inset: -6px;
  border: 2px solid rgba(139, 92, 246, 0.6);
  border-radius: 999px;
  animation: cta-pulse 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  pointer-events: none;
}

@keyframes cta-pulse {
  0%   { transform: scale(1); opacity: 0.7; }
  100% { transform: scale(1.35); opacity: 0; }
}

.fixed-cta__btn:hover .fixed-cta__pulse {
  animation-play-state: paused;
}

/* Шиммер-эффект (блик) */
.fixed-cta__shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.25),
      transparent
  );
  transform: skewX(-20deg);
  animation: shimmer 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes shimmer {
  0%, 100% { left: -100%; }
  50%      { left: 150%; }
}

/* Доступность: отключение анимаций */
@media (prefers-reduced-motion: reduce) {
  .fixed-cta__pulse,
  .fixed-cta__shimmer {
    animation: none !important;
  }
  .fixed-cta__btn {
    transition: none;
  }
}

/* Адаптив */
@media (max-width: 640px) {
  .fixed-cta--bottom-right,
  .fixed-cta--bottom-left {
    left: 16px;
    right: 16px;
    bottom: 16px;
  }
  .fixed-cta--bottom-center {
    left: 16px;
    right: 16px;
    transform: none;
  }
  .fixed-cta__btn {
    width: 100%;
    justify-content: center;
    padding: 16px 20px;
    font-size: 16px;
  }
}

/* Transition */
.cta-slide-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.cta-slide-leave-active {
  transition: all 0.3s ease;
}
.cta-slide-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}
.cta-slide-leave-to {
  opacity: 0;
  transform: translateY(15px) scale(0.95);
}
</style>