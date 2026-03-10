<script setup lang="ts">

import Panel from "~~/widgets/QA/Panel.vue";
import Answers from "~~/widgets/QA/Answers.vue";
import {QA} from "@/constnats/qa";
import Message from "~~/widgets/QA/Message.vue";
import type {IMessage, IQA} from "~~/types";
import Modal from "~~/widgets/Modal.vue";

interface IProps {
  isDesktop: boolean;
 
}

const {isDesktop} = defineProps<IProps>();
const messages = ref<IMessage []>([{message: 'С радостью ответим на Ваши вопросы', sent: true}])
const isWriting = ref<boolean>(false)
const activeIndex = ref(0)
const isVisible = ref(false)
function changeWritable(val: boolean) {
  isWriting.value = val
}
async function addMessage(message:  IQA) {
  messages.value.unshift({message: message.question, sent: false})
  
    await new Promise(resolve => setTimeout(resolve, 1000))

  messages.value.unshift({message: message.answer, sent: true})
}
function onClick(index: number, item: IQA) {
  if(isWriting.value){
    return;
  }
  
  activeIndex.value = index;

  addMessage(item)
  
  isVisible.value = false
}
</script>

<template>
  <div class="qa">
    <div class="panel-desktop">
      <Panel
          :list="QA"
          @click:add-message="onClick"
          :active-index="activeIndex"
      />
    </div>
 
    
    <Answers :list="messages">
      <transition-group name="list" tag="div" >
        <Message
            v-for="(message, index) in messages"
            :key="message.message"
            :message="message"
            @update:message="changeWritable"
        />
      </transition-group>
 
    </Answers>
    
    <transition name="fade" mode="out-in">
      <Modal v-if="isVisible" @click:close-modal="isVisible = false">
        <Panel
            :list="QA"
            @click:add-message="onClick"
            :active-index="activeIndex"
            :is-visible="isVisible"
        />
      </Modal>
    </transition>
    
    <div @click="isVisible = true" class="btn">
      <q-btn color="white" text-color="black">
        Задать вопрос
      </q-btn> 
    </div>
 
  </div>
</template>

<style scoped lang="scss">
.qa {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 2fr;
  padding: 3rem 10rem;
  height: 100dvh;
  background: url("../public/assets/bg.png") no-repeat center center fixed;
  background-size: cover;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
    background-color: rgba(46, 46, 46, 0.39);
  }
  
  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr max-content;
    padding: 2rem;
  }
}


.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}

.panel-desktop {
  position: relative;
  @media screen and (max-width: 1024px) {
    display: none;
  }
}

.btn {
  display: none;
  align-items: end;
  height: max-content;
  
  @media screen and (max-width: 1024px) {
    display: grid;
  }
}
</style>