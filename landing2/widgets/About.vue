<template>
    <section class="we" ref="section">
        <div class="title_wrap" ref="titleWrap">
            <h3 class="title">Кто мы?</h3>
            <h3 class="title">Кто мы?</h3>
            <h3 class="title">Кто мы?</h3>
        </div>

        <div class="text" ref="text">
            <p class="spans">
                <span>6000+ часов живых консультаций</span>

                <span>Обучение с личным наставником над реальными задачами</span>
              
                <span>Каждая встреча - с профессиональным ментором</span>

                <span>Персональный маршрут до следующего грейда</span>
            </p>
        </div>
        <div class="mix"></div>
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
const text = ref(null)
onMounted(async () => {
    await nextTick();
    const sections = document.querySelectorAll('.we .title')
 
    const tl = gsap.timeline({
        easy: 'power1.in',
        scrollTrigger: {
            trigger: '.we',
            start: `top ${section.value?.offsetHeight}`, 
            end: `bottom top`,
            scrub: 1,
            id: 'about'
        }
    })

    tl.from(sections[0]!, {
        x: '100%',
    }, '+=.5').
    from(sections[1]!, {
        x: '-100%',
    }, '<').
    from(sections[2]!, {
        x: '100%',
    }, '<')
    .to(sections[0]!, {
        y: '0',
    }, '+=.5').
    to(sections[1]!, {
        y: '0',
    }, '<').
    to(sections[2]!, {
        y: '0',
    }, '<')
    .to(titleWrap.value, {
        scale: 0.1,
    })
    .from(text.value, {
        opacity:0,
        y: 500,
    })
    .to(titleWrap.value, {
        y: -700,
    }, '<')
    .to(text.value, {
        backgroundPosition: '0 0',
    }, '<')
 



    ScrollTrigger.create({
        trigger: section.value,
        start: 'top top',        // 🔹 Прилипает, когда верх = верх экрана
        end: `bottom top`, // 🔹 Отлипает через 500px скролла
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
    line-height: 100%;
    font-weight: 700;
    color: #CBD5E1;

    &:first-child {
        transform: translateY(-100%);
 
    }
    &:last-child {
        transform: translateY(100%);
 
    }

    &_wrap {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 100%;
    }

    @media screen and (max-width: 1024px) {
        font-size: 20rem;
    }

    @media screen and (max-width: 767px) {
        font-size: 16rem;
    }

    @media screen and (max-width: 500px) {
        font-size: 20vw;
    }
}

.text {
    font-size: 6rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 80%;
    text-align: center;
    background: linear-gradient(
    to bottom,
    #40E0C0,     /* новый цвет (например, красный) */
    #754DFF 50%, /* можно сделать резкую границу */
    #888888 50%, /* старый цвет (серый) */
    #888888
  );
    background-size: 100% 200%; /* удвоенная высота для сдвига */
    background-position: 0 100%; /* начальное положение: градиент "спрятан" внизу */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: background-position 0.3s ease; /* GSAP переопределит */

    @media screen and (max-width: 767px) {
        width: 100%;
    }
}

.spans {
    display: grid;
    row-gap: 1rem;
}

.mix {
    position: absolute;
    height: 50%;
    top: 0;
}
</style>