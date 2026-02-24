<template>
    <div class="wrap">
        <client-only>
            <Swiper
                :modules="[EffectCube, Pagination]"
                :slides-per-view="1"
                navigation
                class="my-swiper"
                :effect="'cube'"
                loop
                :grabCursor="true"
                :cubeEffect="{
                shadow: true,
                slideShadows: true,
                shadowOffset: 20,
                shadowScale: 0.94,
            }"
            >
                <SwiperSlide v-for="slide of enrollmentStages" :key="slide.title">
                    <Card
                        v-bind="slide"
                    />
                </SwiperSlide>
            </Swiper>

            <Arrow/>
        </client-only>
    </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { nextTick, onMounted, ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectCube, Pagination } from 'swiper/modules'; 
import Arrow from '~/components/Arrow.vue';
import 'swiper/css';

import 'swiper/css/effect-cube';
import 'swiper/css/pagination';
 import Card from '../app/components/Card.vue';
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
</script>

<style lang="scss" scoped>
.wrap {
    display: grid;
    grid-template-columns: 100%;
}

.swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
}

.cards {
    position: relative;
    height: 55rem;
    width: 100%;
}

.my-swiper {
    width: 100%;
}

.slide {
  display: grid;
    grid-template-rows: max-content max-content;
    row-gap: 4rem;
    align-items: center;
    justify-content: center;
    max-width: 70%;

    @media screen and (max-width: 767px) {
      max-width: 90%;
    }
}







</style>