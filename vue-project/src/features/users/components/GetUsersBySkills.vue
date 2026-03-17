<script setup lang="ts">
import {ref, watch} from "vue";
import {useUserStore} from "@/features/users/store/store.ts";
const userStore = useUserStore();
const tag = ref('')

async function onChange(tag: string= '') {
  try {
    await userStore.getUsersBySkill(tag)
  } catch (e) {
    console.error(e)
  }
}

watch(tag, async (newValue) => {
    onChange(newValue);
})
</script>

<template>
  <el-form label-position="top">
    <el-form-item label="Навык">
      <el-input v-model="tag" @change="onChange" placeholder="typescript" />
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">

</style>