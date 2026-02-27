<template>
    <div class="calendar-wrap">
        <vue-cal 
            :dark="userStore.theme"
            :event-overlap="false"
            :events="events"             
            default-view="week"
            :editable-events="editable"
            @event-created="emits('onCreated', $event)"
            @event-delete="emits('onDelete', $event)"
            @event-drag-end="emits('onDrag', $event)"
            @event-click="emits('onClick', $event)"
            @view-change="emits('onViewChange', $event)"
            @ready="emits('onReady', $event)"
            @event-resize-end="emits('onEventHold', $event)"
        >
            <template #title>
              <div class="title">
                <span>
                  {{title}}
                </span>

                <el-tooltip
                    v-if="true"
                    content="Продублировать на следующую неделю"
                    placement="right"
                >
                  <el-button><el-icon><CopyDocument /></el-icon></el-button>
                </el-tooltip>
              </div>
            </template>
        </vue-cal>
    </div>
</template>

<script lang="ts" setup>
import type { ILessonSlotEvent } from '@/features/mentor-availability/types';
//@ts-ignore
import {VueCal} from 'vue-cal';
import 'vue-cal/style'
import {CopyDocument} from "@element-plus/icons-vue";
import {useAuthStore} from "@/features/auth/store";
import {useUserStore} from "@/features/users/store/store.ts";
const userStore = useUserStore();


interface IProps {
    events: ILessonSlotEvent []
    editable?: boolean
    title: string
}
const {editable = true, events} = defineProps<IProps>();

const emits = defineEmits(['onClick', 'onDelete', 'onCreated', 'onDrag', 'onReady', 'onViewChange', 'onEventHold'])
 
</script>
<style lang="scss">
.calendar-wrap {
    height: 100%;
}
.vuecal--default-theme {
    --vuecal-height: 100%
}

.vuecal__event.completed {
    background-color: green;
}

.vuecal__event.cancelled {
    background-color: red;
}

.vuecal__event {
    background-color: #6c4cff;
    cursor: pointer;
}

.vuecal__event.slot-completed {
    opacity: .2;
}

.title {
  display: grid;
  grid-template-columns: max-content max-content;
  align-items: center;
  column-gap: 1rem;
}
</style>