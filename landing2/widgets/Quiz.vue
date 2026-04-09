<!-- components/EducationQuizModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal-backdrop">
      <div v-if="isOpen" class="quiz-modal-backdrop" @click.self="closeModal">
        <Transition name="modal-content" appear>
          <div v-if="isOpen" class="quiz-modal">
            <!-- Закрыть -->
            <button class="quiz-close" @click="closeModal" aria-label="Закрыть">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <!-- Стартовый экран -->
            <div v-if="step === 'start'" class="quiz-screen quiz-start" key="start">
              <div class="quiz-start__icon">🎯</div>
              <h2 class="quiz-start__title">Найди свою сферу в IT</h2>
              <p class="quiz-start__subtitle">
                Ответь на 6 вопросов, и мы подберём идеальную программу обучения специально для тебя
              </p>
              <div class="quiz-start__features">
                <div class="quiz-start__feature">
                  <span class="quiz-start__feature-icon">⏱</span>
                  <span>3 минуты</span>
                </div>
                <div class="quiz-start__feature">
                  <span class="quiz-start__feature-icon">📋</span>
                  <span>6 вопросов</span>
                </div>
                <div class="quiz-start__feature">
                  <span class="quiz-start__feature-icon">🎁</span>
                  <span>Персональная рекомендация</span>
                </div>
              </div>
              <button class="quiz-btn quiz-btn--primary" @click="startQuiz">
                Начать квиз
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            <!-- Экран вопроса -->
            <TransitionGroup v-else-if="step === 'quiz'" name="question" tag="div" class="quiz-screen quiz-question" key="quiz">
              <div class="quiz-question__header">
                <div class="quiz-progress">
                  <div class="quiz-progress__bar">
                    <div
                        class="quiz-progress__fill"
                        :style="{ width: progressPercent + '%' }"
                    />
                  </div>
                  <span class="quiz-progress__text">{{ currentQuestion + 1 }} / {{ questions.length }}</span>
                </div>
              </div>

              <div class="quiz-question__body">
                <h3 class="quiz-question__title">
                  {{ questions[currentQuestion]?.title }}
                </h3>
                <p v-if="questions[currentQuestion]?.description" class="quiz-question__desc">
                  {{ questions[currentQuestion]?.description }}
                </p>

                <div class="quiz-options">
                  <button
                      v-for="(option, idx) in questions[currentQuestion]?.options"
                      :key="idx"
                      class="quiz-option"
                      :class="{ 'quiz-option--selected': selectedAnswer === idx }"
                      :style="{ animationDelay: idx * 0.07 + 's' }"
                      @click="selectAnswer(idx)"
                  >
                    <span class="quiz-option__icon">{{ option.icon }}</span>
                    <div class="quiz-option__content">
                      <span class="quiz-option__label">{{ option.label }}</span>
                      <span v-if="option.hint" class="quiz-option__hint">{{ option.hint }}</span>
                    </div>
                    <span class="quiz-option__check">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  </button>
                </div>

                <button
                    class="quiz-btn quiz-btn--next"
                    :disabled="selectedAnswer === null"
                    @click="nextQuestion"
                >
                  {{ isLastQuestion ? 'Узнать результат' : 'Далее' }}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </TransitionGroup>

            <!-- Экран загрузки -->
            <div v-else-if="step === 'loading'" class="quiz-screen quiz-loading" key="loading">
              <div class="quiz-loading__spinner">
                <div class="quiz-loading__circle" />
              </div>
              <p class="quiz-loading__text">Анализируем ваши ответы...</p>
            </div>

            <!-- Экран результата -->
            <Transition v-else-if="step === 'result'" name="result" appear>
              <div class="quiz-screen quiz-result" key="result">
                <div class="quiz-result__confetti" />
                <div class="quiz-result__badge">{{ result?.badge }}</div>
                <h2 class="quiz-result__title">{{ result?.title }}</h2>
                <p class="quiz-result__description">{{ result?.description }}</p>

                <div class="quiz-result__skills">
                  <h4 class="quiz-result__skills-title">Чему вы научитесь:</h4>
                  <div class="quiz-result__skills-list">
                    <span v-for="skill in result?.skills" :key="skill" class="quiz-result__skill">
                      {{ skill }}
                    </span>
                  </div>
                </div>

                <div class="quiz-result__stats">
                  <div class="quiz-result__stat">
                    <span class="quiz-result__stat-value">{{ result?.duration }}</span>
                    <span class="quiz-result__stat-label">Длительность</span>
                  </div>
                  <div class="quiz-result__stat">
                    <span class="quiz-result__stat-value">{{ result?.level }}</span>
                    <span class="quiz-result__stat-label">Уровень</span>
                  </div>
                  <div class="quiz-result__stat">
                    <span class="quiz-result__stat-value">{{ result?.salary }}</span>
                    <span class="quiz-result__stat-label">Зарплата</span>
                  </div>
                </div>

                <div class="quiz-result__match">
                  <div class="quiz-result__match-label">Совпадение с профилем</div>
                  <div class="quiz-result__match-bar">
                    <div
                        class="quiz-result__match-fill"
                        :style="{ width: matchPercent + '%' }"
                    />
                  </div>
                  <span class="quiz-result__match-value">{{ matchPercent }}%</span>
                </div>

                <div class="quiz-result__actions">
                  <button class="quiz-btn quiz-btn--primary" @click="handleEnroll">
                    Записаться на курс
                  </button>
                  <button class="quiz-btn quiz-btn--secondary" @click="restartQuiz">
                    Пройти ещё раз
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
// ========================
// TYPES
// ========================
interface QuizOption {
  icon: string
  label: string
  hint?: string
  scores: Partial<Record<string, number>>
}

