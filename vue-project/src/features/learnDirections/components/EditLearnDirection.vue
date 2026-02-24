<template>
    <form class="form" @submit.prevent="onSubmit">
        <el-input 
            v-model="learnDirectionStore.updatedDirection.title" 
            placeholder="Введите новое название..."
            data-testid="learn-direction-edit-input"
        />

        <div class="actions">
            <el-button data-testid="learn-direction-edit-save" native-type="submit">
                Сохранить
            </el-button>

            <el-button data-testid="learn-direction-edit-cancel" @click="emits('close')">
                Отмена
            </el-button>
        </div>
    </form>
</template>


<script setup lang="ts">
import { onMounted } from 'vue';
import { useLearnDirectionStore } from '../store';
import { notifySuccess } from '@/shared/config/notifications';

interface IProps {
    id: number
}

const emits = defineEmits(['close']);
const {id} = defineProps<IProps>()
const learnDirectionStore = useLearnDirectionStore()

async function onSubmit() {
    try {
        await learnDirectionStore.edit(id)
        notifySuccess('Изменние прошло успешно')
        emits('close')
    } catch {
        console.warn('error');
    }
}

onMounted(() => learnDirectionStore.setDefaultTitle(id))
</script>

<style lang="scss" scoped>
.form {
    display: grid;
    row-gap: 1rem;
}    

.actions {
    display: flex;
    justify-content: end;
}
</style>