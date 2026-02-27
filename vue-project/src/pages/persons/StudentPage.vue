<template>
    <div class="page">
        <h1 class="title-c">Студент</h1>

        <UpdateUserForm>
            <UpdateUser :id="+id" :role="RoleList.STUDENT">
                <template #bottom-button>
                    <open-create-lesson-modal kind="trial" :student-ids="[userStore.updateUser.user.id]">
                        <el-button data-cy="open-create-lesson">Создать пробное занятие</el-button>
                    </open-create-lesson-modal>
                </template>
            </UpdateUser>
        </UpdateUserForm>
    </div>
</template>

<script setup lang="ts">
import { useLearnDirectionStore } from '@/features/learnDirections/store';
import UpdateUser from '@/features/users/components/UpdateUser.vue';
import { useUserStore } from '@/features/users/store/store';
import { RoleList } from '@/features/users/types';
import UpdateUserForm  from '@/widgets/persons/UpdateUserForm.vue';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import OpenCreateLessonModal from '@/features/lessons/components/OpenCreateLessonModal.vue';

const route = useRoute()
const id = typeof route.params?.id === 'string' ? route.params.id : '0';


const userStore = useUserStore();
const learnDirection = useLearnDirectionStore()
 

onMounted(async () => {
    try {
        Promise.allSettled([learnDirection.getAll(), userStore.getOne(+id)])
    } catch {

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