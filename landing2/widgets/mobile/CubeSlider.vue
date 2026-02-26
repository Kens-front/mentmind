<script setup lang="ts">
import {EffectCube, Pagination} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/vue";
import Arrow from "../../app/components/Arrow.vue";
 
const emits = defineEmits(['change']);
function onGetActiveIndex(swiper: any) {
  console.log(swiper)
  emits('change', swiper.activeIndex);
}
</script>

<template>
  <div class="mobile-ev">
    <client-only>
      <Swiper
          @slide-change="onGetActiveIndex"
          :modules="[EffectCube]"
          :slides-per-view="1"
          navigation
          class="my-swiper"
          centeredSlided
          loop
          :effect="'cube'"
          :cubeEffect="{
      shadow: true,
      slideShadows: true,
      shadowOffset: 20,
      shadowScale: 0.94,
    }"
      >
      <slot/>
      </Swiper>
    </client-only>
  </div>

</template>

<style scoped lang="scss">
.mobile-ev {
  position: relative;
  display: none;
  grid-auto-columns: 100%;
  width: 100%;
  padding: 5rem;

  @media screen and (max-width: 1024px) {
    display: grid;
    grid-auto-columns: 100%;
  }

  & .swiper {
    width: 100%;
  }
}

.wrap {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
 
</style>