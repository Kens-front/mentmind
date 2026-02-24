<template>
    <div class="page">
        <h1>Выплаты менторам</h1>
        
        <EntitiesFilter
            :filter="filter"
            :users="mentors"
            :total="mentorPayoutStore.mentorPayouts[1]"
        >

        <template #modal>
            <open-modal v-if="filter.mentorId" :modal-component="UpdateMentorPayouts" :modal-props="modalData">
                <el-button>Провести оплату</el-button>
            </open-modal>
        </template>
            <el-scrollbar height>
                <MentorPayoutsTable/>
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
import MentorPayoutsTable from '@/widgets/MentorPayoutsTable.vue';
import MentorPayoutFilter from '@/widgets/payouts/MentorPayoutFilter.vue';
import OpenModal from '@/features/common/OpenModal.vue';
import UpdateMentorPayouts from '@/features/mentor-payouts/components/UpdateMentorPayouts.vue';
import { computed, ref } from 'vue';
import {useAuthStore} from "@/features/auth/store";
import {format} from "date-fns";

const authStore = useAuthStore();
const user = authStore.userData?.user;


const mentorPayoutFilter = computed(() => ({
  mentorId: user?.role === RoleList.MENTOR ? user?.id : null,
  start_date: new Date(new Date().setDate(1)),
  end_date: new Date(),
  skip: 1,
  take: 5,
}))

const mentorPayoutDto = (filter: Record<keyof typeof mentorPayoutFilter, any>) => ({
    ...filter,
    start_date: format(mentorPayoutFilter.value.start_date, 'yyyy-MM-dd'),
    end_date:  format(mentorPayoutFilter.value.end_date, 'yyyy-MM-dd'),
    skip: (mentorPayoutFilter.value.skip - 1) * mentorPayoutFilter.value.take
})

const mentorPayoutStore = useMentorPayoutStore()

const mentors = ref<TUserFull []>([])
const {filter, dto} = useFilter(
    mentorPayoutFilter.value,
     mentorPayoutDto,
    (dto) => mentorPayoutStore.onChange(dto),

    async () => {
        const {data} = await userApi.getAll({role: RoleList.MENTOR})
        mentors.value = data
    }
)

const modalData = computed(() => {
    const mentor = mentors.value.find(mentor => mentor.id === dto.value.mentorId)

    if (!mentor) {
        return false;
    }

    return {
        start_date: dto.value.start_date,
        end_date: dto.value.end_date,
        mentorId: dto.value.mentorId,
        mentorName: mentor.fullname,
        totalSum: mentorPayoutStore.mentorPayouts[0].reduce((acc, payout) => payout.status === 'pending' ? acc + payout.finalAmount : acc, 0),
        totalCount: mentorPayoutStore.mentorPayouts[0]?.filter(payout => payout.status === 'pending')?.length
    }
})
</script>

<style lang="scss" scoped>
 
</style>