<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import {notifySuccess} from "@/shared/config/notifications.ts";
import {planApi} from "@/features/plan/api";

interface IProps {
  userId: number
}

const {userId} = defineProps<IProps>()
const activeNames = ref<string[]>([])

const items = ref<{title: string, description: string} []>([])
const title = ref<string>('')

 
const fullPlane = computed(() => {
  return items.value.reduce((acc, item) => {
    return acc + `<h2>${item.title}</h2>${item.description}</h2>`
  }, ``)
})
 
async function getPlan(){
  const {data} = await planApi.getOne(userId)
  items.value = JSON.parse(data.items)
}


async function savePlan(){
  await planApi.create({items: JSON.stringify(items.value), userId})
}
async function addItem() {
  try {
    items.value.push({title: title.value, description: ''})

    title.value = ''

    await savePlan()
    notifySuccess('Пункт создан')    
  } catch {
    
  }
 
}

function changeItem($event: any) {
  const target = $event.target
  if (target.tagName === 'STRONG') {
    const targeTextContent = target.textContent;
    const targetParent = target.parentElement

    targetParent.textContent = targeTextContent
  } 
  else {
    const targeTextContent = target.textContent;
    target.innerHTML = `<strong>${targeTextContent}</strong>`
  }
}
onMounted(() => {
  getPlan()
})
</script>

<template>
  <section>
    <el-form @submit.prevent="addItem" label-position="top">
      <el-form-item label="Название модуля">
        <el-input v-model="title" placeholder="Синтаксис языка"/>
      </el-form-item>
      <el-button native-type="submit">
        Добавить
      </el-button>
    </el-form>
    
    
    <el-collapse v-model="activeNames">
      <el-collapse-item 
          v-for="(item, index) of items" 
          :title="item.title" 
          :name="index.toString()"
      >
        <QuillEditor  
            v-model:content="item.description"
            content-type="html"
            theme="snow" 
            @blur="savePlan"
        />
      </el-collapse-item>
    </el-collapse>
  </section>
</template>

<style scoped lang="scss">

</style>