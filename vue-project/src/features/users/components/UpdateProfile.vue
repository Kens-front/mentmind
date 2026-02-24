<template>
    <section>
        <el-form class="profile_form" label-position="top">
            <div class="avatar-uploader-wrap">
                <el-upload
                    class="avatar-uploader"
                    :show-file-list="false"
                    :auto-upload="false"
                    :on-change="handleChange"
                    accept="image/*"
                >
                    <div v-if="!avatarUrl" class="el-upload">
                        <el-icon><Plus /></el-icon>
                    </div>

                    <div v-else class="image-wrapper">
                        <img :src="avatarUrl" class="image" />
                    </div>
                </el-upload>
            </div>
            <el-form-item label="Имя">
                <el-input v-model="form.first_name" placeholder="Иван"/>
            </el-form-item>

            <el-form-item label="Фамилия">
                <el-input v-model="form.last_name" placeholder="Иванов"/>
            </el-form-item>

            
            <el-form-item label="Телефон">
                <el-input v-model="form.phone" v-maska="'+7(###)###-####'" placeholder="+7912222222"/>
            </el-form-item>

            <el-form-item label="Email">
                <el-input v-model="form.email" placeholder="email@mail.ru"/>
            </el-form-item>
                        
            <el-form-item  v-if="setVisibleElement([RoleList.MENTOR, RoleList.STUDENT])" label="Статус">
                {{ status }}
            </el-form-item>

            <el-form-item  v-if="setVisibleElement([RoleList.MENTOR, RoleList.STUDENT])" label="Уровень">
                {{ level }}
            </el-form-item>

            

            <div v-if="setVisibleElement([RoleList.MENTOR])" class="textarea">
                <el-form-item label="О себе">
                    <el-input v-model="form.about" type="textarea" placeholder="Я родился ..."/>
                </el-form-item>
            </div>

            <el-form-item  v-if="setVisibleElement([RoleList.STUDENT])" label="Ментор">
                Ментор
            </el-form-item>

            <el-form-item  v-if="setVisibleElement([RoleList.MENTOR])" label="Мои навыки">
                <el-input-tag v-model="form.tags"/>
            </el-form-item>

            <el-form-item  v-if="setVisibleElement([RoleList.MENTOR, RoleList.STUDENT])" label="Учебное направление">
                <div class="tags">
                    <el-tag 
                        v-for="(tag, index) of learnDirections"
                        :key="tag?.label"
                        :type="COLORS[index]"
                        round
                >
                        {{ tag?.label }}
                    </el-tag>
                </div>
            </el-form-item>

            <div class="submit">
                <el-form-item label="Действия">
                    <el-button @click="onSubmit">Сохранить</el-button>
                </el-form-item>
            </div>
        </el-form>
    </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
 
import { useUserStore } from '../store/store'
import { RoleList, USER_LEVEL } from '../types'
import { useSetVisibleElement } from '@/features/common/composables/set-visible-element'
import { generateImageUrl, tagsFromBackend, tagsToBackend } from '@/shared/helpers'
import { notifySuccess } from '@/shared/config/notifications'
import { COLORS } from '@/shared/constants/colors'
import { MENTOR_LEVELS, USER_LEVELS, USER_STATUSES } from '../constants'

interface IProps {
    role: RoleList | undefined
    id: number
    learnDirections: {label: string, value: number, title: string, id: number} []  
}

const {role, id, learnDirections} = defineProps<IProps>()

const {setVisibleElement} = useSetVisibleElement();


const userStore = useUserStore()
 
const source = userStore.updateUser


async function login(){
  const response = await fetch('http://localhost:5000/auth/login', {method: "POST", headers: {'Content-Type': 'application/json', body: JSON.stringify({login: 'lizasi', password: 'Qwerty1'})}})
  const data = await response.json()
  console.log(data)
}

const imageFile = ref<File | null>(null)
const imageUrl = ref<string | null>(null);


const avatarUrl = computed(() => {
    return imageUrl.value ? imageUrl.value : generateImageUrl(source.user.avatar)
})

 
const form = reactive({
    first_name: source.user.first_name,
    last_name: source.user.last_name,
    email: source.user.email,
    login: source.user.login,
    phone: source.user.phone,
    status: source.user.status,
    about: source.user?.about,

    learn_direction: source.profile?.learn_direction,
    learn_directions: source.profile?.learn_directions ?? [],
    mentorId: source.profile?.mentorId ?? null,
    level: source.profile?.level,
    tags: tagsFromBackend(source.profile?.tags),
})
const status = computed(() => USER_STATUSES.find(item => item.value === form.status)?.label)
const level = computed(() =>  USER_LEVELS.find(item => item.value === form.level)?.label)


/**
 * Отправка формы обновления профиля
 * 
 * ВАРИАНТ 1 (ТЕКУЩИЙ): Все данные в одном FormData запросе
 * Этот метод отправляет все данные формы (текстовые поля + файл аватара) 
 * в одном FormData объекте. Это стандартный и наиболее корректный подход для форм с файлами.
 * 
 * ВАЖНО: Бэкенд должен поддерживать прием multipart/form-data на эндпоинте /user/full/:id
 * и корректно обрабатывать как текстовые поля, так и файл.
 * 
 * Преимущества:
 * - Один HTTP запрос вместо двух
 * - Атомарность операции (всё обновляется вместе)
 * - Стандартный подход для форм с файлами
 */
