<template>
    <section>
        <el-table
                :data="groupStore.groups"
                style="width: 100%"
                data-testid="learn-direction-table"
            >
                <el-table-column prop="id" label="ID" width="80" />
                <el-table-column prop="name" label="Название" width="150" />
                <el-table-column prop="description" label="Описание" width="200"/>
                <el-table-column prop="mentorName" label="Ментор"  />
                <el-table-column prop="firstStudent" label="1-ый студент">
                  <template #default="{$index}">
                    <span>{{groupStore.groups[$index]?.students[0]?.fullname}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="lastStudent" label="2-ой студент"  />
                
                <el-table-column
                    fixed="right" 
                    label="Действия" 
                    align="right"   
                >
                <template #default="{$index}">
                    <div class="actions">
                        <OpenCreateLessonModal
                            v-if="(setVisibleElement([RoleList.MENTOR]) && mentorId)"
                            kind="group" 
                            :student-ids="groupStore.groups[$index]?.students?.map(student => student.id) || []" 
                            :mentor-id="mentorId"
                        >
                            <el-tooltip placement="bottom" content="Создать занятие">
                                <el-button data-cy="open-create-lesson"><el-icon><Ticket/></el-icon></el-button>
                            </el-tooltip>
                        </OpenCreateLessonModal>

                      <span>{{groupStore.groups[$index]?.id}}</span>
                      <DeleteGroup :id="groupStore.groups[$index]?.id || 0"/>
                    </div>
                </template>
            </el-table-column>
 
            </el-table>
    </section>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/features/auth/store';
import { useSetVisibleElement } from '@/features/common/composables/set-visible-element';
import { useGroupStore } from '@/features/groups/store';
import { RoleList } from '@/features/users/types';
import { computed, onMounted } from 'vue';
import OpenCreateLessonModal from '@/features/lessons/components/OpenCreateLessonModal.vue';
import DeleteGroup from "@/features/groups/components/DeleteGroup.vue";
import {Ticket} from "@element-plus/icons-vue";

const {setVisibleElement} = useSetVisibleElement();
const groupStore = useGroupStore()
const authStore = useAuthStore();

const mentorId = computed<number | null>(() => {
    const user = authStore.userData.user;
    return user?.role === RoleList.MENTOR ? user.id : null;
});

function getAll() {
    groupStore.getAll()
}

onMounted(() => {
    try {
        getAll()
    } catch {

    }
})
</script>