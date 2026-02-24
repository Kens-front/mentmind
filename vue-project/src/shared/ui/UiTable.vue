<template>
    <el-table
        :data="data"
        style="width: 100%"
        data-testid="learn-direction-table"
    >
        <el-table-column
            v-for="column of columns"
            :key="column.id"
            :prop="column.prop"
            :label="column.label"
            :width="column.width"
        />
 
        <el-table-column v-if="$slots.actions" fixed="right" width="180" label="Действия">
            <template #default="props">
                <div class="actions">
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
</style>