<template>
    <div class="direction_items">
        <div>
            <div class="top-text">
                <h3 class="title">{{ title }}</h3>
                <p class="subtitle">{{ text }}</p>
            </div>

            <div class="back">
           
            </div>
        </div>
 
        <div class="main-tab">
            <div class="tabs-cards">
                <DirectionCard v-for="value in items" :item="value"/>
            </div>

            <div class="secondary-tab">
                <h3>Ты сможешь</h3>
                <div class="tabs-cards">
    
                    <DirectionCard v-for="value in achievments" :item="value"/>
                </div> 
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import DirectionCard from './DirectionCard.vue'
 
interface IProps {
    items: {title: string}[]
    achievments: {title: string}[]
    text: string
    title: string
}
defineProps<IProps>();
 

 
 
</script>

<style lang="scss" scoped>
.direction_items {
    position: relative;
    display: grid;
    grid-template-rows: max-content 1fr;
    padding-top: 5rem;

    @media screen and (max-width: 1024px) {
        padding: 2rem 5rem 0;
    }
}

.top-text {
    display: grid;
    row-gap: 3rem;
    grid-template-columns: 40%;

    @media screen and (max-width: 768px) {
        grid-template-columns: 100%;
    }
}

.title {
    font-size: 5rem;
    font-weight: 700;
  color: #40e0c0;
}

.main-tab {
    display: grid;
    grid-template-rows: 1fr 1fr;
    row-gap: 2rem;
    background: linear-gradient(180deg, #f4f4f1 0%, #eeeeea 100%);
    border-radius: 2rem 2rem 0 0;
    padding: 4rem;

    @media screen and (max-width: 768px) {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        gap: 3rem;
    }
}
 
 .tabs-cards {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 100%;
    gap: 3rem;
    height: 100%;

    &:after {
        content: "";
        position: absolute;
        bottom: 1.4rem;
        left: 50%;
        transform: translateX(-50%);
        width: 102%;
        height: 2.8rem;
        background: rgb(45, 27, 74);
        filter: blur(3rem);
        border-radius: 50%;
        z-index: 1;
    }

    @media screen and (max-width: 768px) {
        grid-template-columns: 1fr;
        grid-template-rows: unset;
        gap: 3rem;
    }
 }

 .secondary-tab {
    display: grid;
    grid-template-rows: max-content 1fr;
    row-gap: 2rem;

    @media screen and (max-width: 768px) {
        display: none;        
    }
 }
 
 .subtitle {
   font-size: 2rem;

   @media screen and (max-width: 1024px) {
     font-size: 3rem;
   }
 }
</style>