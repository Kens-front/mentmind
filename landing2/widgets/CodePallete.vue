<template>
    <section class="code-palette">
        <div class="flap">
            <div class="left">
                <div class="left_image">
                    <span>СОЗД</span>
                </div>
            </div>
            <div class="right">
                <div class="right_image">
                    <span>АВАЙ</span>
                </div>
            </div>
        </div>

        <MonacoEditor v-model="text" lang="typescript" :options="editorOptions" />
    </section>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { codetext } from '~/constnats/code-text';

gsap.registerPlugin(ScrollTrigger)
const number = ref(0)
 
const text = ref('');
const editorOptions = ref({
  theme: 'vs-dark',           // Темная тема
  automaticLayout: true,      // Автоматическая подстройка размера
  fontSize: 18,               // Размер шрифта
  scrollBeyondLastLine: false, // Отключение скролла за последней строкой
  scrollbar: {
    alwaysConsumeMouseWheel: false,
  },
  minimap: {
    enabled: false,
  },
  wordWrap: 'on',
})
onMounted(async () => {
    const isDesktop = window.screen.width > 1024;
    editorOptions.value.fontSize = isDesktop ? 16 : 12;
    await nextTick();

    const left = document.querySelector('.code-palette .left')
    const right = document.querySelector('.code-palette .right')

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.code-palette',
            start: 'top top', // Начало анимации, когда верх секции достигает верха окна
            end: '+=1500', // Длительность скролла для анимации (настройте под свои нужды)
            scrub: 1, // Анимация привязана к скроллу
            pin: true, // Закрепляем секцию
            anticipatePin: 1, // Улучшает поведение закрепления
        }})
    
    tl.to(left, {
        x: '-100%'
    })
    .to(right, {
        x: '100%',
    }, '<')
    .to(number, {
        value: codetext.length, // Конечное значение// Длительность анимации (не влияет на скролл, используется для плавности)
        ease: 'none', //
    })
    .to(text, {
        value: codetext.slice(0, number.value), // Конечное значение// Длительность анимации (не влияет на скролл, используется для плавности)
        ease: 'none', //
    }, '<')
})

watch(number, (newVal) => {
    text.value = codetext.slice(0, newVal)
})
</script>

<style lang="scss" scoped>
.code-palette {
    position: relative;
    display: grid;
    background: url('../public/assets/noise.png');
    &::after {
        display: none;
        content: '';
        position: static;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: block;
    }

    @media screen and (max-width:1024px) {
        &:after {
            position: absolute;
            display: block;
        }
    }
}

.flap {
    position: absolute;
    top: 0;
    left: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    height: 100%;
    background-color: #E2E8F0;
    color: #2D1B4A;
}

.left, .right {
    overflow: hidden;
    position: relative;
    background-color: #f9fafc;
    z-index: 10;
}

.left_image {
    justify-content: end;
}

.right_image {
    
}

.left_image, .right_image {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    font-size: 25rem;
    background: url('../public/assets/noise.png');
    
    @media screen and (max-width: 1024px) {
        font-size: 16rem;
    }

    @media screen and (max-width: 500px) {
        font-size: 11rem;
    }

    & span {
        animation: float 4s ease-in-out infinite;
    }
 
}
</style>