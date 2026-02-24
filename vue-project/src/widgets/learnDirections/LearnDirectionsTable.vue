<template>
    <EmptyContainer>
        <section v-if="learnDirectionsWithIndex.length">
            <el-table
                :data="learnDirectionsWithIndex"
                style="width: 100%"
                data-testid="learn-direction-table"
            >
                <el-table-column prop="index" label="#" width="80" />
                <el-table-column prop="id" label="ID" width="80" />
                <el-table-column prop="title" label="Название"/>
                <el-table-column fixed="right" width="180" label="Действия">
                    <template #default="props">
                        <div class="actions">
	                        <OpenModal
		                        :modalProps="{title: 'Измените название', id: learnDirections.learnDirections[props.$index]?.id || 0}"
		                        :modalComponent="EditLearnDirection"
	                        >
		                        <el-tooltip content="Изменить" placement="bottom">
			                        <el-button :data-testid="`learn-direction-edit-open-${learnDirections.learnDirections[props.$index]?.id || 0}`">
				                        <el-icon>
					                        <Edit/>
				                        </el-icon>
			                        </el-button>
		                        </el-tooltip>
	                        </OpenModal>
                            <DeleteLearnDirection :id="learnDirections.learnDirections[props.$index]?.id || 0"/>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </section>
    </EmptyContainer>
</template>

<script lang="ts" setup>
import { useLearnDirectionStore } from '@/features/learnDirections/store';
import { computed, onMounted } from 'vue';


import DeleteLearnDirection from '@/features/learnDirections/components/DeleteLearnDirection.vue';
import EditLearnDirection from '../../features/learnDirections/components/EditLearnDirection.vue';
import EmptyContainer from '../common/EmptyContainer.vue';
import OpenModal from "@/features/common/OpenModal.vue";

const learnDirections = useLearnDirectionStore()

const learnDirectionsWithIndex = computed(() => learnDirections.learnDirections.map((ld, index) => ({ ...ld, index: index + 1})));
onMounted(() => {
    try {
        learnDirections.getAll();
    } catch {

    }
})
</script>

<style lang="scss" scoped>
.actions {
    display: grid;
	grid-template-columns: repeat(auto-fit, minmax(2rem, max-content));
	column-gap: .4rem;
}
</style>
