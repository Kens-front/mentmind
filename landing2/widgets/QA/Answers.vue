<script setup lang="ts">
import Message from "~~/widgets/QA/Message.vue";
import type {IMessage} from "~~/types";

interface IProps {
  list: IMessage [];
}

const {list} = defineProps<IProps>()
</script>

<template>
  <div class="answers">
    <q-scroll-area>
      <div class="content">
        <slot/>
      </div>
    </q-scroll-area>
  </div>
</template>

<style scoped lang="scss">
.answers {
  overflow: auto;
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
}

.content {
  padding: 2rem;    
  max-width: 90%;
  width: 100%;
  justify-self: self-end;
  
  @media screen and (max-width: 1024px) {
    max-width: 100%;
  }
}
 
</style>