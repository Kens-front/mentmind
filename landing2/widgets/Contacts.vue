<template>
    <section class="contacts" ref="section">
        <div class="title_wrap" ref="titleWrap">
            <h3 class="title">Кто мы?</h3>
            <h3 class="title">Кто мы?</h3>
            <h3 class="title">Кто мы?</h3>
        </div>
    </section>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { nextTick, onMounted, ref } from 'vue';
 
// Регистрируем плагин
gsap.registerPlugin(ScrollTrigger)

const section = ref<HTMLDivElement | null>(null)
const h1 = ref(null);
const titleWrap = ref(null)
onMounted(async () => {
    await nextTick();
    const sections = document.querySelectorAll('.contacts .title')
 
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.we',
            start: `center ${section.value?.offsetHeight}`, 
            end: `bottom top`,
            scrub: 1,
            id: 'about'
        }
    })

    tl.from(sections[0]!, {
        x: '100%',
    }).
    from(sections[1]!, {
        x: '-100%',
    }, '<').
    from(sections[2]!, {
        x: '100%',
    }, '<')
    .to(sections[0]!, {
        y: '0',
    }, '+=1').
    to(sections[1]!, {
        y: '0',
    }, '<').
    to(sections[2]!, {
        y: '0',
    }, '<')
    .to(titleWrap.value, {
        scale: 0.2,
    })
    .to(titleWrap.value, {
        y: -1000,
    })
 



    ScrollTrigger.create({
        trigger: section.value,
        start: 'top top',        // 🔹 Прилипает, когда верх = верх экрана
        end: `bottom center`, // 🔹 Отлипает через 500px скролла
        pin: true,               // 🔹 Фиксирует элемент
        pinSpacing: true,        // Сохраняет место в потоке (по умолчанию true)
        invalidateOnRefresh: true
    })
})
</script>

<style lang="scss" scoped>
.we {
    padding: 2rem;
    top: 0;
    left: 0;
    right: 0;
    min-height: 100vh;
    color: #fff;
    background-color: yellow;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.title {
    position: absolute;
    width: 100%;
    font-size: 28rem;
    text-transform: uppercase;
    text-align: center;

    &:first-child {
        transform: translateY(-100%);
    }
    &:last-child {
        transform: translateY(100%);
    }

    &_wrap {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 100%;
    }
}
</style>