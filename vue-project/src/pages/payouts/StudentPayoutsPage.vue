<template>
    <div class="page">
        <h1>Оплаты студентов</h1>
        
        <EntitiesFilter
            :filter="filter"
            :users="[]"
            :total="studentPaymentStore.studentPayments[1]"
        >
            <el-scrollbar height>
                <StudentPayments/>
            </el-scrollbar>
        </EntitiesFilter>
        <!-- <MentorPayoutFilter>
            <el-scrollbar height>
                <MentorPayoutsTable/>
            </el-scrollbar>
        </MentorPayoutFilter> -->
    </div>
</template>


<script setup lang="ts">
import { useFilter } from '@/features/common/composables/use-filter';
import EntitiesFilter from '@/features/common/EntitiesFilter.vue';
import { useMentorPayoutStore } from '@/features/mentor-payouts/store';
import { userApi } from '@/features/users/api';
import { RoleList, type TUserFull } from '@/features/users/types';
import StudentPayments from '@/widgets/payments/StudentPayments.vue';

import { computed, ref } from 'vue';
import {useStudentPaymentStore} from "@/features/payments/store";
import {format} from "date-fns";
 const studentPayoutsFilter = {
    start_date: new Date(new Date().setDate(1)),
    end_date:format(new Date(), 'yyyy-MM-dd'),
    skip: 1,
    take: 10, 
}

const studentPayoutDto = (filter: Record<keyof typeof studentPayoutsFilter, any>) => ({
    ...filter,
    start_date: format(studentPayoutsFilter.start_date, 'yyyy-MM-dd') ,
    end_date:format(studentPayoutsFilter.end_date, 'yyyy-MM-dd'),
    skip: (studentPayoutsFilter.skip - 1) * studentPayoutsFilter.take
})

const studentPaymentStore = useStudentPaymentStore()

const students = ref<TUserFull []>([])
const {filter, dto} = useFilter(
    studentPayoutsFilter,
     studentPayoutDto,
    (dto) => studentPaymentStore.onChange(dto),

    async () => {
        const {data} = await userApi.getAll({role: RoleList.STUDENT})
        students.value = data
    }
)
</script>

<style lang="scss" scoped>
 
</style>