interface QuizQuestion {
  title: string
  description?: string
  options: QuizOption[]
}

interface QuizResult {
  id: string
  badge: string
  title: string
  description: string
  skills: string[]
  duration: string
  level: string
  salary: string
  color: string
}

// ========================
// PROPS & EMITS
// ========================
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  enroll: [result: QuizResult]
}>()

// ========================
// STATE
// ========================
const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

type StepType = 'start' | 'quiz' | 'loading' | 'result'
const step = ref<StepType>('start')
const currentQuestion = ref(0)
const selectedAnswer = ref<number | null>(null)
const scores = ref<Record<string, number>>({})
const result = ref<QuizResult | null>(null)
const matchPercent = ref(0)

// ========================
// QUESTIONS DATA
// ========================
const questions = ref<QuizQuestion[]>([
  {
    title: 'Что тебя больше всего увлекает?',
    description: 'Выбери то, что откликается больше всего',
    options: [
      {
        icon: '🎨',
        label: 'Визуальный дизайн и интерфейсы',
        hint: 'Красивые сайты, анимации, UI/UX',
        scores: { frontend: 3, design: 2 }
      },
      {
        icon: '⚙️',
        label: 'Логика и архитектура систем',
        hint: 'Базы данных, API, серверная часть',
        scores: { backend: 3, devops: 1 }
      },
      {
        icon: '📊',
        label: 'Анализ данных и закономерности',
        hint: 'Статистика, прогнозы, машинное обучение',
        scores: { datascience: 3, backend: 1 }
      },
      {
        icon: '🎮',
        label: 'Игры и интерактивные миры',
        hint: 'Геймплей, графика, физика',
        scores: { gamedev: 3, frontend: 1 }
      },
      {
        icon: '📱',
        label: 'Мобильные приложения',
        hint: 'iOS, Android, кроссплатформа',
        scores: { mobile: 3, frontend: 1 }
      }
    ]
  },
  {
    title: 'Как ты предпочитаешь видеть результат своей работы?',
    options: [
      {
        icon: '👀',
        label: 'Сразу вижу на экране',
        hint: 'Визуальная обратная связь',
        scores: { frontend: 3, gamedev: 2, mobile: 2 }
      },
      {
        icon: '📈',
        label: 'Через цифры и метрики',
        hint: 'Графики, отчёты, аналитика',
        scores: { datascience: 3, backend: 2 }
      },
      {
        icon: '🔧',
        label: 'Когда всё работает стабильно',
        hint: 'Надёжная инфраструктура',
        scores: { backend: 3, devops: 3 }
      },
      {
        icon: '🚀',
        label: 'Когда пользуются тысячи людей',
        hint: 'Масштаб и влияние',
        scores: { fullstack: 3, mobile: 2, devops: 1 }
      }
    ]
  },
  {
    title: 'Какой проект ты бы хотел создать?',
    options: [
      {
        icon: '🌐',
        label: 'Интернет-магазин с анимациями',
        scores: { frontend: 3, fullstack: 2 }
      },
      {
        icon: '🤖',
        label: 'Чат-бот с искусственным интеллектом',
        scores: { datascience: 3, backend: 2 }
      },
      {
        icon: '🏗️',
        label: 'Высоконагруженный сервис',
        scores: { backend: 3, devops: 2 }
      },
      {
        icon: '🎮',
        label: 'Инди-игру с уникальной механикой',
        scores: { gamedev: 3 }
      },
      {
        icon: '📲',
        label: 'Приложение для ежедневных привычек',
        scores: { mobile: 3, frontend: 1 }
      }
    ]
  },
  {
    title: 'Что для тебя важнее в работе?',
    options: [
      {
        icon: '✨',
        label: 'Творчество и креативность',
        scores: { frontend: 3, gamedev: 2, design: 2 }
      },
      {
        icon: '🧩',
        label: 'Решение сложных задач',
        scores: { backend: 3, datascience: 2, devops: 2 }
      },
      {
        icon: '📚',
        label: 'Постоянное обучение новому',
        scores: { datascience: 3, fullstack: 2 }
      },
      {
        icon: '💰',
        label: 'Высокий доход и востребованность',
        scores: { fullstack: 2, backend: 2, devops: 2, datascience: 1, mobile: 1 }
      }
    ]
  },
  {
    title: 'Какой язык/технологию ты бы хотел изучить?',
    options: [
      {
        icon: '💛',
        label: 'JavaScript / TypeScript',
        hint: 'Веб, фронтенд, фуллстек',
        scores: { frontend: 3, fullstack: 3, mobile: 2 }
      },
      {
        icon: '🐍',
        label: 'Python',
        hint: 'Data Science, AI, бэкенд',
        scores: { datascience: 3, backend: 2 }
      },
      {
        icon: '🦀',
        label: 'Rust / Go / C++',
        hint: 'Производительность, системы',
        scores: { backend: 3, gamedev: 2, devops: 1 }
      },
      {
        icon: '🎯',
        label: 'C# / Unity',
        hint: 'Разработка игр',
        scores: { gamedev: 3 }
      },
      {
        icon: '🐳',
        label: 'Docker / Kubernetes / Linux',
        hint: 'Инфраструктура и деплой',
        scores: { devops: 3, backend: 1 }
      }
    ]
  },
  {
    title: 'Как ты относишься к математике?',
    options: [
      {
        icon: '❤️',
        label: 'Обожаю! Алгебра и статистика — моё',
        scores: { datascience: 3, gamedev: 2, backend: 1 }
      },
      {
        icon: '🙂',
        label: 'Нормально, если нужно — разберусь',
        scores: { fullstack: 2, mobile: 2, devops: 2 }
      },
      {
        icon: '😐',
        label: 'Не фанат, но базовую помню',
        scores: { frontend: 2, design: 2 }
      },
      {
        icon: '😬',
        label: 'Предпочитаю избегать сложных формул',
        scores: { frontend: 1, design: 1, mobile: 1 }
      }
    ]
  }
])

