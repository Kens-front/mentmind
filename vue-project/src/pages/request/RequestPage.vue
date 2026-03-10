<script setup lang="ts">
 
import EntitiesFilter from "@/features/common/EntitiesFilter.vue";
import {useFilter} from "@/features/common/composables/use-filter.ts";
import {computed, ref} from "vue";
import {format} from "date-fns";
import {requestApi} from "@/features/request/api";
import RequestTable from "@/widgets/Requests/RequestsTable.vue"
import {notifySuccess} from "@/shared/config/notifications.ts";

const requests = ref<any []>([])
const mentorPayoutFilter = computed(() => ({
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

const {filter, dto} = useFilter(
    mentorPayoutFilter.value,
    mentorPayoutDto,
    (dto) => onChange(dto),

    async () => {

    }
)

async function onChange(dto: any) {
  try {
    const {data} = await requestApi.get(dto)
    requests.value = data
  } catch (e) {
    console.error(e)
  }
}

async function handleCloseRequest(id: number) {
  try {
    const {data} = await requestApi.update({id, status: 'closed'})
    
    requests.value[0] = requests.value[0].map((item: {id: number, status: 'open' | 'closed'}) => {
      if (item.id === id) {
        return {...item, status: 'closed'};
      }
      
      return item;
    })
    
    notifySuccess("Заявка успешно закрыта")
  } catch (e) {
    console.error(e)
  }
}
function test(id: number) {
  console.log(id)
}
</script>

<template>
  <EntitiesFilter
      :filter="filter"
      :users="[]"
      :total="requests[1]"
  >
    <el-scrollbar height>
      <RequestTable :data="requests[0]" @click:close="handleCloseRequest" />
    </el-scrollbar>
  </EntitiesFilter>
</template>

<style scoped lang="scss">

</style>