async function onSubmit() {
    try {
        const formData = new FormData()
 
        const payload: Record<'user' | 'profile' , Record<string, string | number | number [] | string []>> = {
            user: {},
            profile: {},
        }
        // Добавляем файл аватара, если он был выбран
        if (imageFile.value) {
            formData.append('avatar', imageFile.value)   
        }

        // Добавляем все текстовые поля формы
        // formData.append('first_name', form.first_name || '')
        // formData.append('last_name', form.last_name || '')
        // formData.append('email', form.email || '')
        // formData.append('phone', form.phone || '')

        payload.user['first_name'] = form.first_name || ''
        payload.user['last_name'] = form.last_name || ''
        payload.user['email'] = form.email || ''
        payload.user['phone'] = form.phone || ''
        
        // Добавляем поля, специфичные для роли
        if (form.about) {
            payload.user['about'] = form.about || ''
            // formData.append('about', form.about)
        }
        
        if (form.status) {
            // formData.append('status', form.status)
            payload.user['status'] = form.status || ''
        }
        
        if (form.level) {
            // formData.append('level', form.level)
            payload.profile['level'] = form.level || ''
        }

        // Добавляем роль
        if (role) {
            payload.user['role'] = role || ''
            // formData.append('role', role)
        }

        // Добавляем специфичные для профиля поля
        if (form.learn_direction) {
            payload.profile['learn_direction'] = form.learn_direction || ''
            // formData.append('learn_direction', String(form.learn_direction))
        }
        
        if (form.learn_directions && form.learn_directions.length > 0) {
            payload.profile['learn_directions'] = form.learn_directions || ''
            // formData.append('learn_directions', JSON.stringify(form.learn_directions))
        }
        
        if (form.mentorId) {
            payload.profile['mentorId'] = form.mentorId || ''
            // formData.append('mentorId', String(form.mentorId))
        }

        if (form.tags.length > 0) {
            payload.profile['tags'] = tagsToBackend(form.tags)
        }

        formData.append('user', JSON.stringify(payload.user));
        formData.append('profile', JSON.stringify(payload.profile));

        await userStore.updateProfile(id, formData, imageFile.value !== null)

        notifySuccess('Обновление прошло успешно')
    } catch (error) {
        console.error('Ошибка при обновлении профиля:', error)
    }
}

/**
 * АЛЬТЕРНАТИВНЫЙ ВАРИАНТ 2: Два отдельных запроса
 * 
 * Используйте этот вариант, если бэкенд НЕ поддерживает прием всех данных 
 * в одном multipart/form-data запросе.
 * 
 * async function onSubmit() {
 *     try {
 *         // Отправляем текстовые данные как обычный объект
 *         const dto = {
 *             first_name: form.first_name,
 *             last_name: form.last_name,
 *             email: form.email,
 *             phone: form.phone,
 *             about: form.about,
 *             status: form.status,
 *             level: form.level,
 *             learn_direction: form.learn_direction,
 *             learn_directions: form.learn_directions,
 *             mentorId: form.mentorId,
 *             role: role || ''
 *         }
 * 
 *         // Создаем FormData только для файла
 *         const avatarFormData = new FormData()
 *         if (imageFile.value) {
 *             avatarFormData.append('avatar', imageFile.value)
 *         }
 * 
 *         // Отправляем данные (store обработает два запроса)
 *         await userStore.updateProfile(id, dto, avatarFormData, imageFile.value !== null)
 * 
 *         notifySuccess('Обновление прошло успешно')
 *     } catch (error) {
 *         console.error('Ошибка при обновлении профиля:', error)
 *     }
 * }
 */
 
const handleChange = (file: any) => {
  imageFile.value = file.raw
  imageUrl.value = URL.createObjectURL(file.raw)
}
 

watch(userStore.updateUser, async () => {
    Object.assign(form, {
        first_name: source.user.first_name,
        last_name: source.user.last_name,
        email: source.user.email,
        login: source.user.login,
        phone: source.user.phone,
        status: source.user.status,
        level: source.profile?.level,
        avatar: source.user?.avatar,
        about: source.user?.about,
        tags: tagsFromBackend(source.profile?.tags),

        learn_direction: source.profile?.learn_direction,
        learn_directions: source.profile?.learn_directions ?? [],
        mentorId: source.profile?.mentorId ?? null,
    })
})
</script>

<style lang="scss">
.profile {
    &_form {
        position: relative;
        display: grid;
        grid-template-columns: 1fr 3fr;
        column-gap: 2rem;
    }
}


.avatar-uploader {
    position: relative;
    border: 1px dashed rgba(238, 130, 238, 0.511);
    transition: 1s;
    
    &-wrap {
        display: grid;
        grid-template-rows: 100%;
        grid-row: 4 span;
        margin-bottom: 2rem;
    }

    .el-upload {
        width: 100%;
        height: 100%;
    }

    &:hover {
        border: 1px dashed violet;
    }

    & .actions {
        position: absolute;
        top: 50%;
        display: grid;
        grid-template-columns: max-content max-content;
        width: 100%;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        transform: translateY(-50%);
    }
}

.submit {
    display: grid;
    grid-template-columns: 100%;
    grid-column: 2 / 3;
}

.textarea {
    display: grid;
    grid-column: 2 span;
    min-height: 20rem;

    & .el-form-item  {
        display: grid;
        grid-template-rows: max-content;
    }

    & .el-textarea {
        height: 100%;
    }

    & textarea {
        height: 100%;
    }
}

.image {
    object-fit: cover;

    &-wrapper {
        display: grid;
        grid-template-rows: 100%;
        height: 100%;
    }
}

.tags {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(5rem, max-content));
    column-gap: .4rem;
    width: 100%;
}
</style>