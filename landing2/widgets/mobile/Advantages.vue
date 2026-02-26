<template>
  <swiper
      :style="{
      '--swiper-navigation-color': '#fff',
      '--swiper-pagination-color': '#fff',
    }"
      :speed="600"
      :parallax="true"
      :pagination="{
      clickable: true,
    }"
      :navigation="true"
      :modules="modules"
      class="mySwiper"
  >
    <div
        slot="container-start"
        class="parallax-bg"
        :style="{
        'background-image':
          `url(${slides[0]?.image})`,
      }"
        data-swiper-parallax="-23%"
    ></div>
    <swiper-slide v-for="slide of slides" :key="slide.title">
      <div @click.stop="test">
        <div class="title" data-swiper-parallax="-300">{{slide.title}}</div>
        <div class="text" data-swiper-parallax="-200">
          <p>
            {{slide.description}}
          </p>
        </div>
      </div>
 
    </swiper-slide
    >
  </swiper>
</template>
<script>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';
 
 
// Import Swiper styles
import 'swiper/css';

import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Parallax, Pagination, Navigation } from 'swiper/modules';

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  
  props: {
    slides: {
      type: Array,
      default: () => [],
    }
  },
  setup() {
    return {
      modules: [Parallax, Pagination, Navigation],
    };
  },
  
  methods: {
    test() {  
      console.log('test');
    }
  }
};
</script>

<style scoped>
.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  font-size: 18px;
  color: inherit;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 40px 60px;
  
  @media screen and (max-width: 1024px) {
    padding: 12rem 1rem
  }
}

.parallax-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 130%;
  height: 100%;
  -webkit-background-size: cover;
  background-size: cover;
  background-position: center;
}

.swiper-slide .title {
  font-size: 41px;
  font-weight: 700;
  line-height: 100%;
}

.swiper-slide .subtitle {
  font-size: 21px;
}

.swiper-slide .text {
  font-size: 3.6rempx;
  max-width: 400px;
  margin-top: 4rem;
 
}

</style>