<script setup lang="ts">
import {EffectCube, EffectFlip} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/vue";
import Loader from "../../app/components/Loader.vue";
import Arrow from "../../app/components/Arrow.vue";


const emits = defineEmits(['change']);
function onGetActiveIndex(swiper: any) {
  console.log(swiper)
  emits('change', swiper.activeIndex);
}
</script>

<template>
  <div class="mobile-ev">
    <div class="loader">
      <Loader/>  
    </div>
 
    <client-only>
      <Swiper
          @snapIndexChange="onGetActiveIndex"
          :modules="[EffectFlip]"
          :slides-per-view="1"
          navigation
          class="my-swiper"
          centeredSlided
          :effect="'flip'"
          :preloadImages="false"
          :speed="1000"
      >
      <slot/>
      </Swiper>
    </client-only>
    <Arrow/>
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
  
  & .swiper {
    // ✅ Принудительное использование GPU
    transform: translateZ(0);
    will-change: transform;  // Подсказка браузеру [[13]]

    .swiper-slide {
      // ✅ Оптимизация слайдов
      backface-visibility: hidden;  // Скрыть обратную сторону
      -webkit-backface-visibility: hidden;

      // ✅ Избегайте сложных стилей внутри слайда
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        // ✅ Предотвращение перерисовки
        transform: translateZ(0);
        will-change: transform;
      }
    }

    // ❌ Удалите или замените тяжёлые тени
    .swiper-cube-shadow {
      display: none !important;  // Полностью отключаем тень куба
    }
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

.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(2);
  filter: brightness(0.5);
}
</style>