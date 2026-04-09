<script setup lang="ts">
import gsap from 'gsap';
import Loader from "~/components/Loader.vue";

const leftWord = 'MENT';
const rightWord = 'MIND';

const flap = ref(null);
const left = ref<HTMLElement | null>(null);
const right = ref<HTMLElement | null>(null);
const isLoaded = ref(false);
onMounted(async () => {
  const tl = gsap.timeline()
  await new Promise(resolve => setTimeout(resolve, 2000))
  if (!left.value || !right.value) {
    return;
  }
  
  const leftLetters = left.value.querySelectorAll('span');
  const rightLetters = right.value.querySelectorAll('span');
  const leftWord = left.value.querySelector('.left_image');
  const rightWord = right.value.querySelector('.right_image');
  
  tl.to(document.body, {overflow: 'hidden'});
  
  tl.
      to(leftWord, {display: 'flex'})
      .to(rightWord, {display: 'flex'})
  
  
  leftLetters.forEach(l => {
    if (l) {
      tl.fromTo(l, {opacity: 0}, {opacity: 1, duration: .3});
    }
  })
  isLoaded.value = true;
  rightLetters.forEach(l => {
    if (l) {
      tl.fromTo(l, {opacity: 0}, {opacity: 1,  duration: .3});
    }
  })
  tl
      .to(left.value, {translateX: '-100%'})
      .to(right.value, {translateX: '100%'}, '<')
      .to(flap.value, {opacity: 0}, '<')
      .to(document.body, {overflow: 'visible'})
      .to(flap.value, {display: 'none'}, '<')
})
</script>

<template>
  <transition name="fade" mode="out-in">
    <div v-if="!isLoaded" :key="`${isLoaded}`" class="load">
      <Loader/>
    </div>
  </transition>
 
  <div ref="flap" class="flap">
    <div ref="left" class="left">
      <div class="left_image">
        <span v-for="word of leftWord">{{word}}</span>
      </div>
    </div>
    <div  ref="right" class="right">
      <div class="right_image">
        <span v-for="word of rightWord">{{word}}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
 
.flap {
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  height: 100dvh;
  background: transparent;
  color: #E2E8F0;
  z-index: 123;

  
  &:after {
    position: absolute;
    z-index: 22;
    right: 0;
    width: 100%;
    height: 100%;
    content: '';
    display: block;
    background: url('../../public/assets/sky.png') no-repeat center/cover;
    mix-blend-mode: color-burn;
  }
}

.left, .right {
  overflow: hidden;
  position: relative;
  background-color:#2D1B4A;
  z-index: 10;
}

.left_image {
  justify-content: end;
}

.right_image {

}

.left_image, .right_image {
  display: none;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 25rem;

  @media screen and (max-width: 1024px) {
    font-size: 26rem;
  }

  @media screen and (max-width: 500px) {
    font-size: 12rem;
  }

  & span {
    animation: float 4s ease-in-out infinite;
  }

}

.load {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  height: 100vh;
  width: 100%;
  z-index: 124;
}
</style>