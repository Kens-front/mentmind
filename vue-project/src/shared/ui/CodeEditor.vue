

<template>
  <div class="content">
    <el-select v-model="language">
      <el-option 
        v-for="option of languages"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </el-select>
    <transition name="fade" mode="out-in">
      <CodeEditor
          v-if="language"
          :key="language"
          :value="modelValue"
          :options="editorOptions"
          :language="language"
          theme="vs-dark"
          @change="emits('update:model-value', $event)"
      />
    </transition>
  </div>
 
</template>

<script setup lang="ts">
import { CodeEditor } from 'monaco-editor-vue3';
import { ref } from 'vue';
interface IProps {
    modelValue: string
}

const {} = defineProps<IProps>()
const emits = defineEmits(['update:model-value'])
 
 
const languages = ref([
  {label: 'HTML', value: 'html'},
  {label: 'CSS', value: 'css'},
  {label: 'Javascript', value: 'javascript'},
  {label: 'Typescript', value: 'typescript'},
  {label: 'Vue', value: 'vue'},
])

const language = ref(languages.value[2])
const editorOptions = {
  fontSize: 14,
  minimap: { enabled: false },
  automaticLayout: true
};
</script>

<style lang="scss" scoped>
.content {
  display: grid;
  grid-template-rows: max-content 1fr;
  height: 100%;
  row-gap: 2rem;
}
</style>