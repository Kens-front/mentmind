<template>
  <transition name="fade" mode="out-in" >
    <div  v-if="enrollmentStages.length" :key="enrollmentStages.length" class="slide">
      <client-only>
        <div class="slide-wrap">
          <Swiper
              v-if="enrollmentStages.length"
              :slides-per-view="1"
              navigation
              class="my-swiper"
              :autoplay="{ delay: 2000, disableOnInteraction: false }"
              nested
              :thumbs="{ swiper: thumbsSwiper }"
              :modules="[FreeMode, Thumbs, Autoplay]"
          >
            <SwiperSlide v-for="slide of enrollmentStages"  >
              <StepMobileCard :title="slide.title" :description="slide.description" :image="slide.image" />
            </SwiperSlide>
          </Swiper>
        </div>
        
        <swiper
            v-if="enrollmentStages.length"
            @swiper="setThumbsSwiper"
            :loop="true"
            :spaceBetween="10"
            :slidesPerView="4"
            :freeMode="true"
            :modules="[FreeMode, Thumbs]"
            class="my-swiper"
        >
          <SwiperSlide v-for="slide of enrollmentStages"  >
            <StepMobileCard :image="slide.image" />
          </SwiperSlide>
        </swiper>

      </client-only>
    </div> 
  </transition>
 
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { nextTick, onMounted, ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';

import {Autoplay, FreeMode, Navigation, Thumbs} from 'swiper/modules';

import 'swiper/css';

import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
 
import StepMobileCard from "~~/widgets/mobile/StepMobileCard.vue";
// Регистрируем плагин
gsap.registerPlugin(ScrollTrigger)

const title = ref('первый шаг');
const text = ref('')

const index = ref(0);
const enrollmentStages = [
  {
    title: "Оставить заявку",
    description: "Заполните короткую форму и получите консультацию по обучению",
    image: 'image1',
  },
  {
    title: "Пробное занятие",
    description: "Пройдите <strong> бесплатное пробное занятие</strong> и оцените наш подход к обучению",
    image: 'image2',
  },
  {
    title: "Обсуждение цели",
    description: "Обсудите с ментором цели обучения и составьте персональный план",
    image: 'image3',
  },
  {
    title: "Приступить к обучению",
    description: "<strong>Начинате обучение</strong>, выполняйте задания и двигайтесь к результату",
    image: 'image4',
  }
];

const thumbsSwiper = ref(null);

const setThumbsSwiper = (swiper: any) => {
  console.log(swiper);
  thumbsSwiper.value = swiper;
};
</script>

<style lang="scss" scoped>
.swiper-slide {
  display: flex;
  align-items: center;
  justify-content: center;
}

.cards {
  position: relative;
  width: 100%;
}

.my-swiper {
  width: 100%;

  .swiper-cube {
    & .swiper-slide {
      .swiper-slide {
        pointer-events: auto;
      }
    }
  }
}

.slide {
  display: grid;
  grid-template-rows: 7fr 1fr;
  row-gap: 4rem;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  height: 80%;
  box-shadow: 0px 3px 30px #67287f;
  border-radius: 3rem;
}

.slide-wrap {
  display: grid;
  width: 100%;
  height: 100%
;
}
</style>