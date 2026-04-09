<template>
  <section class="about" ref="about">
    <h2 class="about_title">
      <span class="label">NEW MISSION</span>
      <span class="text">
                {{ TITLE }}
            </span>
    </h2>

    <div class="bottom">
      <div class="video"></div>

      <div class="descriptions">
        <p>Помогаем перейти на новый грейд, выстроив индивидуальный план развития под Ваши задачи</p>
        <p>Скорость и качество обучения увеличивается до 78%* вместе с ментором</p>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Регистрируем плагин
gsap.registerPlugin(ScrollTrigger)
const TITLE = 'Учитесь с личным IT-тренером — каждое занятие, от изучения сложных тем до подготовки к собеседованию, проходит с ментором'



</script>

<style lang="scss" scoped>
.about {
  display: grid;
  grid-template-columns: 80%;
  justify-content: start;
  align-items: start;
  height: 100%;
 

  &_title {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    font-size: 10rem;
    line-height: 10rem;

    @media screen and (max-width: 767px) {
      font-size: 6rem;
    }
  }

  @media screen and (max-width: 1024px) {
    grid-template-columns: 100%;
  }
}

.descriptions {
  display: grid;
  grid-template-columns: 50% 50%;
  color: #CBD5E1;

  & p {
    overflow: hidden;
    height: 10rem;

    @media screen and (max-width: 1024px){
      height: max-content;

      &:first-child {
        grid-area: first;
      }

      &:last-child {
        grid-area: second;
      }
    }
  }

  @media screen and (max-width: 1024px) {
    grid-template-areas:
            "first ."
            ". second";
  }

  @media screen and (max-width: 767px) {
    font-size: 4rem;
  }
}

.bottom {
  display: grid;
  grid-template-columns: 30rem 54rem;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  font-size: 2rem;

  @media screen and (max-width:1024px) {
    grid-template-columns: 100%;
    font-size: 6rem;
  }
}
.label {
  position: absolute;
  top: 0%;
  left: 0;
  font-size: 2rem;
}

.text {
  text-indent: 18rem;
}
</style>