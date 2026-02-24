<template>
    <section>
        <el-table 
            :data="mentorPayoutStore.mentorPayouts[0]" 
            style="width: 100%"
            data-testid="learn-direction-table"
        >
            <el-table-column prop="index" label="#" width="80" />
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="mentor.user.fullname" label="Имя ментора"/>
            <el-table-column prop="finalAmount" label="Итоговая выплата"/>
            <el-table-column prop="fineAmount" label="Штраф"/>
            <el-table-column prop="status" label="Статус оплаты"/>
            <el-table-column prop="paidAt" label="Дата оплаты"/>

            <el-table-column
                v-if="setVisibleElement([RoleList.ADMIN])" 
                fixed="right" 
                width="180" 
                label="Действия"
            >
                <template #default="props">
                    <div v-if="props.row.status === 'pending'" class="actions">
                        <el-popconfirm
                            title="Подтвердить оплату?"
                            placement="top"
                            @confirm="confirmPayout(props.row.id)"
                        >
                            <template #reference>
                                <el-button>Оплатить</el-button>            
                            </template>
                        </el-popconfirm>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </section>
</template>

<script setup lang="ts">
import { useSetVisibleElement } from '@/features/common/composables/set-visible-element';
import { mentorPayoutApi } from '@/features/mentor-payouts/api';
import { useMentorPayoutStore } from '@/features/mentor-payouts/store';
import type { IMentorPayout } from '@/features/mentor-payouts/types';
import { RoleList } from '@/features/users/types';
import { notifySuccess } from '@/shared/config/notifications';
import { onMounted, ref } from 'vue';

const {setVisibleElement} = useSetVisibleElement()
const mentorPayoutStore = useMentorPayoutStore()
 

async function confirmPayout(id: number) {
    try {
        const {data} = await mentorPayoutApi.update(id, {status: 'paid'})
        const payout = mentorPayoutStore.mentorPayouts[0].find(payout => payout.id === data.id)

        if (payout) {
            payout.status = 'paid'
            notifySuccess('Занятие оплачено')
        }
    } catch {

    }
}
 
</script>

<style lang="scss" scoped>
.actions {
  position: relative;
}
</style>