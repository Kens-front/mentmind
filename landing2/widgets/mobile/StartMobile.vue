<script setup lang="ts">
import gsap from 'gsap';

const leftWord = 'MENT';
const rightWord = 'MIND';

const flap = ref(null);
const left = ref<HTMLElement | null>(null);
const right = ref<HTMLElement | null>(null);
onMounted(() => {
  const tl = gsap.timeline()
  
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
      tl.fromTo(l, {opacity: 0}, {opacity: 1});
    }
  })

  rightLetters.forEach(l => {
    if (l) {
      tl.fromTo(l, {opacity: 0}, {opacity: 1});
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
  <div ref="flap" class="flap">
    <div ref="left" class="left">
      <div class="left_image">
        <span v-for="word of leftWord">{{word}}</span>
      </div>
    </div>
    <div ref="right" class="right">
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
</style>