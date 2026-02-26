<script setup lang="ts">
import {EffectCube, Pagination} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/vue";
 
import PromoMobile from "~~/widgets/mobile/PromoMobile.vue";
import AboutMobile from "~~/widgets/mobile/AboutMobile.vue";
import StepMobilt from "~~/widgets/mobile/StepMobilt.vue";
import SecondMobile from "~~/widgets/mobile/SecondMobile.vue";
import Advantages from "~~/widgets/mobile/Advantages.vue";
import CubeSlider from "~~/widgets/mobile/CubeSlider.vue";
import pattern from "~~/public/assets/паттерн.png";
import pattern2 from "~~/public/assets/pattern2.png";
import pattern3 from "~~/public/assets/pattern3.png";
import pattern4 from "~~/public/assets/pattern4.png";
import pattern5 from "~~/public/assets/pattern5.png";
import DirectionMobile from "~~/widgets/mobile/DirectionMobile.vue";
import StartMobile from "~~/widgets/mobile/StartMobile.vue";
 
import FormMobile from "~~/widgets/mobile/FormMobile.vue";
import TarifMobile from "~~/widgets/mobile/TarifMobile.vue";


const firstSlider = [
  {title: 'Программа под вас', description: 'Мы не заставляем всех учиться по одному шаблону. Ваша программа — адаптируется под цели, уровень и стиль мышления', image: pattern},
  {title: 'Учим мыслить как программист', description: 'Не просто синтаксис — а фундаментальное программное мышление, которое работает в веб-разработке, геймдеве, автоматизации и даже data science.', image: pattern2},
  {title: 'Бонус за вовлечённость', description: 'При покупке от 10 занятий — предоставляется одна психологическая сессия в месяц для разгруза, поддержки и повышения мотивации.', image: pattern3}
]

const secondSlider = [
  {title: 'Выбирайте формат', description: 'Индивидуальные занятия 👤 для полного погружения или мини‑группа 👥 до 2 человек — для идей и роста.',  image: pattern3},
  {title: 'Всё в одном месте', description: 'Расписание, материалы, домашки, прогресс — в одном окне. Без хаоса и лишних писем.',  image: pattern4},
  {title: 'Портфолио с первого месяца', description: 'Уже через 3–4 занятия сделаете реальные проекты: бот, мини‑игра, веб‑приложение. То, что откроет двери в профессию.',  image: pattern5}
]

const secondSliderRef = ref<HTMLElement | null>(null)
const observer = ref<IntersectionObserver | null>(null)
const isSecondSliderVisible = ref(false)
const isLight = ref(false);
const callback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      console.log('Пользователь почти докрутил до картинки!')
      isLight.value = true;
    }
    else {
      console.log('вернулся обратно!')
      isLight.value = false;
    }
 
  })
}

const options = {
  // root: по умолчанию window,
  // но можно задать любой элемент-контейнер
  rootMargin: '0px 0px 75px 0px',
  threshold: 0.5,
}

 

onMounted(async () => {
  await nextTick(async () => {})
  observer.value = new IntersectionObserver(callback, options)
 
  observer.value.observe(secondSliderRef.value)
  console.log(secondSliderRef.value);
})
</script>

<template>
  <div class="mobile-v" :class="{'mobile-v__active': isLight}">
    
    <StartMobile/>
    <client-only>
      <CubeSlider>
        <SwiperSlide>
          <div class="wrap">
            <PromoMobile/>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div class="wrap">
            <SecondMobile/>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div class="wrap">
            <AboutMobile /> 
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div class="wrap">
            <Advantages :slides="firstSlider"/>
          </div>
        </SwiperSlide>
      </CubeSlider>
 
      <div ref="secondSliderRef">
        <CubeSlider>
          <SwiperSlide>
            <div class="wrap">
              <Advantages :slides="firstSlider"/>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div class="wrap">
              <StepMobilt/>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div class="wrap">
              <DirectionMobile/>
            </div>
          </SwiperSlide>
        </CubeSlider>
      </div>


      <TarifMobile/>

      <FormMobile/>
    </client-only>   
  </div>
 
</template>

<style scoped lang="scss">
.mobile-v {
  position: relative;
  overflow-x: hidden;
  display: none;
  grid-auto-columns: 100%;
  width: 100%;
  background-color: #12121A;
  color: #E0D6FF;;
  transition: background-color .3s ease-in-out;
  &__active {
    background-color: #F9FAFC;
    color: #2D1B4A;
  }
  
  @media screen and (max-width: 1024px) {
    display: grid;
    grid-auto-columns: 100%;
  }
  
  & .swiper {
    width: 100%;
  }

  &:before{
    content:"";
    position:absolute;
    inset:0%;
    background:
        radial-gradient(
          circle at 20% 30%,
          rgba(64, 224, 192, 0.24),   /* мятный */
          transparent 30%
        ),
        radial-gradient(
          circle at 70% 20%,
          rgba(138, 102, 255, 0.20), /* фиолетовый */
          transparent 28%
        ),
        radial-gradient(
          circle at 60% 80%,
          rgba(64, 224, 192, 0.32),
          transparent 34%
        );
    filter: blur(18px);
    opacity: 0.9;
    pointer-events: none;
    animation: aura-color .7s ease-in-out infinite;
  }
}

.wrap {
  min-height: 100dvh;
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes aura-color {
  0%, 100% {
    filter: blur(18px) hue-rotate(0deg);
  }
  50% {
    filter: blur(18px) hue-rotate(25deg);
  }
}
</style>