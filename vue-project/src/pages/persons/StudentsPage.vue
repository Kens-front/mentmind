<template>
    <div class="page">
        <CreateUserForm>
            <div class="top">
                <h1>Студенты</h1>

                <OpenCreateUserModal 
                    v-if="setVisibleElement([RoleList.ADMIN])"
                    button-title="Создать студента" 
                    :role="RoleList.STUDENT"
                />
            </div>
        </CreateUserForm>
        
        <GetAllUsers :role="RoleList.STUDENT" :columns="STUDENTS_TABLE_COLUMNS" :only-group="mentorId ? 1: 0">
            <template #create-lesson="{student}">
                <OpenCreateLessonModal  
                    v-if="(setVisibleElement([RoleList.MENTOR]) && mentorId) && (student?.availableLessons) "
                    kind="base" 
                    :student-ids="[student?.id || 0]" 
                    :mentor-id="mentorId"
                >
                    <el-tooltip placement="bottom" content="Создать занятие">
                        <el-button data-cy="open-create-lesson"><el-icon><Tickets/></el-icon></el-button>
                    </el-tooltip>
                </OpenCreateLessonModal>
            </template>

            <template v-if="setVisibleElement([RoleList.ADMIN])" #link="props">
                <OpenUserPage :link="props.link"/>
            </template>
        </GetAllUsers>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/features/auth/store';
import { useSetVisibleElement } from '@/features/common/composables/set-visible-element';
import { useLearnDirectionStore } from '@/features/learnDirections/store';
import OpenCreateLessonModal from '@/features/lessons/components/OpenCreateLessonModal.vue';
import GetAllUsers  from '@/features/users/components/GetAllUsers.vue';
import OpenCreateUserModal  from '@/features/users/components/OpenCreateUserModal.vue';
import OpenUserPage from '@/features/users/components/OpenUserPage.vue';
import { STUDENTS_TABLE_COLUMNS } from '@/features/users/constants/students-table-columns';
import { RoleList } from '@/features/users/types';
import CreateUserForm  from '@/widgets/persons/CreateUserForm.vue';
import { Tickets, Operation } from '@element-plus/icons-vue';
import { computed, onMounted } from 'vue';


const {setVisibleElement} = useSetVisibleElement();
 
const authStore = useAuthStore()
const role = authStore.userData.user?.role ?? RoleList.STUDENT;
const learnDirectionStore = useLearnDirectionStore();
 
const mentorId = computed<number | null>(() => {
    const user = authStore.userData.user;
    return user?.role === RoleList.MENTOR ? user.id : null;
});

 
onMounted(() => {
    try {
        learnDirectionStore.getAll();
    } catch(e) {
        console.error('Failed to load directions', e);
    }
})
</script>

<style lang="scss" scoped>
.top {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>