<template>
    <section class="about" ref="about">
        <h2 class="about_title">
            <span class="label">NEW MISSON</span>
            <span class="text">
                {{ TITLE }}
            </span>
        </h2>

        <div class="bottom">
            <div class="video"></div>

            <div class="descriptions">
                <p>Теория + кодинг реальных приложений — от landing page до full-stack систем.</p>
                <p>Повышаем скиллы как молодным новобранцам, так и опытным разработчикам.</p>
            </div>
        </div>
    </section>
</template>
<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
 
// Регистрируем плагин
gsap.registerPlugin(ScrollTrigger)
const TITLE = 'Разрабатываем под вас индвидуальную программу обучения и доводим по ней до желанной цели'
    
const words = TITLE.split(' ');
const about = ref<HTMLDivElement | null>(null);

onMounted(() => {
    const ps = document.querySelectorAll('.descriptions p')
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.about_title',
            start: '10% 10%',
            end: about.value?.scrollWidth,
            scrub: true,
        }
    })

    tl
    .to('.about_title', {
        opacity: 1,
    })
    .to('.label', {
        opacity: 1, 
        top: 0
    })
    .to('.label', {color: '#8A66FF'}, '+=.5')
    .from(ps[0]!, {height: 0}, '+=1')
    .from(ps[1]!, {height: 0}, '+=1')
})
</script>

<style lang="scss" scoped>
.about {
    display: grid;
    grid-template-columns: 80%;
    justify-content: start;
    align-items: start;
    height: 100%;
    color: rgb(254,233,206);

    &_title {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        font-size: 10rem;
        line-height: 10rem;
        opacity: .2;

        @media screen and (max-width: 767px) {
            font-size: 6rem;
        }
    }

    @media screen and (max-width: 1024px) {
        grid-template-columns: 100%;
        row-gap: 10rem;
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
    top: -10%;
    left: 0;
    font-size: 2rem;
}

.text {
    text-indent: 18rem;
    color: #CBD5E1;
}
</style>