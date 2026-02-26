<template>
  <div class="tarif-mobile">
    <h3 class="title">Тарифы</h3>
    <swiper
        :effect="'coverflow'"
        :grabCursor="true"
        :centeredSlides="true"
        :slidesPerView=1.1
        :coverflowEffect="{
      rotate: 50,
      stretch: 0,
      depth: 200,
      modifier: 1,
      slideShadows: true,
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



const group = ref(2400)
const  base = ref( 3600)
const top = ref(4500)

const cards = computed(() => [
  {
    percent: Math.ceil(100 - 1800 / 2400 * 100),
    title: 'Групповой',
    oldPrice: 2400,
    newPrice: group.value,
    features: [
      'Полный доступ ко всему функционалу платформы',
      'Занятия проходят с опытным ментором',
      'Небольшие группы — до 2 человек',
      'Живое общение и совместная работа',
      'Выгодный формат для старта и регулярной практики',
    ],
  },
  {
    percent: Math.ceil(100 - 2200 / 3600 * 100),
    title: 'Базовый',
    oldPrice: 3600,
    newPrice: base.value,
    features: [
      'Полный доступ ко всему функционалу платформы',
      'Индивидуальные занятия с персональным ментором',
      'Гибкий темп обучения под ваши цели',
      'Глубокая проработка запросов и обратная связь',
      '🎁 При покупке от 10 занятий — 1 сессия с психологом-коучем',
    ],
  },
  {
    percent: Math.ceil(100 - 4000 / 4500 * 100),
    title: 'Продвинутый',
    oldPrice: 4500,
    newPrice: top.value,
    features: [
      'Полный доступ ко всему функционалу платформы',
      'Индивидуальные занятия с премиальным ментором',
      'Максимальное внимание к результату и прогрессу',
      'Работа с более сложными и долгосрочными целями',
      '🎁 При покупке от 10 занятий — 2 сессии с психологом-коучем',
    ],
  },
])
</script>

<style lang="scss" scoped>
.tarif-mobile {
  padding: 2rem 2rem 8rem;
}

.title {
  font-size: 8rem;
  font-weight: 700;
  margin-bottom: 10rem;
  text-align: center;
}

.mySwiper {
  color: #2D1B4A;
}
</style>