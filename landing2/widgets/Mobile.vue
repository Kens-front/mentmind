<script setup lang="ts">
import {EffectCube, Pagination} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/vue";
 
import PromoMobile from "~~/widgets/mobile/PromoMobile.vue";
 
import StepMobilt from "~~/widgets/mobile/StepMobilt.vue";
 
 
 
import pattern from "~~/public/assets/паттерн.png";
import pattern2 from "~~/public/assets/pattern2.png";
import pattern3 from "~~/public/assets/pattern3.png";
import pattern4 from "~~/public/assets/pattern4.png";
import pattern5 from "~~/public/assets/pattern5.png";
import DirectionMobile from "~~/widgets/mobile/DirectionMobile.vue";
import StartMobile from "~~/widgets/mobile/StartMobile.vue";

 
import { ref } from "vue";
import QA from "~~/widgets/QA.vue";
import Proofs from "~~/widgets/Proofs.vue";

const TarifMobile = defineAsyncComponent({
  loader: () => import('~~/widgets/mobile/TarifMobile.vue'),
  delay: 200,
  timeout: 1000
})

const FormMobile = defineAsyncComponent({
  loader: () => import('~~/widgets/mobile/FormMobile.vue'),
  delay: 200,
  timeout: 1000
})

const Advantages = defineAsyncComponent({
  loader: () => import('~~/widgets/mobile/Advantages.vue'),
  delay: 200,
  timeout: 1000
})
const SecondMobile = defineAsyncComponent({
  loader: () => import('~~/widgets/mobile/SecondMobile.vue'),
  delay: 200,
  timeout: 1000
})
const AboutMobile = defineAsyncComponent({
  loader: () => import('~~/widgets/mobile/AboutMobile.vue'),
  delay: 200,
  timeout: 1000
})
const CubeSlider = defineAsyncComponent({
  loader: () => import('~~/widgets/mobile/CubeSlider.vue'),
  delay: 200,
  timeout: 1000
})

const firstSlider = [
  {title: 'Программа под вас', description: 'Мы не заставляем всех учиться по одному шаблону. Ваша программа адаптируется под цели, уровень и стиль мышления', image: pattern},
  {title: 'Работаем с любым уровнем', description: 'Вы получите мощную прокачку навыков, вне зависимости от того, с 0 вы решили погрузиться в профессию или уже имеете определённый опыт', image: pattern4},
  {title: 'Учим мыслить как программист', description: 'Изучаем не просто синтаксис, а фундаментальное программное мышление, которое работает в веб-разработке, геймдеве, автоматизации и даже data science.', image: pattern2},
  {title: 'Бонус за вовлечённость', description: 'При покупке от 10 занятий — предоставляется одна психологическая сессия в месяц для разгруза, поддержки и повышения мотивации.', image: pattern3}
]

const secondSlider = [
  {title: 'Выбирайте формат', description: 'Индивидуальные занятия 👤 для полного погружения или мини‑группа 👥 из 2 человек — для идей и роста.',  image: pattern3},
  {title: 'Предлагаем широкий спектр', description: 'Готовим к собеседованиям, тестим знания, оттачиваем необходимые темы',  image: pattern4},
  {title: 'Делаем Вас конкурентными на рынке', description: 'Никакой ИИ и близко не заменит Вас',  image: pattern5}
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


const activeSlideIndex = ref(0)

function onChange(index: number) {
  activeSlideIndex.value = index
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
      <CubeSlider @change="onChange" :currentIndex="activeSlideIndex" :total="3">
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
              <AboutMobile v-if="activeSlideIndex === 2" /> 
          </div>
        </SwiperSlide>

       <SwiperSlide>
          <div class="wrap">
            <Advantages :slides="firstSlider"/>
          </div>
        </SwiperSlide>
      </CubeSlider>
 
    <Proofs/>
     <div style="position: relative">
       <CubeSlider>
         <SwiperSlide>
           <div class="wrap half">
             <Advantages :slides="secondSlider"/>
           </div>
         </SwiperSlide>
       </CubeSlider>
     </div>


    <TarifMobile/>
    
    <QA :is-desktop="false"/>

    <FormMobile/>
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
  backdrop-filter: blur(10px);
}

@keyframes aura-color {
  0%, 100% {
    filter: blur(18px) hue-rotate(0deg);
  }
  50% {
    filter: blur(18px) hue-rotate(25deg);
  }
}

.wrap-arrow {
  position: absolute;
  width: 100%;
  top: 10px;
}

.half {
  min-height: 70dvh;
}
</style>