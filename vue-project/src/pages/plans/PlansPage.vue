<script setup lang="ts">
import {computed, ref} from 'vue'
import {RoleList} from "@/features/users/types";
import {useSetVisibleElement} from "@/features/common/composables/set-visible-element.ts";
import {useAuthStore} from "@/features/auth/store";
import {PLANS_TABLE_COLUMNS} from "@/features/plan/constants";
import PlanUsersTable from "@/widgets/plans/PlanUsersTable.vue";


const {setVisibleElement} = useSetVisibleElement();


const authStore = useAuthStore()

const mentorId = computed<number | null>(() => {
  const user = authStore.userData.user;
  return user?.role === RoleList.MENTOR ? user.id : null;
});

</script>

<template>
  <div class="page">
    <h1>Индивидуальные планы</h1>

    <PlanUsersTable/>
  </div>
</template>

<style scoped lang="scss">

</style>