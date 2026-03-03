<template>
    <el-table
        :data="data"
        style="width: 100%"
        data-testid="learn-direction-table"
        class="table"
    >
        <el-table-column
            v-for="column of columns"
            :key="column.id"
            :width="column.width"
            :label="column.label"
            :prop="column.prop"
        />
 
        <el-table-column   fixed="right"  label="Действия">
            <template #default="props">
                <div class="actions">
                  <slot name="actions" v-bind="props" />
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
interface IProps {
    data: any []
    columns: any []
}

const {data, columns} = defineProps<IProps>()
</script>

<style lang="scss" scoped>
.actions {
    display: grid;
	grid-template-columns: repeat(auto-fit, minmax(2rem, max-content));
	column-gap: .4rem;
}
.table {
  border-radius: 1rem;
  overflow: hidden;
}
</style>