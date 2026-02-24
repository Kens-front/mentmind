<template>
	<div @click="onClick" :class="$style.OpenModal">
		<slot />
	</div>
</template>

<script setup lang="ts">
import { type Component, markRaw } from "vue";
import { useModal } from "@/features/modal/useModal";

interface IProps {
	modalComponent: Component
	modalProps: any
}
const modal = useModal()
const {openModal} = modal()
const {modalComponent, modalProps} = defineProps<IProps>()

function onClick() {
	openModal(markRaw(modalComponent), modalProps)
}
</script>

<style lang="scss" module>
.OpenModal {
	//
}
</style>
