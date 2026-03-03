<template>
	<div class="landing">
		<TheHeader :class="{ hide: hideHeader }"/>
		<!-- десктопная версия -->
		<aside class="aside" ref="aside">
			<a class="item">MentMind</a>
			<AsideItem v-for="item in items" :key="item.text" :text="item.text" :href="item.href" :hovered-text="item.hoveredText"/>
			<a class="button" href="#form"><span>Связаться</span></a>
		</aside>
		
		<div id="intro" class="horizontal-container intro" ref="horizontalContainer">
			<div class="sections-container" ref="sectionsContainer">
				<section class="section hero pin">
					<Promo v-if="isLoaded"/>
				</section>
				<section id="second" class="section features pin">
					<Second />
				</section>
			</div>
		</div>
		<section id="about" class="section overlap qwe">
			<About/>
		</section>
		<section id="utp-dark" class="section overlap slider">
			<SliderOne :slider="firstSlider" type="dark"/>
		</section>
		<section id="utp-light" class="section overlap slider">
			<SliderOne :slider="secondSlider" type="light"/>
		</section>
		<section id="learn" class="section overlap vertical">
			<Directions/>
		</section>
		<section id="tarifs" class="section overlap vertical">
			<Tarifs/>
		</section>
		<section class="section overlap vertical">
			<CodePallete/>
		</section>
		<section id="steps" class="section overlap vertical desktop">
			<FirstStep/>
		</section>

		<section id="steps2" class="section overlap vertical mobile">
			<FirstStepMobile/>
		</section>
		<section id="form" class="section overlap vertical contacts_section">
			<Form/>
		</section>
	</div>

	<div class="mobile">
		<Mobile/>
	</div>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, ref } from 'vue'
import Promo from "../widgets/Promo.vue";
import Second from '../widgets/Second.vue'
import About from '../widgets/About.vue'
import Directions from '../widgets/Directions.vue'
import FirstStep from '../widgets/FirstStep.vue'
import FirstStepMobile from '../widgets/FirstStepMobile.vue'
import Form from '../widgets/Form.vue'
import CodePallete from '../widgets/CodePallete.vue'
import SliderOne from '../widgets/SliderOne.vue'
import AsideItem from './components/AsideItem.vue';
import Tarifs from '../widgets/Tarifs.vue'
import TheHeader from './components/TheHeader.vue';
import pattern from '../public/assets/паттерн.png'
import pattern2 from '../public/assets/pattern2.png'
import pattern3 from '../public/assets/pattern3.png'
import pattern4 from '../public/assets/pattern4.png'
import pattern5 from '../public/assets/pattern5.png'
import { useProductStore } from './store';
import { metrikaApi } from './features/api';
import Mobile from "~~/widgets/Mobile.vue";
// Регистрируем плагин
gsap.registerPlugin(ScrollTrigger)

const horizontalContainer = ref(null)
const sectionsContainer = ref(null)
const features = ref(['Функция 1', 'Функция 2', 'Функция 3'])
const aside = ref(null)

const productStore = useProductStore();

const isLoaded = ref(false)

const firstSlider = [
	{title: 'Программа под вас', description: 'Мы не заставляем всех учиться по одному шаблону. Ваша программа адаптируется под цели, уровень и стиль мышления', image: pattern},
	{title: 'Учим мыслить как программист', description: 'Изучаем не просто синтаксис, а фундаментальное программное мышление, которое работает в веб-разработке, геймдеве, автоматизации и даже data science.', image: pattern2},
	{title: 'Бонус за вовлечённость', description: 'При покупке от 10 занятий — предоставляется одна психологическая сессия в месяц для разгруза, поддержки и повышения мотивации.', image: pattern3}
]

const secondSlider = [
	{title: 'Выбирайте формат', description: 'Индивидуальные занятия 👤 для полного погружения или мини‑группа 👥 из 2 человек — для идей и роста.',  image: pattern3},
	{title: 'Предлагаем широкий спектр', description: 'Готовим к собеседованиям, тестим знания, оттачиваем необходимые темы',  image: pattern4},
	{title: 'Делаем Вас конкурентными на рынке', description: 'Никакой ИИ и близко не заменит Вас',  image: pattern5}
]

const items = [
	{text: '1', hoveredText: 'о нас', href: '#about'},
	{text: '2', hoveredText: 'кто мы', href: '#utp-dark'},
	{text: '3', hoveredText: 'что мы', href: '#utp-light'},
	{text: '4', hoveredText: 'чему учим', href: '#learn'},
	{text: '5', hoveredText: 'старт', href: '#steps'},
	{text: '6', hoveredText: 'связь', href: '#form'},
]

const startY= ref(0)
const lastY= ref(0)
const hideHeader= ref(false)


