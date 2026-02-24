<template>
    <section class="filter">
        <div class="wrap">
            <el-select 
                v-if="setVisibleElement([RoleList.ADMIN]) && users.length"
                v-model="filter.mentorId"
            >
                <el-option 
                    v-for="mentor in [{fullname: 'Все', id: null}, ...users]"
                    :key="mentor.id"
                    :label="mentor.fullname"
                    :value="mentor.id"
                >

                </el-option>
            </el-select>

            <el-date-picker
                v-model="filter.start_date"
                type="date"
                placeholder="Начало периода"
             />

            <el-date-picker
                v-model="filter.end_date"
                type="date"
                placeholder="Конец периода"
            />

            <slot name="modal"/>
        </div>

      <el-scrollbar height="350">
        <slot/>
      </el-scrollbar>

        <div class="pagination">
            <el-pagination
                v-model:current-page="filter.skip"
                v-model:page-size="filter.take"
                :page-sizes="[5, 10, 15]"
        
                :background="true"
                layout="sizes, prev, pager, next"
                :total="total"
        
            />
        </div>
    </section>
</template>

<script setup lang="ts">
import { useSetVisibleElement } from './composables/set-visible-element';
import { RoleList, type TUserFull } from '../users/types';

interface IProps {
    filter: any 
    users: TUserFull []
    total: number
}

const {filter, users} = defineProps<IProps>()


const {setVisibleElement} = useSetVisibleElement()
</script>

<style lang="scss" scoped>

.filter {
    display: grid;
    row-gap: 2rem;
}

.wrap {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    column-gap: 1rem;
    width: 100%;
 
}
.pagination {
    display: flex;
    justify-content: start;
}
</style>