<template>
    <div class="card">
        <el-col>
        <div class="statistic-card">
            <el-statistic :value="value">
                <template #title>
                    <div style="display: inline-flex; align-items: center">
                        {{ title }}
                        <el-tooltip
                            effect="dark"
                            content="Number of users who logged into the product in one day"
                            placement="top"
                        >
                            <el-icon style="margin-left: 4px" :size="12">
                            <Warning />
                        </el-icon>
                        </el-tooltip>
                    </div>
                </template>
            </el-statistic>
                <div v-if="percent" class="statistic-footer">
                    <div class="footer-item">
                        <span>than yesterday</span>
                            <span class="green">
                            {{percent}}%
                            <el-icon>
                                <CaretTop />
                            </el-icon>
                        </span>
                    </div>
                </div>
            </div>
        </el-col>
    </div>
</template>

<script setup lang="ts">
import {
 
  CaretTop,
  Warning,
} from '@element-plus/icons-vue'

interface IProps {
    title: string
    value: number
    percent?: number
}

const {title, value = 1000, percent = 0} = defineProps<IProps>()
</script>

<style lang="scss">
    :global(h2#card-usage ~ .example .example-showcase) {
    background-color: var(--el-fill-color) !important;
}

.card {
    display: grid;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: #6d4cff77;
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}
.red {
  color: var(--el-color-error);
}
</style>