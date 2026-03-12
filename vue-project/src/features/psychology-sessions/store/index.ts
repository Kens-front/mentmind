import {defineStore} from "pinia";
import {computed, ref} from "vue";
import type {
    ICreatePsychologySessionDto,
    IPsychologySession,
    IUpdatePsychologySessionDto
} from "@/features/psychology-sessions/types";
import {psychologySessionApi} from "@/features/psychology-sessions/api";
import {addHours} from "date-fns";


export const usePsychologySessionStore = defineStore('psychology-sessions', () =>{
    const sessions = ref<IPsychologySession []>([])
    
    const events = computed(() => sessions.value.map(session => ({
        ...session,
        start: new Date(`${session.date}T${session.time}`),
        end: addHours( new Date(`${session.date}T${session.time}`), 1),
        content: `<p>${session.user?.fullname || 'Константин'}</p>`,
        class: `${session.status === 'close' ? 'close' : 'open'}`,
    })))
    async function createPsychologySessions(dto: ICreatePsychologySessionDto): Promise<void> {
        const {data} = await psychologySessionApi.create(dto)
        
        sessions.value.push(data)
    }

    async function getPsychologySessions(): Promise<void> {
        const {data} = await psychologySessionApi.get()

        sessions.value = data
    }
    
    async function updatePsychologySession(id: number, dto: IUpdatePsychologySessionDto) {
        const {data} = await psychologySessionApi.update(id, dto);
        
        sessions.value = sessions.value.map(session => {
            if (session.id === id) {
                return {...session, ...dto}
            }
            
            return session
        })
    }
    
    return {
        sessions,
        events,
        createPsychologySessions,
        getPsychologySessions,
        updatePsychologySession
    }
})