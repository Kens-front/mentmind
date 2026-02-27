<template>
    <div class="page">
        <h1 class="title-c">Менторы</h1>

        <UpdateUserForm>
            <UpdateUser :id="+id" :role="RoleList.MENTOR"/>
        </UpdateUserForm>
    </div>
</template>

<script setup lang="ts">
import { useLearnDirectionStore } from '@/features/learnDirections/store';
import   UpdateUser from '@/features/users/components/UpdateUser.vue';
import { useUserStore } from '@/features/users/store/store';
import UpdateUserForm  from '@/widgets/persons/UpdateUserForm.vue';
import { useAuthStore } from '@/features/auth/store';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { RoleList } from '@/features/users/types';

const route = useRoute()
const id = typeof route.params?.id === 'string' ? route.params.id : '0';

const authStore = useAuthStore()
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