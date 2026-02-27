<template>
  <div class="vertical-container">
    <swiper
        :effect="'creative'"
        :autoplay="{ delay: 2000, disableOnInteraction: false }"
        nested
        :creativeEffect="{
          prev: {
            shadow: true,
            translate: [0, 0, -400],
          },
          next: {
            translate: ['100%', 0, 0],
          },
        }"
        :modules="[EffectCreative]"
        class="mySwiper"
        @slideChange="onChange"
    >
      <swiper-slide >
        <div @click.stop class="swiper-slide-v" :class="{hidden: activeSlide >= 1}" >
          <Frontend :items="frontendSkills" :achievments="frontendAchievments" title="Frontend-разработка" :text="frontTitle"/>
        </div>
      </swiper-slide>

      <swiper-slide >
        <div @click.stop class="swiper-slide-v" :class="{hidden: activeSlide >= 2}"  >
          <Frontend :items="contentsBack" :achievments="backendAchievments" title="Backend-разработка" :text="backTitle"/>
        </div>
      </swiper-slide>
      <swiper-slide >
        <div @click.stop class="swiper-slide-v"  >
          <Frontend :items="contentsArch" :achievments="architectureAchievments" title="Системная архитектура" :text="archTitle"/>
        </div>
      </swiper-slide>

      >
    </swiper>
  </div>

</template>
<script setup lang="ts">
import {contentsBack, frontendSkills, frontendAchievments, contentsArch, backTitle, backendAchievments, archTitle, architectureAchievments, frontTitle} from "~/constnats/directionts";
import {Swiper, SwiperSlide} from "swiper/vue";
import {EffectCreative} from "swiper/modules";

import 'swiper/css';
import 'swiper/css/effect-creative'
import Frontend from "~/components/Directions/Frontend.vue";

const activeSlide = ref(0)
function onChange(swiper: any) {
  activeSlide.value = swiper.activeIndex
}
</script>

<style lang="scss" scoped>

.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;

  /* Center slide text vertically */
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.swiper-slide-v {
  display: grid;
  width: 100%;
  height: 100%;}

.vertical-container {
  height: 100%;
  width: 100%;

  & .direction_items {
    padding: 0;
  }

  & .direction_card {
    max-width: 100%;
  }
 
}

.hidden {
  opacity: 0;
}
</style>