<template>
  <div  @click.capture class="card" :style="{backgroundImage: `url(${background})`}">
    <div class="content">
      <h4 v-if="title" class="title">{{ title }}</h4>
    </div>
    <div v-if="description" class="content">
      <p class="description" v-html="description"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import image1 from '../../public/assets/1.png';
import image2 from '../../public/assets/2.png';
import image3 from '../../public/assets/3.png';
import image4 from '../../public/assets/4.png';

interface IProps {
  title?: string
  description?: string
  image: string
}
const {title = null, description = null, image} = defineProps<IProps>()

const IMAGES: Record<string, string> = {
  image1,
  image2,
  image3,
  image4
};

const background = computed(() => IMAGES[image])

function test() {
  console.log(123);
}
</script>

<style lang="scss" scoped>


.card {
  pointer-events: auto !important;
  visibility: visible;
  position: absolute;
  left: 50%;
  display: grid;
  align-items: end;
  grid-template-rows: max-content 1fr;
  padding: 2rem;
  text-transform: uppercase;
  background-position: bottom;
  text-align: center;
  width: 40rem;
  height: 100%;
  background: #fff;
  background-size: cover;
  border-radius: 1.6rem;
  text-align: center;
  box-shadow:
      0 10px 30px rgba(0,0,0,0.18);
  transform: translateX(-50%);
  background-size: contain;
  background-repeat: no-repeat;
  
  @media screen and (max-width:1024px) {
    position: static;
    transform: unset;
    width: 90%;
    background-position: center;
  }
}

.content {
  display: grid;
  row-gap: 1rem;
  background: #fff;
  padding: 2rem;
  border-radius: 1rem;
  backdrop-filter: blur(1px);
  background: rgba(255,255,255,0.85);
  border-radius: 16px;
  box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.6);
}

.description {
  font-size: 1.6rem;
  margin: 0;

  @media screen and (max-width:1024px) {
    font-size: 2.6rem;
  }
}

.title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;

  @media screen and (max-width:1024px) {
    font-size: 3rem;
  }
}

.wrap {
  position: relative;
  display: grid;
  grid-template-rows: 30rem 1fr;
  height: 100%;
  background-color: #fff;
}

:deep(.swiper-cube .swiper-slide) {
  pointer-events: auto !important;
}
</style>