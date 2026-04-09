<template>
  <div ref="container" class="monaco-root"   />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import loader from '@monaco-editor/loader'

const props = defineProps<{
  modelValue?: string
  language?: string
  theme?: 'vs' | 'vs-dark' | 'hc-black'
  height?: string
  readOnly?: boolean
  options?: Record<string, any>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'ready', editor: any): void
}>()

const container = ref<HTMLElement | null>(null)
let editor: any = null
let monaco: any = null

onMounted(async () => {
  // ✅ Загружаем Monaco ТОЛЬКО при монтировании компонента
  // ✅ Воркеры подгружаются динамически с CDN, не копируются в сборку
  monaco = await loader.init()

  editor = monaco.editor.create(container.value!, {
    value: props.modelValue || '',
    language: props.language || 'typescript',
    theme: props.theme || 'vs-dark',
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    readOnly: props.readOnly || false,
    ...props.options
  })

  editor.onDidChangeModelContent(() => {
    emit('update:modelValue', editor.getValue())
  })

  emit('ready', editor)
})

// Синхронизация v-model
watch(() => props.modelValue, (newVal) => {
  if (editor && newVal !== editor.getValue()) {
    editor.setValue(newVal || '')
  }
})

onBeforeUnmount(() => {
  editor?.dispose()
})
</script>

<style scoped>
.monaco-root {
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}
</style>