// ========================
// RESULTS DATA
// ========================
const results: Record<string, QuizResult> = {
  frontend: {
    id: 'frontend',
    badge: '🎨',
    title: 'Frontend-разработчик',
    description:
        'Ты — творец интерфейсов! Тебе подойдёт путь Frontend-разработчика. Ты будешь создавать красивые, отзывчивые и интерактивные веб-приложения, которые люди любят использовать.',
    skills: ['HTML/CSS', 'JavaScript', 'Vue.js / React', 'TypeScript', 'Анимации', 'UI/UX основы'],
    duration: '8 месяцев',
    level: 'С нуля',
    salary: 'от 120 000 ₽',
    color: '#6366f1'
  },
  backend: {
    id: 'backend',
    badge: '⚙️',
    title: 'Backend-разработчик',
    description:
        'Ты — инженер систем! Backend-разработка — твой путь. Ты будешь проектировать серверную логику, работать с базами данных и создавать надёжные API.',
    skills: ['Python / Go / Java', 'SQL и NoSQL', 'REST & GraphQL', 'Микросервисы', 'Docker', 'Тестирование'],
    duration: '10 месяцев',
    level: 'С нуля',
    salary: 'от 150 000 ₽',
    color: '#0ea5e9'
  },
  fullstack: {
    id: 'fullstack',
    badge: '🚀',
    title: 'Fullstack-разработчик',
    description:
        'Ты — универсальный солдат! Fullstack-разработка позволит тебе создавать продукты от начала до конца — и фронтенд, и бэкенд.',
    skills: ['JavaScript/TypeScript', 'Vue.js / React', 'Node.js', 'Базы данных', 'DevOps основы', 'Архитектура'],
    duration: '12 месяцев',
    level: 'С нуля',
    salary: 'от 180 000 ₽',
    color: '#f59e0b'
  },
  datascience: {
    id: 'datascience',
    badge: '📊',
    title: 'Data Science / ML Engineer',
    description:
        'Ты — аналитик будущего! Data Science и машинное обучение — твоя стихия. Ты будешь находить скрытые закономерности в данных и создавать умные алгоритмы.',
    skills: ['Python', 'Статистика', 'Pandas & NumPy', 'Machine Learning', 'Нейросети', 'Визуализация данных'],
    duration: '12 месяцев',
    level: 'С нуля',
    salary: 'от 170 000 ₽',
    color: '#10b981'
  },
  mobile: {
    id: 'mobile',
    badge: '📱',
    title: 'Mobile-разработчик',
    description:
        'Ты — создатель мобильных продуктов! Разрабатывай приложения, которые люди носят в кармане каждый день.',
    skills: ['Swift / Kotlin', 'Flutter / React Native', 'UI/UX для мобильных', 'API интеграции', 'Публикация в сторах'],
    duration: '9 месяцев',
    level: 'С нуля',
    salary: 'от 140 000 ₽',
    color: '#8b5cf6'
  },
  gamedev: {
    id: 'gamedev',
    badge: '🎮',
    title: 'Game Developer',
    description:
        'Ты — создатель миров! GameDev позволит тебе превращать идеи в интерактивные игровые вселенные.',
    skills: ['C# / C++', 'Unity / Unreal Engine', '3D-математика', 'Физика игр', 'Графика и шейдеры', 'Геймдизайн'],
    duration: '12 месяцев',
    level: 'С нуля',
    salary: 'от 130 000 ₽',
    color: '#ef4444'
  },
  devops: {
    id: 'devops',
    badge: '🐳',
    title: 'DevOps-инженер',
    description:
        'Ты — архитектор инфраструктуры! DevOps — это про автоматизацию, надёжность и скорость доставки кода в продакшн.',
    skills: ['Linux', 'Docker & Kubernetes', 'CI/CD', 'Terraform', 'Мониторинг', 'Облачные платформы'],
    duration: '10 месяцев',
    level: 'С базовыми знаниями',
    salary: 'от 160 000 ₽',
    color: '#06b6d4'
  }
}

