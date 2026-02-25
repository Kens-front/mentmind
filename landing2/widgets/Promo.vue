<template>
	<div class="Promo">
		<div class="text">
			<span class="subtitle" ref="subtitle">MentMinde</span>
			<h1 class="title" ref="title">
				<span class="word" ref="word1">Спрашивай</span>
				<span class="word" ref="word2"><span ref="label">By MentMind</span>Понимай</span>
				<span class="word" ref="word3">Расти</span>
				<span class="word" ref="word4">Вместе</span>
			</h1>
		</div>

		<div class="swiper-text" ref="swiperText">
			<span>Обучение</span>
			<span>Обучение</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import { onMounted, ref } from "vue";
const props = defineProps(['aside'])
const word1 = ref<HTMLElement | null>(null);
const word2 = ref<HTMLElement | null>(null);
const word3 = ref<HTMLElement | null>(null);
const word4 = ref<HTMLElement | null>(null);
const title = ref(null)
const aside = ref(null)
const subtitle = ref(null)
const label = ref(null);
const video = ref(null);
const swiperText = ref(null)
function setX(el) {
	const isAside = window.screen.width > 1024;
	return (-window.innerWidth / 2 + el.offsetWidth / 2) + (isAside ? 72 : 0);
}

onMounted(() => {
  const h = word1.value.offsetHeight;

  // Использование will-change для подготовки анимаций
  gsap.set([title.value, word1.value, word2.value, word3.value, word4.value], { willChange: 'transform, opacity' });

  gsap.set(title.value, { height: h });

  const tl = gsap.timeline();
  tl
      .from(word1.value, { opacity: 0, y: 100, scale: 0.8, duration: 1, ease: 'power2.inOut' })
      .from(word2.value, { opacity: 0, y: 100, scale: 0.8, duration: 1, ease: 'power2.inOut' })
      .to(title.value, { height: h * 2 }, '<')
      .from(word3.value, { opacity: 0, y: 100, scale: 0.8, duration: 1, ease: 'power2.inOut' })
      .to(title.value, { height: h * 3 }, '<')
      .from(word4.value, { opacity: 0, y: 100, scale: 0.8, duration: 1, ease: 'power2.inOut' })
      .to(title.value, { height: h * 4 }, '<')

      // Использование transform для перемещения по оси X
      .to(word1.value, { x: setX(word1.value) })
      .to(word2.value, { x: setX(word2.value) }, '<')
      .to(word3.value, { x: setX(word3.value) }, '<')
      .to(word4.value, { x: setX(word4.value) }, '<')

      // Анимация subtitle и swiperText
      .to(subtitle.value, { y: -200, margin: 0 }, '<')
      .from(swiperText.value, { opacity: 0 }, '<')

      // Плавное движение label
      .from(label.value, { opacity: 0, x: -20 });
});
</script>

<style lang="scss" scoped>
	.Promo {
		display: grid;
		grid-template-columns: 100vw;
		height: 100vh;
		min-width: 100vw;
		background-color: inherit;

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

	.subtitle {
		font-size: 5rem;
		color: #fff;
		margin-bottom: 2rem;
	}

	.title {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
		position: relative;
		width: 100%;
		overflow: hidden;
		z-index: 10;
	}

	.word {
		display: flex;
		width: max-content;
		font-size: 22rem;
		white-space: nowrap;
		/* Убедись, что все слова выровнены одинаково */
		text-align: center;
		text-transform: uppercase;
		color: #E0D6FF;
		font-weight: 700;
		line-height: 90%;

		&:nth-child(2) {
			& span {
				font-size: 2rem;
				color: #fff;
			}
		}

		@media screen and (max-width: 500px) {
			font-size: 12rem;
		}

		@media screen and (max-width: 400px) {
			font-size: 10rem;
		}
	}

	.video {
		background-color: blue;
	}

	.text {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: end;
		height: 100%;
	}

	.video {
		height: 100%;
		background-color: red;
		width: 30rem;
	}

	.swiper-text {
		color: #40E0C0;
		font-size: 40rem;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		text-transform: uppercase;
		font-weight: 900;
		rotate: 322deg;
		opacity: 0.1;
		animation: diagonal-move 20s linear infinite;

		span {
			text-shadow: 0 0 80px rgb(64 224 192);
		}
	}


	@keyframes diagonal-move {
		0% {
			transform: translate(0, 0); /* Старт: верхний правый */
		}
		100% {
			transform: translate(-200%, 100%); /* Конец: левый нижний; настройте % под размер контейнера и текст */
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
