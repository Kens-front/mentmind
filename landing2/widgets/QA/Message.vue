<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {IMessage} from "~~/types";
interface IProps {
  message: IMessage;
}
const {message} = defineProps<IProps>()
const emits = defineEmits(['update:message'])
const isWriting = ref(false)

onMounted(() => {
  if (!message.sent) {
    return;
  }
  
  isWriting.value = true
  emits('update:message', isWriting.value)
  new Promise(resolve => {
    setTimeout(() => {
      resolve(1)
    }, 1000)
  })
      .then(() => {isWriting.value = false})
      .then(() => {
        nextTick()
      }).then(() =>   emits('update:message', isWriting.value))
 
})
</script>

<template>
  
  <div v-if="message.sent">
    <q-chat-message
        v-if="isWriting"
        :text="[message.message]"
        sent
        stamp="Сейчас"
    >
      <template v-slot:name>МентМайнд</template>
      <q-spinner-dots  size="2rem"/>
    </q-chat-message>

    <q-chat-message
        v-else
        :text="[message.message]"
        stamp="Сейчас"
        sent
    >
      <template v-slot:name>МентМайнд</template>
    </q-chat-message>
  </div>
 

  <q-chat-message
      v-else
      :text="[message.message]"
      stamp="Сейчас"
      bg-color="primary"
      text-color="white"
  >
  </q-chat-message>
</template>

<style scoped lang="scss">

</style>