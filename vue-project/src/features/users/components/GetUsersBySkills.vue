<script setup lang="ts">
import {computed, ref, watch} from "vue";
import {useUserStore} from "@/features/users/store/store.ts";
import {addHours, format} from "date-fns";

const userStore = useUserStore();
const tag = ref('')
const date = ref(new Date())

const dto = computed(() => ({
  date: format(date.value, "yyyy-MM-dd"),
  start: format(date.value, "HH:mm"),
  end: format(addHours(date.value, 1), "HH:mm"),
}))

async function onChange(tag: string= '') {
  try {
    await userStore.getUsersBySkill({tag, ...dto.value})
  } catch (e) {
    console.error(e)
  }
}

watch(tag, async (newValue) => {
    onChange(newValue);
})

watch(date, async (newValue) => {
  onChange(tag.value);
})
</script>

<template>
  <el-form label-position="top">
    <el-form-item label="Навык">
      <el-input v-model="tag" placeholder="typescript" />
    </el-form-item>
    
    <el-form-item>
      <el-date-picker v-model="date" format="YYYY-MM-DD HH:mm" type="datetime"/>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">

</style>