<script setup lang="ts">
interface Props {
  time: string
  date: string
  link: string
}

const {time, date, link} = defineProps<Props>()
</script>

<template>
  <el-form label-position="top">
    <el-form-item label="Время">
      <el-input :modelValue="time" disabled />
    </el-form-item>

    <el-form-item label="Дата">
      <el-input :modelValue="date" disabled />
    </el-form-item>

    <el-form-item label="Ссылка на сессию">
      <el-input :modelValue="link" disabled />
    </el-form-item>
    
    <el-button>
      Провести
    </el-button>
  </el-form>
</template>

<style scoped lang="scss">

</style>