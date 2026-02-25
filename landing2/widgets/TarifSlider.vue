<template>
    <div class="slider">
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
      <SwiperSlide v-for="slide of slider" :key="slide.title">
            <TarifCard :tarif="slide"/>
      </SwiperSlide>
    </Swiper>

    <Arrow/>
  </client-only>
    </div>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectCube, Pagination } from 'swiper/modules'; 
import Arrow from '~/components/Arrow.vue';
import TarifCard from '~/components/TarifCard.vue';
import 'swiper/css';

import 'swiper/css/effect-cube';
import 'swiper/css/pagination';
    
const props = defineProps(['slider', 'type'])


const THEMES_CSS = {
    light: 'light',
    darK: 'dark',
};
    
</script>

<style lang="scss" scoped>
    .slider {
        display: none;

        @media screen and (max-width:1024px) {
            height: 100dvh;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 50vw;
            margin: 0 auto;
        }

        @media screen and (max-width:768px) {
            width: 90vw;
        }
    }

    .my-swiper {
    width: 100%;
}
</style>