// ========================
// COMPUTED
// ========================
const progressPercent = computed(() => {
  return ((currentQuestion.value + 1) / questions.value.length) * 100
})

const isLastQuestion = computed(() => {
  return currentQuestion.value === questions.value.length - 1
})

// ========================
// METHODS
// ========================
function closeModal() {
  isOpen.value = false
  setTimeout(resetQuiz, 300)
}

function startQuiz() {
  step.value = 'quiz'
  currentQuestion.value = 0
  selectedAnswer.value = null
  scores.value = {}
}

function selectAnswer(idx: number) {
  selectedAnswer.value = idx
}

function nextQuestion() {
  if (selectedAnswer.value === null) return

  // Добавляем очки
  const option = questions.value[currentQuestion.value].options[selectedAnswer.value]
  for (const [key, value] of Object.entries(option.scores)) {
    scores.value[key] = (scores.value[key] || 0) + value
  }

  if (isLastQuestion.value) {
    showLoading()
  } else {
    currentQuestion.value++
    selectedAnswer.value = null
  }
}

function showLoading() {
  step.value = 'loading'
  setTimeout(() => {
    calculateResult()
    step.value = 'result'
  }, 2000)
}

function calculateResult() {
  // Находим сферу с максимальным количеством очков
  let maxScore = 0
  let bestMatch = 'frontend'

  for (const [key, score] of Object.entries(scores.value)) {
    if (score > maxScore) {
      maxScore = score
      bestMatch = key
    }
  }

  // Если нет очков (на всякий случай)
  if (maxScore === 0) {
    bestMatch = 'fullstack'
  }

  result.value = results[bestMatch] || results.frontend

  // Рассчитываем процент совпадения
  const totalPossible = questions.value.length * 3 // максимум 3 очка за вопрос
  matchPercent.value = Math.min(Math.round((maxScore / totalPossible) * 100) + 30, 98)
}

