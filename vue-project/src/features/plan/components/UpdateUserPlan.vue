<script setup lang="ts">
import { onMounted, ref} from "vue";
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import {notifySuccess} from "@/shared/config/notifications.ts";
import {planApi} from "@/features/plan/api";
import Markdown from "@/shared/ui/Markdown.vue";
 
interface IProps {
  userId: number
}

 

const {userId} = defineProps<IProps>()
const text = ref<string>( ``)
 
 
async function getPlan(){
  const {data} = await planApi.getOne(userId)
  text.value = data.text
}


async function savePlan(){
  try {
    await planApi.create({text: text.value, userId})
    notifySuccess('Подпункты созданы')
  } catch {
    
  }
}

onMounted(() => {
  getPlan()
})
</script>

<template>
  <section>
    <el-collapse>
      <el-collapse-item title="Текстовый редактор"
      >
        <QuillEditor  
            v-model:content="text"
            content-type="text"
            theme="snow"
        />
        
        <el-button @click="savePlan">Сохранить</el-button>
      </el-collapse-item>
    </el-collapse>
    
     <Markdown :text="text"></Markdown>/
  </section>
</template>

<style lang="scss">
 
</style>