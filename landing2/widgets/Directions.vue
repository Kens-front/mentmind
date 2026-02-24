<template>
    <section class="directions" ref="section">
        <h3 class="title" ref="title">Чему учим?</h3>
        <div class="content" >
            <span class="directions_label">Frontend</span>
            <div class="back"></div>
            <Frontend :items="frontendSkills" :achievments="frontendAchievments" title="Frontend-разработка" :text="frontTitle"/>
        </div>

        <div class="content" >
            <span class="directions_label">Backend</span>
            <div class="back"></div>

            <Frontend :items="contentsBack" :achievments="backendAchievments" title="Backend-разработка" :text="backTitle"/>
        </div>

        <div class="content" >
            <span class="directions_label">Web-Architecure</span>
            <div class="back"></div>
            <Frontend :items="contentsArch" :achievments="architectureAchievments" title="Системная архитектура" :text="archTitle"/>
 
        </div>
    </section>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { nextTick, onMounted, ref } from 'vue';
import Backend from '~/components/Directions/Backend.vue';
import Frontend from '~/components/Directions/Frontend.vue';
import { backTitle, frontTitle, archTitle } from '~/constnats/directionts';
import Vue from '../public/assets/vue.png'
import React from '../../public/assets/react.png'
import TS from '../public/assets/ts.png'
import JS from '../public/assets/js.png'
 
// Регистрируем плагин
gsap.registerPlugin(ScrollTrigger)

const title = ref(null)

const frontendSkills = ref([
    {title: 'Vue', description: 'Лёгкий старт и быстрая разработка', label: 'Подходит новичкам', class: 'devicon-vuejs-plain'},
    {title: 'React',  description: 'База для крупных компаний', label: 'Фаворит на рынке', class: 'devicon-react-original colored' },
    {title: 'Typescript',  description: 'Контроль типов = меньше багов', label: 'Must-have в 2026', class: 'devicon-typescript-plain colored' },
    {title: 'Javascript',  description: 'Основа всего фронтенда', label: 'Это база', class:  'devicon-javascript-plain colored',  },
 
])

const frontendAchievments = ref([
    {title: 'Верстать современные интерфейсы',   label: 'Практика', class: 'devicon-vuejs-plain'},
    {title: 'Работать с состоянием и API', label: 'Поддержка', class: 'devicon-react-original colored' },
    {title: 'Писать чистый код', label: 'Конкурентность', class: 'devicon-typescript-plain colored' },
    {title: 'Создавать мощный аккаунт в GIT',  label: 'Актуально в 2026', class:  'devicon-javascript-plain colored',  },
 
])

const contentsBack = ref([
    {
        title: 'Node.js',
        description: 'Высокая скорость и масштабируемость',
        label: 'Де-факто стандарт',
        class: 'devicon-nodejs-plain colored'
    },
    {
        title: 'NestJS',
        description: 'Архитектура и порядок из коробки',
        label: 'Выбор для продакшена',
        class: 'devicon-nestjs-plain colored'
    },
    {
        title: 'Python',
        description: 'Быстрая разработка и аналитика',
        label: 'Любимчик data-команд',
        class: 'devicon-python-plain colored'
    },
    {
        title: 'FastAPI',
        description: 'Асинхронность и высокая производительность',
        label: 'Тренд 2026',
        class: 'devicon-fastapi-plain colored'
    },
])


const backendAchievments = ref([
    {
        title: 'Проектировать и писать API',
        label: 'Основа бэкенда',
        class: 'devicon-nodejs-plain colored'
    },
    {
        title: 'Реализовывать бизнес-логику',
        label: 'Ценность продукта',
        class: 'devicon-nestjs-plain colored'
    },
    {
        title: 'Обеспечивать безопасность и авторизацию',
        label: 'Обязательный навык',
        class: 'devicon-lock-plain'
    },
    {
        title: 'Готовить сервис к продакшену',
        label: 'Реальный мир',
        class: 'devicon-docker-plain colored'
    }
])

