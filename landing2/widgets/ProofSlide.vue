<script setup lang="ts">
import type {ISlideProof} from "~/constnats/proofs";

interface IProps {
  slide: ISlideProof
}
const {slide} = defineProps<IProps>()

const {scroll} = useAutoScrollOnCycle()
</script>

<template>
  <div class="slide">
    <!-- СЮДА СТАВИШЬ СВОЮ КАРТИНКУ -->
    <NuxtImg :src="slide.image"  fit="contain" format="webp" alt="фон"  sizes="lg:100vw sm:50vw md:400px xs: 400px"/>

    <div class="overlay"></div>

    <div class="container">

      <!-- ЛЕВО -->
      <div class="left">
        <div class="badge">{{slide.label}}</div>

        <div class="title">{{slide.title}}</div>

<!--        <div class="subtitle">-->
<!--          {{slide.subtitle}}-->
<!--        </div>-->

        <div class="description">
          {{slide.subtitle}}
        </div>

        <button  @click="scroll" class="button">{{slide.cta}}</button>
      </div>

      <!-- ПРАВО -->
      <div class="card">

        <div class="kpi">
          <div class="icon">📈</div>
          <div class="kpi-title">{{slide.advantages[0]?.title}}</div>
          <div class="kpi-value">{{slide.advantages[0]?.value}}</div>
        </div>

        <div class="row">

          <div class="kpi">
            <div class="kpi-title">{{slide.advantages[1]?.title}}</div>
            <div class="kpi-value">{{slide.advantages[1]?.value}}</div>
          </div>

          <div class="kpi">
            <div class="kpi-title">{{slide.advantages[2]?.title}}</div>
            <div class="kpi-value">{{slide.advantages[2]?.value}}</div>
          </div>

          <div v-if="slide.trustBadge" class="trust" >
            <svg  width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 0L1 3v5c0 5.5 3 8 7 8s7-2.5 7-8V3L8 0z" fill="#10B981"/>
              <path d="M11 6L6.5 10.5L4 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{{slide.trustBadge}}</span>
          </div>
          
          <meta
              itemProp="keywords"
              :content="slide.seoKeywords.join(', ')"
          />

        </div>

      </div>

    </div>

  </div>
</template>

<style scoped lang="scss">
.slide {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

/* Фон */
.slide img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.5);
}

/* Градиент поверх */
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 30%, rgba(0,255,200,0.15), transparent 40%),
  linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.8));
  
  @media screen and (max-width: 1024px) {
    background: radial-gradient(circle at 30% 30%, rgb(0 3 255 / 15%), #00000000 40%), linear-gradient(180deg, rgba(0, 0, 0, 0.2), rgb(0, 0, 0, 1));
  }
}

/* Контейнер */
.container {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8rem;
}

/* Левая часть */
.left {
  max-width: 600px;
  
  @media screen and (max-width: 1024px) {
    display: grid;
    height: 100%;
    grid-template-rows: max-content max-content 1fr max-content;
    max-width: 100%;
  }
}

/* Бейдж */
.badge {
  display: inline-block;
  padding: 8px 16px;
  background: rgba(255,255,255,0.1);
  border-radius: 999px;
  font-size: 14px;
  margin-bottom: 20px;
  width: max-content;
}

/* Заголовок */
.title {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  
  @media screen and (max-width: 1024px) {
    font-size: 6rem;
  }
}

/* Подзаголовок */
.subtitle {
  font-size: 22px;
  opacity: 0.85;
  margin-bottom: 20px;
}

/* Описание */
.description {
  font-size: 18px;
  opacity: 0.7;
  line-height: 1.6;
  margin-bottom: 30px;
  
  @media screen and (max-width: 1024px) {
    font-size: 4rem;
  }
}

/* Кнопка */
.button {
  display: inline-block;
  padding: 14px 28px;
  background: linear-gradient(135deg, #00d4ff, #00ffa3);
  border-radius: 10px;
  font-weight: 600;
  color: #000;
  text-decoration: none;
  cursor: pointer;
  transition: 0.3s all;
  
  &:hover {
    scale: 1.05;
  }
  
  @media screen and (max-width: 1024px) {
    padding: 2rem 3rem;
    font-size: 3.2rem;
    text-align: center;
  }
}

/* Правая карточка */
.card {
  width: 50rem;
  padding: 30px;
  border-radius: 20px;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255,255,255,0.1);
  
  @media screen and (max-width: 1250px) {
    display: none;
  }
}

/* KPI блок */
.kpi {
  margin-bottom: 20px;
}

.kpi-title {
  font-size: 14px;
  opacity: 0.6;
}

.kpi-value {
  font-size: 2rem;
  padding: .4rem 0;
}

/* Иконки */
.icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

/* Нижняя строка */
.row {
  display: flex;
  justify-content: space-between;
}

.trust {
  font-size: 1.2rem;
  
  & span {
    padding-left: 1rem;
  }
}
</style>