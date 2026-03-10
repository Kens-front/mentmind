<script setup lang="ts">
interface IProps {
  list: {question: string, answer: string} []
  activeIndex: number
}

const {list, activeIndex} = defineProps<IProps>()

const emits = defineEmits(['click:add-message'])

 
</script>

<template>
  <div class="panel">
    <q-scroll-area>
      <q-list bordered separator>
        <q-item
            v-for="(item, index) of list"
            :key="item.question"
            :active="activeIndex === index"
            clickable
            v-ripple
            @click="emits('click:add-message', index, item)"
        >
          <q-item-section>
            {{item.question}}
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </div>
</template>

<style scoped lang="scss">
.panel {
  display: grid;
  height: 100%;
  padding: 2rem;
  background: #fff;
  border-radius: 2rem;
}
</style>