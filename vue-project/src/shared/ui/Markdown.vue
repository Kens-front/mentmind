<script setup lang="ts">
import MarkdownIt from "markdown-it";
import MarkdownItTasklists from "markdown-it-task-lists";
interface IProps {
  text: string
}

const emits = defineEmits(["update:text"]);
const {text} = defineProps<IProps>()
const markdown = new MarkdownIt()
    .use(MarkdownItTasklists, )


</script>

<template>
  <div
      v-html="markdown.render(text)"
      class="markdown"
  />
</template>

<style scoped lang="scss">

</style>