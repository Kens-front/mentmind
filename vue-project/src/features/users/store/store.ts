import { defineStore } from "pinia";
import {computed, reactive, ref, type Reactive, watch} from "vue";
import { RoleList, USER_LEVEL, USER_STATUSES, type IUpdateUserFull, type IUser, type IUserForm, type IUserFull, type IUserUpdateForm, type TUserFull, type TUserFullSpread } from "../types";
import { userApi, type TProfile } from "../api";
import type { LESSON_TYPES } from "@/features/lessons/types";
import {useAuthStore} from "@/features/auth/store";


export interface IMentorProfile {
    learn_directions: []
    userId: number
}

export interface IStudentProfile {
    learn_direction: []
    user: TUserFull
    lessonFormat: LESSON_TYPES
}

export const useUserStore = defineStore('users', () => {
    const users = ref<(TUserFullSpread & { index: number, availableLessons?: number })[]>([]);

    const updateUser = reactive({
        user: {
            first_name: '',
            last_name: '',
            email: '',
            login: '',
            phone: '',
            about: '',
            avatar: '',
            status: USER_STATUSES.ACTIVE,
            role: RoleList.STUDENT,
        },
        profile: {}
    }) as Reactive<IUserFull>


    const theme = ref((localStorage.getItem("theme") === 'true') || false);

    const newUser = reactive({
        user: {} as IUser,
        profile: {
        } as TProfile
    })

    const userWithoutAdmin = computed(() => users.value.filter(user => user.role !== RoleList.ADMIN));

    async function createUser(payload: IUserForm) {
        const { data } = await userApi.create({ ...payload, ...newUser.profile })
 
        const newItem = {
            id: data.user.id,

            first_name: data.user.first_name,

            last_name: data.user.last_name,

            email: data.user.email,

            phone: data.user.phone,

            role: data.user.role,

            login: data.user.login,

            status: data.user.status,

            fullname: data.user.fullname,

            deletedAt: data.user.deletedAt,

            student_profile: data.user?.student_profile,

            mentor_profile: data.user?.mentor_profile,

            chats: data.user.chats,
        } as TUserFullSpread

        const lastUserIndex = users.value[users.value.length - 1]?.index || 0
        users.value.push({ ...newItem, index: lastUserIndex + 1 })
    }

    async function getAll(query?: any) {
        const { data } = await userApi.getAll(query)
        users.value = data.map((user, index) => ({ ...user, index: index + 1 }));
    }

    async function getOne(id: number) {
        const { data } = await userApi.getOne(id)
        updateUser.user = data.user
        updateUser.profile = data.profile
    }

    async function getProfile() {
        const { data } = await userApi.getProfile()
        updateUser.user = data.user
        updateUser.profile = data.profile
    }

    async function update(id: number, form: IUserUpdateForm) {
        const { first_name, last_name, email, about, login, phone, status, learn_direction, learn_directions, mentorId, level, lessonFormat } = form

        const user = {
            first_name,
            last_name,
            email,
            login,
            phone,
            status,
            about,
        }

        const profile: { 
            [x: string]: number | number[] | USER_LEVEL | LESSON_TYPES;
            level: USER_LEVEL;
        } = {
            [updateUser.user.role === RoleList.MENTOR ? 'learn_directions' : 'learn_direction']: updateUser.user.role === RoleList.MENTOR ? learn_directions : learn_direction,
            level
        }

        if (updateUser.user.role === RoleList.STUDENT) {
            profile.mentorId = mentorId
            profile.lessonFormat = lessonFormat
        }

        return userApi.update(id, { user, profile })
    }

    /**
     * Обновление профиля пользователя
     * 
     * Отправляет один запрос с FormData, содержащим все данные и файл
     * 
     * @param id - ID пользователя
     * @param formData - FormData с данными формы и файлом
     * @param hasFile - флаг наличия файла (для дополнительной логики)
     */
    async function updateProfile(id: number, formData: FormData, hasFile: boolean) {
        return userApi.updateProfileWithFormData(id, formData)
    }

    /**
     * Обновление только аватара профиля
     * Используется для отдельного обновления аватара
     */
    async function updateProfileAvatar(form: FormData) {
        return userApi.updateProfileAvatar(form)
    }

    /**
     * АЛЬТЕРНАТИВНЫЙ ВАРИАНТ (если бэкенд не поддерживает единый FormData):
     * 
     * async function updateProfile(id: number, dto: IUserUpdateForm, avatarFormData: FormData | null, hasFile: boolean) {
     *     const promises = []
     *     
     *     // Обновляем данные пользователя
     *     promises.push(update(id, dto))
     *     
     *     // Если есть файл, отправляем его отдельным запросом
     *     if (hasFile && avatarFormData) {
     *         promises.push(updateProfileAvatar(avatarFormData))
     *     }
     *     
     *     return Promise.all(promises)
     * }
     */
    

    function setRole(role: RoleList) {
        newUser.user.role = role;
    }
    
    watch(theme, async (newVal) => {
        console.log(newVal)
        const html = document.querySelector('html');

        if (!html) return;

        if(html && !newVal) {
            html.classList.remove('dark');

            document.body.classList.add('light-theme');
        } else {
            html.classList.add('dark');

            document.body.classList.remove('light-theme');
        }

        localStorage.setItem('theme', `${html.classList.contains('dark')}`);
    }, {immediate: true})
    return {
        newUser,
        users,
        updateUser,
        userWithoutAdmin,
        createUser,
        setRole,
        getAll,
        update,
        getOne,
        getProfile,
        theme,
        updateProfile,
    }
})