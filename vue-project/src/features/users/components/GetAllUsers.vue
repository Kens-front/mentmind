<template>
    <div>
        <el-table 
            :data="usersStore.users" 
            style="width: 100%"
            data-cy="users-table"
        >
            <el-table-column 
                v-for="column of columns" 
                :key="column.props"
                :prop="column.props"
                :label="column.label" 
                :width="column.width" 
                sortable
            />

            <el-table-column fixed="right" label="Действия">
                <template #default="props">
                    <div class="actions">
                        <slot name="create-lesson" :student="getStudent(props.$index)"/>

                        <slot name="link" :row="props.row" :link="createLink(props.row)"/>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts" setup>
import {  onMounted } from 'vue';
import { useUserStore } from '../store/store';
import { RoleList, type IUser, type IUserColumn } from '../types';
 
interface IProps {
    role: RoleList
    columns: IUserColumn []
    onlyGroup?: number
}

const {role, columns, onlyGroup} = defineProps<IProps>();
const usersStore = useUserStore();
 
function createLink(row: IUser) {
    return `/${row.role}s/${row.id}`
}

function getStudent(index: number) {
    return usersStore.users[index];
}
onMounted(() => {
    try {
        usersStore.getAll({role, onlyGroup});
    } catch {

    }
})
</script>

<style lang="scss" scoped>
.actions {
    display: flex;
    align-items: center;
}
</style>