function restartQuiz() {
  resetQuiz()
  step.value = 'start'
}

function resetQuiz() {
  step.value = 'start'
  currentQuestion.value = 0
  selectedAnswer.value = null
  scores.value = {}
  result.value = null
  matchPercent.value = 0
}

function handleEnroll() {
  if (result.value) {
    emit('enroll', result.value)
  }
  closeModal()
}
// Блокировка скролла при открытой модалке
 
</script>

<style scoped>
/* ========================
   BACKDROP
   ======================== */
.quiz-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* ========================
   MODAL
   ======================== */
.quiz-modal {
  position: relative;
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
      0 25px 60px rgba(0, 0, 0, 0.5),
      0 0 100px rgba(99, 102, 241, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  padding: 40px 36px;
  color: #e2e8f0;
}

/* Закрыть */
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

.quiz-close:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #e2e8f0;
  transform: rotate(90deg);
}

/* ========================
   SCREENS
   ======================== */
.quiz-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ========================
   START SCREEN
   ======================== */
.quiz-start {
  text-align: center;
  padding: 20px 0;
}

.quiz-start__icon {
  font-size: 64px;
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.quiz-start__title {
  font-size: 28px;
  line-height: 100%;
  font-weight: 700;
  margin: 0 0 12px;
  background: linear-gradient(135deg, #818cf8, #6366f1, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.quiz-start__subtitle {
  font-size: 16px;
  color: #94a3b8;
  margin: 0 0 28px;
  line-height: 1.6;
}

.quiz-start__features {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 32px;
}

.quiz-start__feature {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 50px;
  font-size: 14px;
  color: #cbd5e1;
}

.quiz-start__feature-icon {
  font-size: 16px;
  
  @media screen and (max-width: 500px) {
    display: none;
  }
}

/* ========================
   QUESTION SCREEN
   ======================== */
.quiz-question {
  width: 100%;
}

.quiz-question__header {
  width: 100%;
  margin-bottom: 28px;
}

.quiz-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media screen and (max-width: 500px) {
      max-width: 80%;
  }
}

.quiz-progress__bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  overflow: hidden;
}

.quiz-progress__fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #a78bfa);
  border-radius: 10px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.quiz-progress__text {
  font-size: 13px;
  color: #64748b;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.quiz-question__title {
  font-size: 22px;
  font-weight: 700;
  line-height: 100%;
  margin: 0 0 8px;
  color: #f1f5f9;
  text-align: center;
}

.quiz-question__desc {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 24px;
  text-align: center;
}

.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-bottom: 24px;
}

/* ========================
   OPTION CARD
   ======================== */
.quiz-option {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1.5px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  color: #e2e8f0;
  position: relative;
  overflow: hidden;
  animation: optionAppear 0.4s ease both;
}

@keyframes optionAppear {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.quiz-option::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(167, 139, 250, 0.08));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.quiz-option:hover {
  border-color: rgba(99, 102, 241, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.15);
}

.quiz-option:hover::before {
  opacity: 1;
}

.quiz-option--selected {
  border-color: rgba(99, 102, 241, 0.6);
  background: rgba(99, 102, 241, 0.1);
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.15);
}

.quiz-option--selected::before {
  opacity: 1;
}

.quiz-option__icon {
  font-size: 28px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  
  @media screen and (max-width:500px) {
    display: none;
  }
}

.quiz-option__content {
  flex: 1;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.quiz-option__label {
  font-size: 15px;
  font-weight: 600;
  color: #f1f5f9;
}

.quiz-option__hint {
  font-size: 12px;
  color: #64748b;
}

.quiz-option__check {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.quiz-option--selected .quiz-option__check {
  border-color: #6366f1;
  background: #6366f1;
  color: white;
}

/* ========================
   BUTTONS
   ======================== */
.quiz-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 32px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.quiz-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.quiz-btn:hover::after {
  opacity: 1;
}

.quiz-btn--primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
}

.quiz-btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.5);
}

