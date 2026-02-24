import { computed, onMounted, reactive, watch } from "vue"
import { useRoute, useRouter } from "vue-router"



export function useFilter<Filter extends Object>(
    aFilter: Filter,
    aDto: (params: any) => any, 
    onChangeCallback: (dto: any) => Promise<void>,
    onMountedCallback: () => void
){
    const router = useRouter()
    const route = useRoute()

    const filter = reactive<Filter>(aFilter)
    const dto = computed(() => {
        const additional = aDto(filter)
        return {
        ...filter,
        ...additional
    }
    })


    async function onChange(filter: any) {
        const filterEntries = Object.entries(dto.value)

        const query = filterEntries.reduce((acc, filter) => {
            if (filter[1]) {
                return [...acc, `${filter[0]}=${filter[1] || 'null'}`]
            }

            return acc
        }, [] as string[])

        try {
            await onChangeCallback(dto.value)
            router.replace(`?${query.join('&')}`)
        } catch {

        }
    }

    watch(filter, (newValue) => {
        onChange(newValue)
    }, {deep: true, immediate: true})

    onMounted(async () => {
        try {
            onMountedCallback()
        } catch {

        }
    })
    return {
        filter, dto
    }
}