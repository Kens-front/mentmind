<template>
  <div class="Promo">
    <div class="text">
      <span class="subtitle" ref="subtitle">MentMinde</span>
      <h1 class="title" ref="title">
        <span class="word" ref="word1">Спрашивай</span>
        <span class="word" ref="word2"><span ref="label">By MentMind</span>Понимай</span>
        <span class="word" ref="word3">Расти</span>
        <span class="word" ref="word4">Вместе</span>
      </h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import { onMounted, ref } from "vue";
const props = defineProps(['aside'])

</script>

<style lang="scss" scoped>
.Promo {
  display: grid;
  background-color: inherit;

.subtitle {
  font-size: 5rem;
  color: #fff;
  margin-bottom: 2rem;
}

.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  position: relative;
  width: 100%;
  overflow: hidden;
  z-index: 10;
}

.word {
  display: flex;
  width: max-content;
  font-size: 22rem;
  white-space: nowrap;
  /* Убедись, что все слова выровнены одинаково */
  text-align: center;
  text-transform: uppercase;
  color: #E0D6FF;
  font-weight: 700;
  line-height: 90%;

  &:nth-child(2) {
    & span {
      font-size: 2rem;
      color: #fff;
    }
  }

  @media screen and (max-width: 500px) {
    font-size: 12rem;
  }
}

.video {
  background-color: blue;
}

.text {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  height: 100%;
}}

</style>
