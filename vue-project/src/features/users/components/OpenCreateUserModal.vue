<script setup lang="ts">
import { useModal } from '@/features/modal/useModal';
import { computed, markRaw, type Component } from 'vue';
import CreateUser from './CreateUser.vue';
import CreateMentorFields from '@/entities/mentors/CreateMentorFields.vue';
import { RoleList, type IUserColumn } from '../types';
import CreateStudentFields from '@/entities/students/CreateStudentFields.vue';
    
interface IProps {
    buttonTitle: string
    role: RoleList
}
 
const {buttonTitle, role} = defineProps<IProps>();

const PROFILE_SLOTS: Record<RoleList, Component> = {
    [RoleList.MENTOR]: CreateMentorFields,
    [RoleList.STUDENT]: CreateStudentFields,
    [RoleList.ADMIN]: CreateStudentFields,
}

const slotComponent = computed(() => PROFILE_SLOTS[role])
const modal = useModal()
const {openModal} = modal()
    
function onClick() {
    openModal(markRaw(CreateUser), {title: 'Создать ментора', slot: markRaw(slotComponent.value), role })
}
</script>

<template>
    <el-button data-cy="create-user-btn" @click="onClick">
        {{ buttonTitle }}
    </el-button>
</template>