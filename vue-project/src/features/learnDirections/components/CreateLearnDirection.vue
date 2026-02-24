<template>
    <el-form 
        ref="formRef"
        class="form"
        label-position="top"
        :rules="rules"
        :model="form"
        @submit.prevent="create" 
    >
        <el-form-item label="Учебное направление">
            <el-input 
                v-model="form.title" 
                placeholder="Введите название учебного направления, например Javascript..."
                data-testid="learn-direction-input"
            />
        </el-form-item>

        <el-form-item>
            <el-button 
                native-type="submit" 
                data-testid="learn-direction-submit"
                :style="{width: '100%'}"
            >
                Создать
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts" setup>
import { notifySuccess } from '@/shared/config/notifications';
import { useLearnDirectionStore } from '../store';
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';

interface RuleForm {
  title: string
}
const learnDirectionStore = useLearnDirectionStore();

const formRef = ref<FormInstance>()

const form = reactive<RuleForm>({
    title: ''
})

const rules: FormRules = reactive({
    title: [
        {required: false, message: 'Обязательное поле', trigger: 'blur'},
        {min: 2, message: 'Длина не менее 2 символов', trigger: 'blur'},
    ]
})
async function create() {
    if (!formRef.value) {
        return
    }

    await formRef.value.validate(async valid => {
        if (!valid) {
            return;
        }

        try {
            await learnDirectionStore.create(form)
            form.title = ''
            notifySuccess('Учебное направление успешно создано')
        } catch {

        }
    })
}
</script>

<style lang="scss" scoped>
.form {
    display: grid;
    grid-template-columns: 90% 1fr;
    align-items: end;
    column-gap: 1rem;
}
</style>