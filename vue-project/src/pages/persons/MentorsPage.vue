<template>
    <div class="page">
        <CreateUserForm>
            <div class="top">
                <h1>Менторы</h1>

                <OpenCreateUserModal button-title="Создать ментора" :role="RoleList.MENTOR"/>
            </div>
        </CreateUserForm>
        
        <GetAllUsers :role="RoleList.MENTOR" :columns="MENTORS_TABLE_COLUMNS">
            <template #link="props">
                <OpenUserPage :link="props.link"/>
            </template>
        </GetAllUsers>
    </div>
</template>

<script setup lang="ts">
import GetAllUsers  from '@/features/users/components/GetAllUsers.vue';
import OpenCreateUserModal  from '@/features/users/components/OpenCreateUserModal.vue';
import CreateUserForm  from '@/widgets/persons/CreateUserForm.vue';
import OpenUserPage from '@/features/users/components/OpenUserPage.vue';
import { MENTORS_TABLE_COLUMNS } from '@/features/users/constants/mentors-table-column';
import { RoleList } from '@/features/users/types';
import { useLearnDirectionStore } from '@/features/learnDirections/store';
import { onMounted } from 'vue';


const learnDirectionStore = useLearnDirectionStore();

onMounted(() => {
    try {
        learnDirectionStore.getAll();
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