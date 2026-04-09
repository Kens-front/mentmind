<template>
  <div v-if="isVisible" class="overlay">
    <section class="urgency-shell" :class="[`theme-${theme}`, { 'is-urgent': isUrgent }]">
      <div class="urgency-glow glow-1"></div>
      <div class="urgency-glow glow-2"></div>

      <div class="urgency-card">
        <div class="noise"></div>

        <div class="urgency-topline">
          <span class="live-dot"></span>
          <span class="topline-text">{{ badgeText }}</span>
          <span class="spacer"></span>
          <transition name="fade-slide" mode="out-in">
            <button class="quiz-close" @click="closeModal" aria-label="Закрыть">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </transition>
        </div>

        <div class="urgency-content">
          <div class="urgency-copy">
            <p class="eyebrow">{{ eyebrow }}</p>
            <h2 class="title">{{ title }}</h2>
            <p class="description">{{ description }}</p>

            <div class="proof-row">
              <div class="proof-chip">
                <span class="chip-icon">⚡</span>
                <span>{{ proof1 }}</span>
              </div>
              <div class="proof-chip">
                <span class="chip-icon">🔥</span>
                <span>{{ proof2 }}</span>
              </div>
            </div>
          </div>

          <div class="countdown-card">
            <div class="countdown-head">
              <span class="countdown-label">Предложение исчезнет через</span>
              <span class="countdown-shine"></span>
            </div>

            <div class="countdown-grid">
              <div class="time-box" v-for="item in countdownItems" :key="item.label">
                <transition name="flip" mode="out-in">
                  <span :key="`${item.label}-${item.value}`" class="time-value">{{ item.value }}</span>
                </transition>
                <span class="time-label">{{ item.label }}</span>
              </div>
            </div>

            <button class="cta-button" @click="scrollToForm">
              <span class="cta-text">{{ ctaText }}</span>
              <span class="cta-arrow">→</span>
            </button>
          </div>

          <button class="cta-button mobile" @click="scrollToForm">
            <span class="cta-text">{{ ctaText }}</span>
            <span class="cta-arrow">→</span>
          </button>
        </div>

        <div class="progress-wrap">
          <div class="progress-meta">
            <span>Заполнено {{ progressPercent }}%</span>
            <span>Пиковая активность сейчас</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${progressPercent}%` }"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
 
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Последние места на персональный разбор'
  },
  description: {
    type: String,
    default: 'Забронируй слот сейчас — после завершения таймера цена вырастет, а доступ к бонусам закроется.'
  },
  eyebrow: {
    type: String,
    default: 'Limited drop'
  },
  badgeText: {
    type: String,
    default: 'Спрос выше обычного'
  },
  proof1: {
    type: String,
    default: '+27 заявок за сегодня'
  },
  proof2: {
    type: String,
    default: 'Бонусы доступны только до конца отсчёта'
  },
  ctaText: {
    type: String,
    default: 'Забронировать место'
  },
  slotsLeft: {
    type: Number,
    default: 4
  },
  totalSlots: {
    type: Number,
    default: 20
  },
  deadline: {
    type: String,
    default: ''
  },
  durationHours: {
    type: Number,
    default: 18
  },
  theme: {
    type: String,
    default: 'violet'
  }
})

const emit = defineEmits(['cta', 'expired'])
const now = ref(Date.now())
let timerId = null

const isVisible = ref(false)
const targetTimestamp = computed(() => {
  if (props.deadline) {
    return new Date(props.deadline).getTime()
  }

  return Date.now() + props.durationHours * 60 * 60 * 1000
})

const remainingMs = ref(Math.max(targetTimestamp.value - now.value, 0))

const updateTimer = () => {
  remainingMs.value = Math.max(targetTimestamp.value - Date.now(), 0)

  if (remainingMs.value <= 0 && timerId) {
    clearInterval(timerId)
    timerId = null
    emit('expired')
  }
}

function closeModal() {
  isVisible.value = false;
  emit('close')
}

function scrollToForm() {
  emit('cta')
  closeModal()
}
onMounted(() => {
  setTimeout(() => isVisible.value = true, 7000)
  updateTimer()
  timerId = setInterval(updateTimer, 1000)
})

onBeforeUnmount(() => {
  if (timerId) clearInterval(timerId)
})

const splitTime = computed(() => {
  const totalSeconds = Math.floor(remainingMs.value / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return { days, hours, minutes, seconds }
})

const pad = (value) => String(value).padStart(2, '0')

const countdownItems = computed(() => [
  { label: 'дней', value: pad(splitTime.value.days) },
  { label: 'часов', value: pad(splitTime.value.hours) },
  { label: 'минут', value: pad(splitTime.value.minutes) },
  { label: 'секунд', value: pad(splitTime.value.seconds) }
])

const progressPercent = computed(() => {
  if (props.totalSlots <= 0) return 0
  const filled = props.totalSlots - props.slotsLeft
  return Math.max(0, Math.min(100, Math.round((filled / props.totalSlots) * 100)))
})

const isUrgent = computed(() => remainingMs.value <= 1000 * 60 * 60 * 6)
</script>

<style scoped>
:root {
  color-scheme: dark;
}

.urgency-shell {
  max-width: 70%;
  position: fixed;
  z-index: 12;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  --bg-1: #120f24;
  --bg-2: #1d163b;
  --accent: #9b6bff;
  --accent-2: #5eead4;
  --text: #ffffff;
  --muted: rgba(255, 255, 255, 0.72);
  --stroke: rgba(255, 255, 255, 0.14);
  overflow: hidden;
  border-radius: 32px;
  background:
      radial-gradient(circle at top left, rgba(155, 107, 255, 0.26), transparent 32%),
      radial-gradient(circle at bottom right, rgba(94, 234, 212, 0.18), transparent 26%),
      linear-gradient(135deg, var(--bg-1), var(--bg-2));
  padding: 1px;
  isolation: isolate;
 
  height: max-content;
  
  @media screen and (max-width: 768px) {
    max-width: 90%;
  }
 
}

.theme-emerald {
  --bg-1: #071c18;
  --bg-2: #10342e;
  --accent: #34d399;
  --accent-2: #fbbf24;
}

.theme-crimson {
  --bg-1: #23090e;
  --bg-2: #46101d;
  --accent: #fb7185;
  --accent-2: #f59e0b;
}

.urgency-card {
  position: relative;
  backdrop-filter: blur(16px);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03));
  border: 1px solid var(--stroke);
  border-radius: 31px;
  padding: 28px;
  color: var(--text);
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.35);
}

.noise {
  pointer-events: none;
  position: absolute;
  inset: 0;
  opacity: 0.09;
  background-image:
      radial-gradient(circle at 20% 20%, rgba(255,255,255,.3) 0 1px, transparent 1px),
      radial-gradient(circle at 80% 30%, rgba(255,255,255,.24) 0 1px, transparent 1px),
      radial-gradient(circle at 40% 70%, rgba(255,255,255,.18) 0 1px, transparent 1px);
  background-size: 22px 22px;
  mix-blend-mode: soft-light;
}

.urgency-glow {
  position: absolute;
  width: 280px;
  height: 280px;
  border-radius: 999px;
  filter: blur(60px);
  opacity: 0.35;
  z-index: -1;
}

.glow-1 {
  top: -60px;
  left: -40px;
  background: var(--accent);
}

.glow-2 {
  right: -70px;
  bottom: -80px;
  background: var(--accent-2);
}

.urgency-topline,
.progress-meta,
.proof-row,
.countdown-head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.urgency-topline {
  margin-bottom: 22px;
}

.live-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #ff5d73;
  box-shadow: 0 0 0 0 rgba(255, 93, 115, 0.75);
  animation: pulse-dot 1.8s infinite;
}

.topline-text,
.seats-pill,
.eyebrow,
.time-label,
.progress-meta,
.countdown-label {
  font-size: 13px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.topline-text,
.progress-meta,
.description,
.time-label,
.countdown-label {
  color: var(--muted);
}

.spacer {
  flex: 1;
}

.seats-pill,
.proof-chip,
.time-box,
.countdown-card {
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.seats-pill {
  border-radius: 999px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.09);
}

.urgency-content {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 24px;
}

.eyebrow {
  margin: 0 0 10px;
}

.title {
  margin: 0;
  font-size: clamp(30px, 4vw, 52px);
  line-height: 0.98;
  letter-spacing: -0.04em;
  max-width: 11ch;
}

.description {
  margin: 16px 0 0;
  max-width: 56ch;
  font-size: 16px;
  line-height: 1.65;
}

.proof-row {
  flex-wrap: wrap;
  margin-top: 22px;
}

.proof-chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
}

.chip-icon {
  font-size: 16px;
}

.countdown-card {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  height: max-content;
  padding: 18px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.04));
  
  @media screen and (max-width: 768px) {
    display: none;
  }
}

.countdown-shine {
  margin-left: auto;
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.8), transparent);
}

.countdown-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 18px 0 20px;
}

.time-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 92px;
  border-radius: 20px;
  background: rgba(7, 10, 20, 0.38);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.06);
}

.time-value {
  display: block;
  font-size: clamp(24px, 3vw, 36px);
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.05em;
}

.time-label {
  margin-top: 8px;
}

.cta-button {
  position: relative;
  overflow: hidden;
  width: 100%;
  border: 0;
  border-radius: 18px;
  padding: 16px 18px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent-2) 70%, white 10%));
  box-shadow: 0 14px 30px color-mix(in srgb, var(--accent) 30%, transparent);
  transition: transform 0.22s ease, box-shadow 0.22s ease, filter 0.22s ease;
}

.cta-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 20%, rgba(255,255,255,.25) 50%, transparent 80%);
  transform: translateX(-120%);
  animation: sweep 3.4s infinite;
}

.cta-button:hover {
  transform: translateY(-2px) scale(1.01);
  filter: brightness(1.04);
}

.cta-text,
.cta-arrow {
  position: relative;
  z-index: 1;
}

.cta-arrow {
  margin-left: 8px;
}

.progress-wrap {
  margin-top: 22px;
}

.progress-meta {
  justify-content: space-between;
  margin-bottom: 10px;
}

.progress-bar {
  height: 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.progress-fill {
  position: relative;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
}

.progress-fill::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.5), transparent);
  animation: shimmer 2.6s linear infinite;
}

.is-urgent .urgency-card {
  animation: urgent-breathe 2.4s ease-in-out infinite;
}

.fade-slide-enter-active,
.fade-slide-leave-active,
.flip-enter-active,
.flip-leave-active {
  transition: all 0.22s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.flip-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.94);
}

.flip-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(1.04);
}

@keyframes pulse-dot {
  0% { box-shadow: 0 0 0 0 rgba(255, 93, 115, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(255, 93, 115, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 93, 115, 0); }
}

@keyframes sweep {
  0% { transform: translateX(-120%); }
  50%, 100% { transform: translateX(120%); }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(220%); }
}

@keyframes urgent-breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.006); }
}

@media (max-width: 920px) {
  .urgency-content {
    grid-template-columns: 1fr;
  }

  .title {
    max-width: none;
  }
}

@media (max-width: 640px) {
  .urgency-card {
    padding: 18px;
    border-radius: 24px;
  }

  .countdown-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .title {
    font-size: 32px;
  }

  .description {
    font-size: 15px;
  }

  .urgency-topline,
  .progress-meta {
    gap: 8px;
  }
}

.overlay {
  position: fixed;
  z-index: 100;
  width: 100%;
  height: 100%;
  
    &:before {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      backdrop-filter: blur(40px);
      width: 100%;
      height: 100%;
      z-index: 11;
    }
}

.quiz-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
}

.mobile {
  display: none;
  
  @media screen and (max-width: 768px) {
    display: block;
  }
}
</style>
