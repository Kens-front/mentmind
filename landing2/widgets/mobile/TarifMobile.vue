<template>
  <div class="tarif-mobile">
    <h3 class="title">Тарифы</h3>
    <swiper
        :effect="'coverflow'"
        :grabCursor="true"
        :centeredSlides="true"
        :slidesPerView=1.1
        watch-slides-progress
        :lazy-preload-prev-next="1"
        observer
        observe-parents
        :coverflowEffect="{
      rotate: 50,
      stretch: 0,
      depth: 200,
      modifier: 1,
    }"
        :modules="[EffectCoverflow]"
        class="mySwiper"
    >
      <SwiperSlide v-for="slide of cards" :key="slide.title">
        <TarifCard :tarif="slide"/>
      </SwiperSlide>
    </swiper>
  </div>
 
</template>
<script setup lang="ts">
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';

// Import Swiper styles
import 'swiper/css';

import 'swiper/css/effect-coverflow';

// import required modules
import { EffectCoverflow } from 'swiper/modules';
import TarifCard from "~/components/TarifCard.vue";
import {ref} from "vue";
import {ELessonPrices} from "~~/types";


const group = ref(ELessonPrices.GROUP)
const  base = ref( ELessonPrices.BASE )
const top = ref(ELessonPrices.PREMIUM)

const cards = computed(() => [
  {
    percent: Math.ceil(100 - ELessonPrices.GROUP / 2400 * 100),
    title: 'Групповой',
    oldPrice: 2400,
    newPrice: group.value,
    features: [
      'Полный доступ ко всем материалам и инструментам платформы',
      'Мини-группы до 2 человек: максимум внимания при оптимальной цене',
      'Чёткая программа с опытным ментором — видимый прогресс с первых занятий',
      'Общий чат поддержки: разбираем вопросы и закрепляем материал между встречами',
      'Идеально для системного старта и регулярной практики без переплат',
    ],
  },
  {
    percent: Math.ceil(100 - ELessonPrices.BASE / 3600 * 100),
    title: 'Базовый',
    oldPrice: 3600,
    newPrice: base.value,
    features: [
      'Всё из «Группового» + персональная дорожная карта под ваши цели',
      'Индивидуальные занятия 1-на-1 с проверенным ментором',
      'Глубокая проверка заданий с развёрнутой обратной связью (без спешки и жёстких дедлайнов)',
      'Гибкий график: возможен перенос занятия по согласованию с центром',
      '🎁 При покупке от 10 занятий — 1 сессия с психологом-коучем',
    ],
  },
  {
    percent: Math.ceil(100 - ELessonPrices.PREMIUM / 4500 * 100),
    title: 'Продвинутый',
    oldPrice: 4500,
    newPrice: top.value,
    features: [
      'Всё из «Базового» + работа с топ-менторами (рейтинг 4.9+, подтверждённые кейсы)',
      'Личный чат с ментором: ответы на вопросы в течение 2 часов в рабочее время',
      'Стратегическое планирование на 3–6 месяцев и фокус на сложных, долгосрочных целях',
      'Еженедельный трек-ревью прогресса и быстрая корректировка плана под результат',
      '🎁 При покупке от 10 занятий — 2 сессии с психологом-коучем + экспертный разбор вашего портфолио/проекта',
    ],
  },
])
</script>

<style lang="scss" scoped>
.tarif-mobile {
  padding: 6rem 2rem 8rem;
}

.title {
  font-size: 8rem;
  font-weight: 700;
  margin-bottom: 10rem;
  text-align: center;
}

.mySwiper {
  color: #2D1B4A;
  padding: 4rem 0;
}
</style>