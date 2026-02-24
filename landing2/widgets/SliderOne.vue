<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectCube, Pagination } from 'swiper/modules'; 
import Arrow from '~/components/Arrow.vue';
import 'swiper/css';

import 'swiper/css/effect-cube';
import 'swiper/css/pagination';
 
const props = defineProps(['slider', 'type'])

const isDoom = ref(false)
const THEMES_CSS = {
  light: 'light',
  darK: 'dark',
};

</script>

<template>
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
        <div class="wrap" :class="type">
          <div class="image" :class="{invert: type === 'light'}">
            <img :src="slide.image" alt="">
          </div>
          <div class="slide">
            <h3 class="title">{{ slide.title }}</h3>
            <p class="description">{{ slide.description }}</p>
          </div>
        </div>
      </SwiperSlide>

      <SwiperSlide v-if="type === 'light'">
        <div class="wrap" :class="type">
          <div class="slide doom">
            <h3 class="title">Научим запускать DOOM даже в кнопке</h3>

            <div @click="isDoom = true" class="button">

              <transition name="fade" mode="out-in">
                <span v-if="!isDoom" :key="`${isDoom}`">Запустить DOOM</span>
                <iframe v-else src="https://js-dos.com/games/doom.exe.html" width="1780" height="900" framemborder="0" scrolling="yes" allowfullscreen>
                </iframe>
              </transition>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>

    <Arrow/>
  </client-only>
 
</template>

<style lang="scss" scoped>

.my-swiper {
    width: 100%;
}

.red {
    width: 100%;
    height: 100%;
 
}

.yellow {
    width: 100%;
    height: 100%;
 
}

.green {
    width: 100%;
    height: 100%;
 
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

.wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.light {
  & .title {
    color: #2D1B4A;
  }

  & .description {
    color: #4A4A4A;
  }
}

.dark {
  & .title {
    color: #E0D6FF;
  }

  & .description {
    color: #CBD5E1;
  }
}

.title {
  font-size: 10rem;
    text-transform: uppercase;
    font-weight: 700;
    max-width: 55%;
    line-height: 100%;

    @media screen and (max-width: 767px) {
      max-width: 80%;
      font-size: 8rem;
    }
}

.description {
  font-size: 2.6rem;
  max-width: 60%;

  @media screen and (max-width: 767px) {
      font-size: 3.6rem;
      max-width: 80%;
    }
}

.image {
  position: absolute;
  top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.1;

    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: bottom;
    }
}

.invert {
  & img {
    filter: invert(1);
  }
}

.doom {
  grid-template-columns: 1fr max-content;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.button {
  background: #2d1b4a;
  color: #fff;
  padding: 1rem 2rem;
  border-radius: 2rem;

  @media screen and (max-width: 768px) {
    width: max-content;
  }

  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>