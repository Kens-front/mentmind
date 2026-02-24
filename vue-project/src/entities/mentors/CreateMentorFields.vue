<template>
  <el-select 
    v-model="userStore.newUser.profile.learn_directions" 
    placeholder="Выбрать направления" 
    data-cy="learn-direction-select"
    multiple  
  >
    <el-option
      v-for="item in learnDirectionStore.options"
      :key="item.id"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script lang="ts" setup>
import { useLearnDirectionStore } from '@/features/learnDirections/store';
import { useUserStore } from '../../features/users/store/store';
import { onMounted } from 'vue';
import { RoleList } from '../../features/users/types';
const learnDirectionStore = useLearnDirectionStore()
const userStore = useUserStore();


onMounted(() => {
  userStore.setRole(RoleList.MENTOR);
})
</script>

<style lang="scss" scoped></style>
