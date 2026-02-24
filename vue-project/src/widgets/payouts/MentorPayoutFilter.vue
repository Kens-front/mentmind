<template>
    <section class="filter">
        <div class="wrap">
            <el-select 
                v-if="setVisibleElement([RoleList.ADMIN])"
                v-model="filter.mentorId"
            >
                <el-option 
                    v-for="mentor in [{fullname: 'Все', id: null}, ...mentors]"
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

            <open-modal v-if="filter.mentorId" :modal-component="UpdateMentorPayouts" :modal-props="modalData">
                <el-button>Провести оплату</el-button>
            </open-modal>
        </div>

        <slot/>

        <div class="pagination">
            <el-pagination
                v-model:current-page="filter.skip"
                v-model:page-size="filter.take"
                :page-sizes="[10, 30, 50]"
        
                :background="true"
                layout="sizes, prev, pager, next"
                :total="mentorPayoutStore.mentorPayouts[1]"
        
            />
        </div>
    </section>
</template>

<script lang="ts" setup>
import { useSetVisibleElement } from '@/features/common/composables/set-visible-element';
import { useFilter } from '@/features/common/composables/use-filter';
import OpenModal from '@/features/common/OpenModal.vue';
import UpdateMentorPayouts from '@/features/mentor-payouts/components/UpdateMentorPayouts.vue';
import { useMentorPayoutStore } from '@/features/mentor-payouts/store';
import { userApi } from '@/features/users/api';
import { RoleList, type TUserFull } from '@/features/users/types';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const mentorPayoutFilter = {
    mentorId: null,
    start_date: new Date(new Date().setDate(1)),
    end_date: new Date(),
    skip: 1,
    take: 10, 
}

const mentorPayoutDto = (filter: Record<keyof typeof mentorPayoutFilter, any>) => ({
    ...filter,
    start_date: mentorPayoutFilter.start_date.toISOString().slice(0, 10),
    end_date: mentorPayoutFilter.end_date.toISOString().slice(0, 10),
    skip: (mentorPayoutFilter.skip - 1) * mentorPayoutFilter.take
})

const router = useRouter()
const route = useRoute()

const {setVisibleElement} = useSetVisibleElement()
const {filter, dto} = useFilter(
    mentorPayoutFilter,
     mentorPayoutDto,
    (dto) => mentorPayoutStore.onChange(dto),

    async () => {
        const {data} = await userApi.getAll({role: RoleList.MENTOR})
        mentors.value = data
    }
)
const mentorPayoutStore = useMentorPayoutStore()

const mentors = ref<TUserFull[]>([])
 
 

 

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