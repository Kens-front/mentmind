<template>
    <div class="page">
        <UpdateUserForm>
            <UpdateProfile 
                :role="role" 
                :id="authStore.userData?.user?.id || 0"
                :learn-directions="directions"
            />
        </UpdateUserForm>
    </div>
</template>

<script setup lang="ts">
import { useLearnDirectionStore } from '@/features/learnDirections/store';
import   UpdateUser from '@/features/users/components/UpdateUser.vue';
import { useUserStore } from '@/features/users/store/store';
import UpdateUserForm  from '@/widgets/persons/UpdateUserForm.vue';
import { useAuthStore } from '@/features/auth/store';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { RoleList } from '@/features/users/types';
import UpdateProfile from '@/features/users/components/UpdateProfile.vue';
import {format} from "date-fns";

const route = useRoute()
 
const authStore = useAuthStore()
const userStore = useUserStore();
const learnDirection = useLearnDirectionStore()

const directionsByRole = {
    [RoleList.MENTOR]: 'learn_directions',
    [RoleList.STUDENT]: 'learn_direction',
    [RoleList.ADMIN]: null,
}
 
const role = computed(() => authStore.userData.user?.role)
 


const directions = computed(() => {
    if (!role.value) {
        return false
    }

    const titleDirection = directionsByRole[role.value]


    if (!titleDirection) {
        return false
    }

    //@ts-ignore
    const directionData = userStore.updateUser?.profile?.[titleDirection];

    if (directionData && typeof directionData === 'number') {
        return [learnDirection.options.find(option => option.value === directionData)];
    }
 
    return learnDirection.options.filter(option => directionData?.includes(option.value)) || false;
})

 
onMounted(async () => {
    try {
 
       await Promise.allSettled([userStore.getProfile(), learnDirection.getAll()])
    } catch {

    }
})
</script>

<style lang="scss" scoped>
.page {
    grid-template-rows: 100%;
    height: 100%;
}
.top {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>