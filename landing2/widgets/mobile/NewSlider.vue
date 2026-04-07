<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// Реактивные состояния
const carousel = ref<HTMLElement | null>(null)
const cellCount = 5
const selectedIndex = ref(0)

// URL для переключения изображения
const catUrl = "https://cdn.shopify.com/s/files/1/1453/9306/products/19950NBT2-2_1024x1024.jpg?v=1504778561"
const dogUrl = "https://i.ebayimg.com/images/g/0z8AAOSwFe5Xz-p2/s-l300.jpg"
const isCatImage = ref(true)

// Вычисляемые свойства
const currentImageUrl = computed(() => isCatImage.value ? catUrl : dogUrl)
const toggleButtonText = computed(() => isCatImage.value ? 'Change to Dog' : 'Change to Cat')

// Поворот карусели
function rotateCarousel() {
  if (carousel.value) {
    const angle = selectedIndex.value / cellCount * -360
    carousel.value.style.transform = `translateZ(-275px) rotateY(${angle}deg)`
  }
}

// Обработчики кнопок навигации
function goToPrevious() {
  selectedIndex.value--
  rotateCarousel()
}

function goToNext() {
  selectedIndex.value++
  rotateCarousel()
}

// Переключение изображения
function changeImage() {
  isCatImage.value = !isCatImage.value
}

// Инициализация после монтирования (только на клиенте)
onMounted(() => {
  // Начальная позиция карусели
  rotateCarousel()
})
</script>

<template>
  <ClientOnly>
    <div>
      <div class="wrapper">
        <div class="object">
          <div ref="carousel" class="carousel">
            <div class="cell">
              <h3>COOL CAT</h3>
              <img :src="currentImageUrl" alt="Toggleable image">
            </div>
            <div class="cell">
              <h3 style="color:black;">COOL EYES</h3>
              <img src="http://s1.1zoom.me/big0/301/Eyes_Painting_Art_Eyelash_lash_Glance_White_522554_1024x1024.jpg" alt="Eyes">
            </div>
            <div class="cell">
              <h3>LET'S GET WIRED</h3>
              <img src="https://images-na.ssl-images-amazon.com/images/I/71Sozrhp53L._SX679_.jpg" alt="Wired">
            </div>
            <div class="cell">
              <h3>DEAD POOL</h3>
              <img src="http://www.honcho-sfx.com/blog/wp-content/uploads/2015/08/Deadpool-trailer-300x300.jpg" alt="Deadpool">
            </div>
            <div class="cell">
              <h3>MOON</h3>
              <img src="http://www.filipaveiga.com/Portals/10/EasyDNNnews/1284/1284fullmoon_lick_big-640x640.jpg" alt="Moon">
            </div>
          </div>
        </div>
      </div>

      <p class="button-group">
        <button class="previous-button" @click="goToPrevious">Previous</button>
        <button class="next-button" @click="goToNext">Next</button>
        <button @click="changeImage">{{ toggleButtonText }}</button>
      </p>
    </div>
  </ClientOnly>
</template>

<style scoped lang="scss">
.object {
  position: relative;
  width: 400px;
  height: 600px;
  margin: 40px auto;
  perspective: 1000px;
}

.carousel {
  width: 100%;
  height: 100%;
  position: absolute;
  transform: translateZ(-288px);
  transform-style: preserve-3d;
  transition: transform 1s;
}

.cell {
  position: absolute;
  width: 380px;
  height: 580px;
  left: 10px;
  top: 10px;
  border: 2px solid black;
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 10px;
  box-sizing: border-box;
}

.cell:nth-child(1) {
  background: #0c0c0ccc;
  transform: rotateY(0deg) translateZ(275px);
}
.cell:nth-child(2) {
  background: #ffffffcc;
  transform: rotateY(72deg) translateZ(275px);
}
.cell:nth-child(3) {
  background: #46085acc;
  transform: rotateY(144deg) translateZ(275px);
}
.cell:nth-child(4) {
  background: #bf0e12cc;
  transform: rotateY(216deg) translateZ(275px);
}
.cell:nth-child(5) {
  background: #0b2c67cc;
  transform: rotateY(288deg) translateZ(275px);
}

.button-group {
  text-align: center;
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.previous-button,
.next-button,
button:not(.previous-button):not(.next-button) {
  border: none;
  outline: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
  background-color: #4CAF50;
}

.previous-button:hover,
.next-button:hover,
button:not(.previous-button):not(.next-button):hover {
  background-color: #2edbdc;
  color: white;
  font-weight: 700;
}

.cell img {
  width: 100%;
  height: 72%;
  object-fit: cover;
}
</style>