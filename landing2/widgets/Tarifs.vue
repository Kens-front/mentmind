<template>
    <div>  
        <div class="tarifs wrap">
            <h3 class="title">Тарифы</h3>  

            <div class="content">
                <TarifCard v-for="value in cards" :key="value.title" :tarif="value"/>
            </div>
 
        </div>

        <div class="tarifs-mobile">
            <TarifSlider :slider="cards"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { nextTick, onMounted, ref } from 'vue';
import TarifCard from '~/components/TarifCard.vue';
import TarifSlider from '../widgets/TarifSlider.vue'
import {ELessonPrices} from "~~/types";

gsap.registerPlugin(ScrollTrigger)

const prices = ref({
    group: 2400,
    base: 3600,
    top: 4500,
})

const discounts = ref({
    group: 2400,
    base: 3600,
    top: 4500,
})

const group = ref(2400)
 const  base = ref( 3600)
const top = ref(4500)


onMounted(async () => {
    await nextTick();
    const contents = document.querySelectorAll('.tarifs');
    const cards = document.querySelectorAll('.tarifs .tarif')
    const lines = gsap.utils.toArray('.line')
    // Создаем таймлайн с ScrollTrigger
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.tarifs',
            start: 'top top', // Начало анимации, когда верх секции достигает верха окна
            end: '+=800', // Длительность скролла для анимации (настройте под свои нужды)
            scrub: 1, // Анимация привязана к скроллу
            pin: true, // Закрепляем секцию
            anticipatePin: 1, // Улучшает поведение закрепления
        },
    });


    tl.to(group, {
        value: ELessonPrices.GROUP,
        snap: { value: 1 },
    }, '<')
    tl.to(base, {
        value: ELessonPrices.BASE,
        snap: { value: 1 },
    }, '<')

    tl.to(top, {
    value: ELessonPrices.PREMIUM,
    snap: { value: 1 },
    }, '<')
    tl.to(lines, {
        width: '100%',
    }, '<')



    const t2 = gsap.timeline({
        scrollTrigger: {
            trigger: '.tarifs-mobile',
            start: 'top top', // Начало анимации, когда верх секции достигает верха окна
            end: '+=800', // Длительность скролла для анимации (настройте под свои нужды)
            scrub: 1, // Анимация привязана к скроллу
            pin: true, // Закрепляем секцию
            anticipatePin: 1, // Улучшает поведение закрепления
        },
    });


    t2.to(group, {
        value: ELessonPrices.GROUP,
        snap: { value: 1 },
    }, '<')
    t2.to(base, {
        value: ELessonPrices.BASE,
        snap: { value: 1 },
    }, '<')

    t2.to(top, {
    value: ELessonPrices.PREMIUM,
    snap: { value: 1 },
    }, '<')
    t2.to(lines, {
        width: '100%',
    }, '<')
 
});

const cards = computed(() => [
  {
    percent: Math.ceil(100 - ELessonPrices.GROUP / 2400 * 100),
    title: 'Групповой',
    oldPrice: 2400,
    newPrice: group.value,
    features: [
      'Полный доступ ко всем материалам и инструментам платформы',
      'Мини-группы до 2 человек: максимум внимания при оптимальной цене',
      'Чёткая программа с опытным ментором — видимый прогресс с первых занятий',
      'Общий чат поддержки: разбираем вопросы и закрепляем материал между встречами',
      'Идеально для системного старта и регулярной практики без переплат',
    ],
  },
  {
    percent: Math.ceil(100 - ELessonPrices.BASE / 3600 * 100),
    title: 'Базовый',
    oldPrice: 3600,
    newPrice: base.value,
    features: [
      'Всё из «Группового» + персональная дорожная карта под ваши цели',
      'Индивидуальные занятия 1-на-1 с проверенным ментором',
      'Глубокая проверка заданий с развёрнутой обратной связью (без спешки и жёстких дедлайнов)',
      'Гибкий график: возможен перенос занятия по согласованию с центром',
      '🎁 При покупке от 10 занятий — 1 сессия с психологом-коучем',
    ],
  },
  {
    percent: Math.ceil(100 - ELessonPrices.PREMIUM / 4500 * 100),
    title: 'Продвинутый',
    oldPrice: 4500,
    newPrice: top.value,
    features: [
      'Всё из «Базового» + работа с топ-менторами (рейтинг 4.9+, подтверждённые кейсы)',
      'Личный чат с ментором: ответы на вопросы в течение 2 часов в рабочее время',
      'Стратегическое планирование на 3–6 месяцев и фокус на сложных, долгосрочных целях',
      'Еженедельный трек-ревью прогресса и быстрая корректировка плана под результат',
      '🎁 При покупке от 10 занятий — 2 сессии с психологом-коучем + экспертный разбор вашего портфолио/проекта',
    ],
  },
])
</script>

<style lang="scss" scoped>
.tarifs {
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: max-content 1fr;
    align-items: center;
    justify-content: center;
    padding: 5rem 10rem;
    row-gap: 2.4rem;
    background: url('../public/assets/noise.png');
    &-mobile {
        display: none;

        @media screen and (max-width: 1024px) {
            display: block;
        }
    }
}

.content {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    height: 100%;
    column-gap: 4rem;
  
}

.wrap {
    @media screen and (max-width: 1024px) {
        display: none;
    }
}

.title {
  font-size: 6rem;
  font-weight: 700;
  margin-bottom: 2rem;
}
</style>