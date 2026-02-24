<template>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      data-cy="create-user-modal"
      class="form"
      label-position="top"
      @submit.prevent="onSubmit"
    >
      <el-form-item label="Имя" prop="first_name">
        <el-input
          v-model="form.first_name"
          data-cy="first-name"
          placeholder="Имя"
        />
      </el-form-item>
  
      <el-form-item label="Фамилия" prop="last_name">
        <el-input
          v-model="form.last_name"
          data-cy="last-name"
          placeholder="Фамилия"
        />
      </el-form-item>
  
      <el-form-item label="Email" prop="email">
        <el-input
          v-model="form.email"
          data-cy="email"
          placeholder="Email"
        />
      </el-form-item>
  
      <el-form-item label="Логин" prop="login">
        <el-input
          v-model="form.login"
          data-cy="login"
          placeholder="Логин"
        />
      </el-form-item>
  
      <el-form-item label="Телефон" prop="phone">
        <el-input
          v-model="form.phone"
          data-cy="phone"
          placeholder="Телефон"
          v-maska="'+7(###)###-####'"
        />
      </el-form-item>
  
      <el-form-item label="Пароль" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          show-password
          data-cy="password"
          placeholder="Пароль"
        />
      </el-form-item>
  
      <el-form-item label="Учеба">
        <slot />
      </el-form-item>
  
      <el-form-item label="Действия">
        <ModalControllers />
      </el-form-item>
    </el-form>
  </template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import ModalControllers from '@/features/common/ModalControllers.vue'
import { useUserStore } from '../store/store'
import { notifySuccess } from '@/shared/config/notifications'
import { RoleList, type IUserForm } from '../types'

interface IProsp {
    role: RoleList
}
const {role} = defineProps<IProsp>()
const emits = defineEmits(['close'])
const userStore = useUserStore()

const formRef = ref<FormInstance>()

const form = reactive<IUserForm>({
    first_name: '',
    last_name: '',
    email: '',
    login: '',
    phone: '',
    password: '',
    role
})

const rules: FormRules = {
first_name: [
    { required: true, message: 'Введите имя', trigger: 'blur' },
    { min: 2, message: 'Минимум 2 символа', trigger: 'blur' },
],
last_name: [
    { required: true, message: 'Введите фамилию', trigger: 'blur' },
    { min: 2, message: 'Минимум 2 символа', trigger: 'blur' },
],
email: [
    { required: true, message: 'Введите email', trigger: 'blur' },
    {
    type: 'email',
    message: 'Некорректный email',
    trigger: ['blur', 'change'],
    },
],
login: [
    { required: true, message: 'Введите логин', trigger: 'blur' },
    { min: 4, message: 'Минимум 4 символа', trigger: 'blur' },
],
phone: [
    { required: true, message: 'Введите телефон', trigger: 'blur' },
    {
    pattern: /^\+7\(\d{3}\)\d{3}-\d{4}$/,
    message: 'Формат: +7(999)999-9999',
    trigger: 'blur',
    },
],
password: [
    { required: true, message: 'Введите пароль', trigger: 'blur' },
    { min: 6, message: 'Минимум 6 символов', trigger: 'blur' },
],
}

async function onSubmit() {

    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
        if (!valid) return

        try {
            await userStore.createUser({ ...form })
            notifySuccess('Пользователь успешно создан')
            emits('close')
            formRef.value?.resetFields()
        } finally {
        }
    })
}
</script>

<style lang="scss" scoped>
.form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1rem;
}
</style>