.quiz-btn--primary:active {
  transform: translateY(0);
}

.quiz-btn--next {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  width: 100%;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.quiz-btn--next:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none;
}

.quiz-btn--next:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.45);
}

.quiz-btn--secondary {
  background: rgba(255, 255, 255, 0.06);
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.quiz-btn--secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
}

/* ========================
   LOADING SCREEN
   ======================== */
.quiz-loading {
  padding: 60px 0;
  text-align: center;
}

.quiz-loading__spinner {
  width: 80px;
  height: 80px;
  position: relative;
  margin-bottom: 24px;
}

.quiz-loading__circle {
  width: 100%;
  height: 100%;
  border: 3px solid rgba(99, 102, 241, 0.15);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.quiz-loading__text {
  font-size: 16px;
  color: #94a3b8;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* ========================
   RESULT SCREEN
   ======================== */
.quiz-result {
  text-align: center;
  padding: 10px 0;
  width: 100%;
}

.quiz-result__badge {
  font-size: 56px;
  margin-bottom: 8px;
  animation: resultBadge 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes resultBadge {
  from {
    opacity: 0;
    transform: scale(0.3) rotate(-20deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

.quiz-result__title {
  font-size: 26px;
  line-height: 100%;
  font-weight: 800;
  margin: 0 0 12px;
  background: linear-gradient(135deg, #818cf8, #a78bfa, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: resultTitle 0.6s 0.15s ease both;
}

@keyframes resultTitle {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.quiz-result__description {
  font-size: 15px;
  color: #94a3b8;
  line-height: 1.7;
  margin: 0 0 24px;
  animation: resultTitle 0.6s 0.3s ease both;
}

.quiz-result__skills {
  width: 100%;
  margin-bottom: 24px;
  animation: resultTitle 0.6s 0.4s ease both;
}

.quiz-result__skills-title {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  margin: 0 0 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.quiz-result__skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.quiz-result__skill {
  padding: 6px 14px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 50px;
  font-size: 13px;
  color: #a5b4fc;
  font-weight: 500;
}

.quiz-result__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 100%;
  margin-bottom: 24px;
  animation: resultTitle 0.6s 0.5s ease both;
  
  @media screen and (max-width: 500px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

.quiz-result__stat {
  padding: 16px 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.quiz-result__stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #f1f5f9;
}

.quiz-result__stat-label {
  font-size: 12px;
  color: #64748b;
}

.quiz-result__match {
  width: 100%;
  margin-bottom: 28px;
  animation: resultTitle 0.6s 0.6s ease both;
}

.quiz-result__match-label {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
  display: block;
}

.quiz-result__match-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 6px;
}

.quiz-result__match-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #a78bfa);
  border-radius: 10px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.quiz-result__match-value {
  font-size: 13px;
  color: #a5b4fc;
  font-weight: 600;
}

.quiz-result__actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  animation: resultTitle 0.6s 0.7s ease both;
}

/* ========================
   TRANSITIONS
   ======================== */
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.35s ease;
}

.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

.modal-content-enter-active {
  animation: modalIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.modal-content-leave-active {
  animation: modalIn 0.3s ease reverse both;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Question transitions */
.question-enter-active {
  animation: questionIn 0.45s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.question-leave-active {
  animation: questionIn 0.25s ease reverse both;
}

@keyframes questionIn {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.question-move {
  transition: all 0.4s ease;
}

/* Result transition */
.result-enter-active {
  animation: resultIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes resultIn {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ========================
   SCROLLBAR
   ======================== */
.quiz-modal::-webkit-scrollbar {
  width: 4px;
}

.quiz-modal::-webkit-scrollbar-track {
  background: transparent;
}

.quiz-modal::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

/* ========================
   RESPONSIVE
   ======================== */
@media (max-width: 640px) {
  .quiz-modal {
    padding: 32px 20px;
    border-radius: 20px;
    max-height: 95vh;
  }

  .quiz-start__title {
    font-size: 24px;
    line-height: 100%;
  }

  .quiz-question__title {
    font-size: 19px;
  }

  .quiz-result__title {
    font-size: 22px;
  }

  .quiz-result__stats {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .quiz-result__stat {
    padding: 12px 6px;
  }

  .quiz-result__stat-value {
    font-size: 14px;
  }

  .quiz-option {
    padding: 14px 16px;
  }
}
</style>