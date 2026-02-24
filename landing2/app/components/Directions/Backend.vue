<template>
    <div class="direction_items">
        <div class="item">
            <span>Nest.Js</span>
            <div class="image" :style="{backgroundImage: `url(${Vue})`}"> </div>
        </div>

        <div class="item">
            <span>Express.Js</span>
            <div class="image" :style="{backgroundImage: `url(${React})`}"> </div>
        </div>

        <div class="item">
            <span>CQRS</span>
            <div class="image" :style="{backgroundImage: `url(${TS})`}"> </div>
        </div>

        <div class="item">
            <span>JS</span>
            <div class="image" :style="{backgroundImage: `url(${JS})`}"> </div>
        </div>

        <div class="item">
            <span class="image">FSD</span>
            <div :style="{backgroundImage: `url(${FSD})`}"> </div>
        </div >
    </div>
</template>

<script setup lang="ts">
import Vue from '../../../public/assets/vue.png'
import React from '../../../public/assets/react.png'
import TS from '../../../public/assets/ts.png'
import JS from '../../../public/assets/js.png'
import FSD from '../../../public/assets/fsd.svg'
 
 
 
</script>

<style lang="scss" scoped>
.direction_items {
    & span {
        color: rgb(167, 18, 18);
        font-size: 2rem;
        font-weight: 700;
    }
}

.image {
    width: 30rem;
    height: 15rem;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}

.item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: max-content;

    &:nth-child(1) {
        transform: translate(20%, 15%);
    }
    &:nth-child(2) {
        transform: translate(100%, 34%);
    }
    &:nth-child(3) {
        transform: translate(120%, 64%);
    }
    &:nth-child(4) {
        transform: translate(42%, 56%);
    }
    &:nth-child(5) {
        transform: translate(248%, -366%);
    }
}
</style>