<template>
    <div>
        <a @mouseenter="setHover(true)" @mouseleave="setHover(false)" :href="href" class="item" ref="item">
            <span v-if="!isHovered">{{ text }}</span>
            <span v-else>{{ hoveredText }}</span>
        </a>
    </div>
</template>

<script setup lang="ts">
import gsap from 'gsap';
import { ref } from 'vue';
interface IProps {
    text: string
    hoveredText?: string
    href: string
}

const {hoveredText} = defineProps<IProps>();
const isHovered = ref(false);
const item = ref(null);
function setHover(value: boolean) {
    if (!hoveredText) {
        return;
    }

    isHovered.value = value;
    
    const element = item.value as HTMLElement | null;

    if (value && element) {
        gsap.to(element, {
            height: `${element.offsetHeight + 10}px`,
        })
    }
    if (!value && element) {
        gsap.to(element, {
            height: '8rem',
        })
    }
}
</script>

<style lang="scss" scoped>
 .item {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 8rem;
	padding: 4rem 0;
	font-size: 1.6rem;
	border-top: 1px solid #2D2A38;
	border-bottom: 1px solid #2D2A38;

    text-transform: uppercase;
    font-weight: 700;
	& span {
        writing-mode: vertical-rl;  
        white-space: nowrap;
        display: block;
	}
}

</style>