const contentsArch = ref([
 
    {
        title: 'MVVM',
        description: 'Удобная работа с состоянием и UI',
        label: 'Популярен во фронтенде',
        class: 'devicon-bazel-plain colored'
    },
 
    {
        title: 'CQRS',
        description: 'Разделение команд и запросов',
        label: 'Для сложной бизнес-логики',
        class: 'devicon-ionic-original colored'
    },
    {
        title: 'FSD',
        description: 'Feature-Sliced подход к структуре фронтенда',
        label: 'Стандарт современного UI',
        class: 'devicon-detaspace-line colored'
    },
    {
        title: 'Microservices',
        description: 'Независимые сервисы и масштабирование',
        label: 'Enterprise-уровень',
        class: 'devicon-cloudflare-plain colored'
    }, 
])

const architectureAchievments = ref([
    {
        title: 'Выбирать архитектуру под задачу',
        label: 'Инженерное мышление',
        class: 'devicon-architecture-line'
    },
    {
        title: 'Разделять ответственность в коде',
        label: 'Поддерживаемость',
        class: 'devicon-architecture-line'
    },
    {
        title: 'Структурировать фронтенд по FSD',
        label: 'Современный стандарт',
        class: 'devicon-architecture-line'
    },
    {
        title: 'Масштабировать приложение без переписывания',
        label: 'Взгляд в будущее',
        class: 'devicon-architecture-line'
    }
])
onMounted(async () => {
    await nextTick();
    const contents = document.querySelectorAll('.directions .content');
    const cards = document.querySelectorAll('.directions .card_inner')
    // Создаем таймлайн с ScrollTrigger
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.directions',
            start: 'top top', // Начало анимации, когда верх секции достигает верха окна
            end: '+=2000', // Длительность скролла для анимации (настройте под свои нужды)
            scrub: 1, // Анимация привязана к скроллу
            pin: true, // Закрепляем секцию
            anticipatePin: 1, // Улучшает поведение закрепления
        }
    });


    const isDesktop = window.screen.width > 1024;
    // Анимация каждого блока content
    contents.forEach((content, index) => {
        tl.fromTo(
            content,
            {
                x: '100%', // Начальная позиция (справа, за пределами экрана)
                opacity: 0, // Начальная прозрачность
                ease: 'power1.inOut',
            },
            {
                x: index * (isDesktop? 40:0), // Конечная позиция (в центре)
                opacity: 1, // Полная видимость
                duration: 1, // Длительность анимации для каждого блока
                delay: index * 0.5, // Задержка для последовательного появления
            },
            index * 0.5 // Смещение во времени для последовательной анимации
        ).to(content.querySelectorAll('.card-inner'), {rotateY: '180deg'}, '-=0.5');
    });

 
});
</script>

<style lang="scss" scoped>
.directions {
    position: relative;
    height: 100%;
    padding-left: 40px;
    @media screen and (max-width: 1024px) {
        padding-left: 0;
    }
 
}

.back {
    background-size: contain;
    position: absolute;
    width: 100%;
    height: 100%;
    background: url('../public/assets/noise.png');
}

.content {
    position: absolute;
    display: grid;
    grid-template-columns: 6% 84%;
    height: 100%;
    width: 100%;
    background-color: #F9FAFC;
    border-left: 1px solid #E2E8F0;
    border-bottom: 1px solid #E2E8F0;
    box-shadow: 2px 1px 34px #2D1B4A;
    padding-bottom: 10px;
 
    @media screen and (max-width: 1024px) {
        grid-template-columns: 1fr;
        grid-template-rows: max-content 1fr;
        row-gap: 1rem;
    }

    @media screen and (max-width: 767px) {
        width: 100%;
    }
}

.title {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    text-align: center;
    font-size: 24rem;
    font-weight: 700;
    text-transform: uppercase;
    transform: translate(-50%, -50%);
    color: #2D1B4A;

    @media screen and (max-width: 1024px) {
        font-size: 12rem;
    }

    @media screen and (max-width: 500px) {
        font-size: 13vw;
    }
}
.directions_label {
  position: relative;
  z-index: 123;
    padding: 8rem 0;
    font-size: 4rem;
    writing-mode: sideways-lr;
    color: #2ED4B8;
    text-transform: uppercase;

    @media screen and (max-width: 1024px) {
        padding: 2rem 0 0 2rem;
        writing-mode: unset;
    }
}
</style>