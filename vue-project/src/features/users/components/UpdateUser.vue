<template>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      data-cy="create-user-modal"
      class="form"
      @submit.prevent="onSubmit"
    >
      <el-form-item label="Имя" prop="first_name">
        <el-input v-model="form.first_name" data-cy="first-name" />
      </el-form-item>
  
      <el-form-item label="Фамилия" prop="last_name">
        <el-input v-model="form.last_name" data-cy="last-name" />
      </el-form-item>
  
      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email" data-cy="email" />
      </el-form-item>
  
      <el-form-item label="Логин" prop="login">
        <el-input v-model="form.login" data-cy="login" />
      </el-form-item>
  
      <el-form-item label="Телефон" prop="phone">
        <el-input
          v-model="form.phone"
          data-cy="phone"
          v-maska="'+7(###)###-####'"
        />
      </el-form-item>
  
      <!-- МЕНТОР -->
      <el-form-item
        v-if="role === RoleList.MENTOR"
        label="Учебные направления"
        prop="learn_directions"
      >
        <el-select
          v-model="form.learn_directions"
          multiple
          data-cy="learn-direction-select"
        >
          <el-option
            v-for="item in learnDirectionStore.options"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
  
      <!-- НЕ МЕНТОР -->
      <el-form-item
        v-else
        label="Учебное направление"
        prop="learn_direction"
      >
        <el-select v-model="form.learn_direction">
          <el-option
            v-for="item in learnDirectionStore.options"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="role === RoleList.MENTOR"
        label="Уровень ментора"
        prop="level"
      >
        <el-select
          v-model="form.level"
          data-cy="learn-direction-select"
        >
          <el-option
            v-for="item in MENTOR_LEVELS"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
  
      <!-- СТУДЕНТ -->
      <el-form-item
        v-if="role === RoleList.STUDENT"
        label="Ментор"
        prop="mentorId"
      >
        <el-select v-model="form.mentorId">
          <el-option
            v-for="item in mentorsOptions"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item  v-if="setVisibleElement([RoleList.MENTOR])" label="Мои навыки">
        <el-input-tag v-model="form.tags"/>
      </el-form-item>
  
      <el-form-item label="Статус" prop="status">
        <el-select v-model="form.status">
          <el-option
            v-for="item in USER_STATUSES"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Тип занятия" prop="lessonFormat">
        <el-select v-model="form.lessonFormat">
          <el-option
            v-for="item of USER_LESSON_FORMATS"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
  
      <el-form-item label="Действие">
        <div class="actions">
          <el-button type="primary" @click="onSubmit">
            Сохранить
          </el-button>

          <el-popconfirm 
            v-if="setVisibleElement([RoleList.ADMIN])"    
            title="Вы точно хотите добавить бонусное занятие?"
            placement="top-start"
            @confirm="addBonusConfirm"
            >
            <template #reference>
              <add-bonus-lesson :user-id="id"/>
            </template>
          </el-popconfirm>
          <slot name="bottom-button" />
        </div>
      </el-form-item>
    </el-form>
  </template>
<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '../store/store'
import { useLearnDirectionStore } from '@/features/learnDirections/store'
import { RoleList, type IUser, type IUserUpdateForm } from '../types'
import { userApi } from '../api'
import { MENTOR_LEVELS, USER_LESSON_FORMATS, USER_STATUSES } from '../constants'
import { notifySuccess } from '@/shared/config/notifications'
import AddBonusLesson from '@/features/lesson-package/components/AddBonusLesson.vue'
import { useSetVisibleElement } from '@/features/common/composables/set-visible-element'
import { lessonPackageApi } from '@/features/lesson-package/api'
import { tagsFromBackend } from '@/shared/helpers'
import { LESSON_STATUS, LESSON_TYPES } from '@/features/lessons/types'

interface IProps {
    id: number
    role: RoleList
}

const {setVisibleElement} = useSetVisibleElement()
const { id, role } = defineProps<IProps>()
const emits = defineEmits(['close'])

const formRef = ref<FormInstance>()
const mentorsOptions = ref<(IUser & { label: string; value: number })[]>([])

const userStore = useUserStore()
const learnDirectionStore = useLearnDirectionStore()

const source = userStore.updateUser

// локальная форма
const form = reactive({
    first_name: source.user.first_name,
    last_name: source.user.last_name,
    email: source.user.email,
    login: source.user.login,
    phone: source.user.phone,
    status: source.user.status,

    learn_direction: source.profile?.learn_direction,
    learn_directions: source.profile?.learn_directions ?? [],
    mentorId: source.profile?.mentorId ?? null,
    level: source.profile?.level,
    tags: tagsFromBackend(source.profile?.tags),
    lessonFormat: source.profile?.lessonFormat
}) as IUserUpdateForm

const rules: FormRules = {
    first_name: [{ required: true, message: 'Введите имя', trigger: 'blur' }],
    last_name: [{ required: true, message: 'Введите фамилию', trigger: 'blur' }],
    email: [
    { required: true, message: 'Введите email', trigger: 'blur' },
    { type: 'email', message: 'Некорректный email', trigger: 'blur' },
    ],
    login: [{ required: true, message: 'Введите логин', trigger: 'blur' }],
    phone: [
    { required: true, message: 'Введите телефон', trigger: 'blur' },
    {
        pattern: /^\+7\(\d{3}\)\d{3}-\d{4}$/,
        message: 'Формат +7(999)999-9999',
        trigger: 'blur',
    },
    ],
    status: [{ required: true, message: 'Выберите статус', trigger: 'change' }],

}

async function onSubmit() {
    try {
        if (!formRef.value) return

        await formRef.value.validate(async (valid) => {
            if (!valid) return

            await userStore.update(id, { ...form })
            notifySuccess('Пользователь успешно обновлён')
        })
    } catch {

    }
}

async function addBonusConfirm() {
  try {
        await lessonPackageApi.addBonus(id)
        notifySuccess('Занятие успешно добавлено')
    } catch {

    }
}

onMounted(async () => {
    await nextTick();
    if (role !== RoleList.STUDENT) return

    const { data } = await userApi.getAll({ role: RoleList.MENTOR })
        mentorsOptions.value = data.map((item) => ({
        ...item,
        label: item.fullname,
        value: item.id,
    }))
})


watch(userStore.updateUser, async () => {
    Object.assign(form, {
        first_name: source.user.first_name,
        last_name: source.user.last_name,
        email: source.user.email,
        login: source.user.login,
        phone: source.user.phone,
        status: source.user.status,
        level: source.profile.level,

        learn_direction: source.profile.learn_direction,
        learn_directions: source.profile.learn_directions ?? [],
        mentorId: source.profile.mentorId ?? null,
        lessonFormat: source.profile?.lessonFormat ?? null
    })
})
</script>
    

<style lang="scss" scoped>
.actions {
    display: grid;
    align-items: center;
    grid-template-columns: repeat(auto-fit, minmax(5rem, max-content));
    column-gap: 0.6rem;
    width: 100%;
}
.form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 1rem;
}
</style>
