<script setup lang="ts">
import {RoleList} from "@/features/users/types";

interface IProps {
  data: any []
}

const {data} = defineProps<IProps>()

const emits = defineEmits(['click:close'])
</script>

<template>
  <el-table
      :data="data"
      style="width: 100%"
      data-testid="learn-direction-table"
  >
    <el-table-column prop="id" label="ID" width="80" />
    <el-table-column prop="name" label="Имя"/>
    <el-table-column prop="method" label="Способ связи"/>ткт
    <el-table-column prop="callbackMethod" label="Контакт"/>
    <el-table-column prop="text" label="Комментарий"/>
    <el-table-column prop="status" label="Статус" sortable/>
    <el-table-column
        fixed="right"
        width="180"
        label="Действия"
    >
      <template #default="props">
        <div v-if="props.row.status === 'open'" class="actions">
          <el-popconfirm
              title="Подтвердить оплату?"
              placement="top"
              @confirm="emits('click:close', props.row.id)"
          >
            <template #reference>
              <el-button>Закрыть</el-button>
            </template>
          </el-popconfirm>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped lang="scss">

</style>