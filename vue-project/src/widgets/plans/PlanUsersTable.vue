<script setup lang="ts">
import {PLANS_TABLE_COLUMNS} from "@/features/plan/constants";
import {userApi} from "@/features/users/api";
import {RoleList, type TUserFull} from "@/features/users/types";
import {computed, onMounted, ref} from "vue";

const users = ref<TUserFull[]>([])

const columns = computed(() => users.value.map(user => ({
  ...user,
  hasPlan: user.plan ? 'Да': 'Нет'
})))
async function getUsers() {
  const {data} = await userApi.getAll({role: RoleList.STUDENT});
  users.value = data
}

onMounted(() => {
  try {
    getUsers()
  } catch(e) {
    console.warn(e)
  }
})
</script>

<template>
  <el-table :data="columns">
    <el-table-column
        v-for="column of PLANS_TABLE_COLUMNS"
        :key="column.props"
        :prop="column.props"
        :label="column.label"
        :width="column.width"
    />

    <el-table-column fixed="right" label="Действия">
      <template #default="props">
        <div class="actions">
          <router-link :to="`/plans/${props.row.id}`">
            <el-button>
              сдшсл
            </el-button>
          </router-link>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped lang="scss">

</style>