<script setup lang="ts">
 
import {useModal} from "@/features/modal/useModal.ts";
import {markRaw} from "vue";
import CreatePsychologySession from "@/features/psychology-sessions/components/CreatePsychologySession.vue";

const modal = useModal()
const {openModal} = modal()

function onClick()  {
  openModal(markRaw(CreatePsychologySession), {title: 'Создать сессию'})
}
</script>

<template>
   <el-button @click="onClick">
     Создать сессию
   </el-button>
</template>

<style scoped lang="scss">

</style>