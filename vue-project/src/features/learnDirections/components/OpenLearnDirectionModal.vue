<script setup lang="ts">
import { useModal } from '@/features/modal/useModal';
import { Edit } from '@element-plus/icons-vue';
import EditLearnDirection from './EditLearnDirection.vue';
import { useLearnDirectionStore } from '../store';
import { markRaw } from 'vue';

interface IProps {
    id: number
}

const {id} = defineProps<IProps>();
const modal = useModal()
const {openModal} = modal()
 
function onClick() {
    openModal(markRaw(EditLearnDirection), {title: 'Измените название', id })
}
</script>

<template>
    <el-tooltip content="Изменить" placement="bottom">
        <el-button @click="onClick" :data-testid="`learn-direction-edit-open-${id}`">
            <el-icon>
                <Edit/>
            </el-icon>
        </el-button>
    </el-tooltip>
</template>