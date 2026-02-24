<template>
    <el-tooltip content="Удалить" placement="bottom">
        <el-button 
            :data-testid="`learn-direction-delete-${id}`"
            class="button"
            @click="onclick"
        >
            <el-icon><delete/></el-icon>
        </el-button>
    </el-tooltip>
</template>  

<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue';
import { useLearnDirectionStore } from '../store';
import { notifySuccess } from '@/shared/config/notifications';

interface IProps {
    id: number
}

const {id} = defineProps<IProps>();
const learnDirectionStore = useLearnDirectionStore()  

async function onclick() {
    await learnDirectionStore.deleteOne(id)
    notifySuccess('Удаление прошло успшено')
}
</script>

<style lang="scss">
.button {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>