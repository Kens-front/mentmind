<script setup lang="ts">

import {Delete} from "@element-plus/icons-vue";
import {useGroupStore} from "@/features/groups/store";
import {notifySuccess} from "@/shared/config/notifications.ts";
interface IProps {
  id: number
}
const {id} = defineProps<IProps>()

const groupStore = useGroupStore()
async function deleteGroup() {
  try {
    await groupStore.deleteOne(id)
    notifySuccess('Удаление прошло успешно')
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <el-button @click="deleteGroup">
<!--    <el-icon><Delete/></el-icon>-->
    {{id}}
  </el-button>
</template>

<style scoped lang="scss">

</style>