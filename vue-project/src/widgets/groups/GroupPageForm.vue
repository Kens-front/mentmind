<template>
	<div class="top">
		<h1>Группы</h1>

		<OpenModal v-bind="modalData">
			<el-button>Создать группу</el-button>
		</OpenModal>
	</div>
</template>

<script setup lang="ts">
import OpenModal from '@/features/common/OpenModal.vue'
import CreateStudentGroup from '@/features/groups/components/CreateStudentGroup.vue'

const modalData = {
	modalComponent: CreateStudentGroup,
	modalProps: {
		title: 'Создать новую группу'
	}
}
</script>

<style lang="scss">
.top {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
</style>
