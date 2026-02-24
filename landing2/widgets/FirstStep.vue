<template>
    <section class="steps" >
        <div class="content" >
            <h5 class="title">{{ title.slice(0,+index.toFixed(0)) }}</h5>

            <div class="cards">
                <Card
                    v-for="card in enrollmentStages" 
                    :key="card.title"
                    v-bind="card"
                />
 
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { nextTick, onMounted, ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectCube, Pagination } from 'swiper/modules'; 
import Arrow from '~/components/Arrow.vue';
import 'swiper/css';

import 'swiper/css/effect-cube';
import 'swiper/css/pagination';
 import Card from '../app/components/Card.vue';
// Регистрируем плагин
gsap.registerPlugin(ScrollTrigger)

const title = ref('первый шаг');
const text = ref('')

const index = ref(0);
const enrollmentStages = [
  {
    title: "Оставить заявку",
    description: "Заполните короткую форму и получите <strong>консультацию по обучению</strong>",
    image: 'image1',
  },
  {
    title: "Пробное занятие",
    description: "Пройдите <strong> бесплатное пробное занятие</strong> и оцените наш подход к обучению",
    image: 'image2',
  },
  {
    title: "Обсуждение цели",
    description: "Обсудите с ментором цели обучения и <strong>составьте персональный план</strong>",
    image: 'image3',
  },
  {
    title: "Приступить к обучению",
    description: "<strong>Начинате обучение</strong>, выполняйте задания и двигайтесь к результату",
    image: 'image4',
  }
];
onMounted(async () => {
    await nextTick();
    const section = document.querySelector('.steps')
    const cards = document.querySelectorAll('.steps .card')
    const cardsContainer = document.querySelector('.cards')
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: 'top top', // Начало анимации, когда верх секции достигает верха окна
            end: '+=3500', // Длительность скролла для анимации (настройте под свои нужды)
            scrub: 1, // Анимация привязана к скроллу
            pin: true, // Закрепляем секцию
            anticipatePin: 1, // Улучшает поведение закрепления
        },
    });

    tl.to(index, {
        value: title.value.length,
        ease: 'none', //
    })
    tl.to(text, {
        value: title.value.slice(0, +index.value.toFixed(0)),
        ease: 'back.in'
    }, '<')
    .from(cardsContainer, {
        opacity: 0,
    })

    if (cards.length > 0) {
        tl.to(cards[0]!, {
            x: `-150%`
        }, '<')
        .to(cards[1]!, {
            x: `-45%` 
        }, '<')
        .to(cards[2]!, {
            x: `60%` 
        }, '<')
        .to(cards[3]!, {
            x: `164%`,
        }, '<')
        .to(cards[0]!, {
            y: `-100%`
        })
        .to(cards[1]!, {
            y: `-45%` 
        }, '<')
        .to(cards[2]!, {
            y: `60%` 
        }, '<')
        .to(cards[3]!, {
            y: `104%`,
        }, '<')
    }
})

</script>

<style lang="scss" scoped>
.steps {
    position: relative;
    background: url('../public/assets/noise.png');
}

.content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.title {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    text-align: center;
    font-size: 24rem;
    text-transform: uppercase;
    transform: translate(-50%, -50%);
    color: #2D1B4A;
}

.steps {
    background-color: #f9fafc;
}

.cards {
    position: relative;
    height: 55rem;
    width: 100%;
}
</style>