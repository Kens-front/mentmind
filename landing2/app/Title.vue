<script setup>
import { onMounted } from 'vue'
import { gsap } from 'gsap'

onMounted(() => {
	const tl = gsap.timeline({ defaults: { duration: 0.6, ease: 'power2.out' } })


	// 1. Появляется "Менторы"
	tl.from('.word1', { opacity: 0, y: 50, })

	// 2. "Менторы" приподнимается, появляется "Результат"
	tl.to('.word1', { y: -20 })
	tl.from('.word2', { opacity: 0, y: 30 }, '-=0.3')

	// 3. Всё то же для "НЕ Онлайн школа"
	tl.to('.word2', { y: -20 })
	tl.from('.word3', { opacity: 0, y: 30 }, '-=0.3')


})
</script>

<template>
	<div class="container flex flex-col items-center justify-center h-screen overflow-hidden">
		<h1 class="word word1 text-5xl font-bold">Менторы</h1>
		<h1 class="word word2 text-5xl font-bold opacity-0">Результат</h1>
		<h1 class="word word3 text-5xl font-bold opacity-0">НЕ Онлайн школа</h1>
	</div>
</template>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	justify-content: end;
	transition: align-items 0.6s ease;
	height: 100vh;
}
.word {
	line-height: 1.2;
}
</style>
