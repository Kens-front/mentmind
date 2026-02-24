<template>
    <el-form 
        :model="form"
        :rules="rules"
        class="form"       
        label-position="top"
        ref="formRef"
        @submit.prevent="onSubmit" 
    >
        <el-form-item label="Логин">
            <el-input data-testid="login-input" v-model="form.login"  placeholder="Ваш логин" />
        </el-form-item>

        <el-form-item label="Пароль"> 
            <el-input 
                data-testid="password-input" 
                v-model="form.password"  
                placeholder="Ваш пароль" 
                type="password"
                show-password
            />
        </el-form-item>
        <p v-if="errorMessage">{{ errorMessage }}</p>
        <el-button 
            data-testid="submit-btn"
            :disabled="isDisabled" 
            class="btn"
            native-type="submit"
        >
            Войти
        </el-button>
    </el-form>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { useAuthStore } from '../store';
import { useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
 
interface RuleForm {
    login: string
    password: string
}
const authStore = useAuthStore()
const router = useRouter();

const formRef = ref<FormInstance>();
const form = reactive<RuleForm>({
    login: '',
    password: ''
})

const rules: FormRules = reactive({
    login: [
        {required: true, message: 'Обязательное поле', trigger: 'blur'},
        {min: 4, message: 'Длина не менее 4 символов', trigger: 'blur'},
    ],
    
    password: [
        {required: true, message: 'Обязательное поле', trigger: 'blur'},
    ]
})
const isLoading = ref(false);
const errorMessage = ref('');

const isDisabled = computed(() => !form.login || !form.password || isLoading.value);

async function onSubmit() {
    if (!formRef.value) {
        return
    }

    await formRef.value.validate(async valid => {
        if (!valid) {
            return;
        }

        try {
            await authStore.login(form)
            router.push('/');
        } catch {

        }
    })
}
</script>


<style lang="scss" scoped>
.form {
    display: grid;
    padding: 1.2rem;
    border: 1px solid rebeccapurple;
    border-radius: 1rem;
}

 
</style>