function onTouchStart(e) {
    startY.value = e.touches[0].clientY;
    lastY.value = startY.value;
  }

  function onTouchMove(e) {
    const currentY = e.touches[0].clientY;
    const delta = currentY - lastY.value;

    if (Math.abs(delta) < 10) return;

    hideHeader.value = delta < 0;
    lastY.value = currentY;

	console.log(delta)
  }
onBeforeMount(() => 	document.body.style.overflow = 'hidden')
onMounted(() => {
 
 
	isLoaded.value = true
	const sections = gsap.utils.toArray('.sections-container .pin')
	const container = horizontalContainer.value

	gsap.to(aside.value, {x: 0, delay: 4});
	gsap.fromTo('body', {overflow: 'hidden'}, {overflow: 'visible', delay: 4})
	// Горизонтальная анимация для первых трех секций
	gsap.to(sections, {
		x: () => -(container.scrollWidth - window.innerWidth),
		ease: 'none',
		scrollTrigger: {
			trigger: horizontalContainer.value,
			start: 'top top',
			end: () => `${container.scrollWidth - window.innerWidth}`,
			scrub: 2,
			pin: true,
			invalidateOnRefresh: true,
			id: 'horizontal123',
      onEnter: () => gsap.set(sections, { willChange: 'transform' }),
      onLeaveBack: () => gsap.set(sections, { willChange: 'initial' })
		},
	})

	gsap.to('.landing', {
		backgroundColor: '#F9FAFC',
		ease: 'power1.out',
		color: '#2D1B4A',
		scrollTrigger: {
			trigger: '.vertical',
			start: 'top top',
			end: () => `bottom bottom`,
			scrub: 1,
      onEnter: () => gsap.set('.landing', { willChange: 'background-color, color' }),
      onLeaveBack: () => gsap.set('.landing', { willChange: 'initial' })
		},
	})

	const sessionId = localStorage.getItem('sessionId')

	if (sessionId) {
		return
	}

	metrikaApi.create({event: 'pageView'}).then(data => {
		localStorage.setItem('sessionId', data.id)
	}).catch(e => console.log(e))
 
})


useHead({
	title: 'MentMind - менторский центр',
	meta: [
		{ name: 'description', content: 'MentMind - менторский центр' },
		{ name: 'keywords', content: 'MentMind, менторский центр, обучение, программирование, IT, развитие' },
		{ name: 'author', content: 'MentMind' },
		{ name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
		{ name: 'robots', content: 'index, follow' },
		{ name: 'googlebot', content: 'index, follow' },
		{ name: 'bingbot', content: 'index, follow' },
		{ name: 'yandexbot', content: 'index, follow' },
	],
	link: [
		{rel: 'stylesheet', href: 'devicon.min.css'}
	]
})
</script>

<style lang="scss" scoped>

 
.landing {
	overflow: hidden;
	background-color: #12121A;
	color: #E0D6FF;;
 
	&-active {
		overflow-y: visible;
	}

	&__mobile {
		min-height: 100dvh;
		background-color: #161628;
	}

	@media screen and (max-width: 1024px) {
		display: none;
	}
}

.horizontal-container {
	width: 100%;
}

.sections-container {
	display: flex;
}

.section {
	min-width: 100vw;
	min-height: 100dvh;
	position: relative;
}


.aside {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	z-index: 10;
	display: grid;
    grid-auto-rows: max-content;
	width: 5.8rem;
	border-right: 1px solid #2D2A38;
	transform: translateX(-100%);
	background-color: inherit;
	color: inherit;

	@media screen and (max-width:1024px) {
		display: none;
	}
}

.item {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 8rem;
	padding: 4rem 0;
	font-size: 1.6rem;
	border-top: 1px solid #2D2A38;
	border-bottom: 1px solid #2D2A38;
	writing-mode: vertical-rl;  
	white-space: nowrap;
	display: flex;
	font-weight: 900;
	& span {
		display: block;
		rotate: 90deg;
	}
}

.button {
	position: absolute;
    bottom: 0;
	display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
	padding: 5rem 0;
    background: #40E0C0;
	color: #E0D6FF;

	& span {
		writing-mode: sideways-rl;
	}
}

.vertical {
	display: grid;
}

.desktop {
	@media screen and (max-width: 1024px) {
		display: none;
	}
}

.mobile {
	display: none;

	@media screen and (max-width: 1024px) {
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 100%;
	}
}

.slider {
	position: relative;
	display: grid;
	grid-template-columns: 100%;
}

.intro {
	
	&:before{
			content:"";
			position:absolute;
			inset:-20%;
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
			animation: aura-color 2s ease-in-out infinite;
		}
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
