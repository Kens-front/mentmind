import { LESSON_TYPES } from "@/features/lessons/types"


export const USER_STATUSES = [
    { label: 'Активный', value: 'active' },
    { label: 'На паузе', value: 'stopped' }
]

export const MENTOR_LEVELS = [
    { label: 'Классический', value: 'base' },
    { label: 'Премиальный', value: 'premium' }
]

export const USER_LEVELS = [
    { label: 'Классический', value: 'base' },
    { label: 'Премиальный', value: 'premium' },
    { label: 'Бодрый Джуниор', value: 'junior' },
    { label: 'Уверенный Миддл', value: 'middle' },
    { label: 'Крепкий Сеньор', value: 'senior' },
]

export const USER_LESSON_FORMATS = [
    {label: 'Идивидуальный', value: LESSON_TYPES.BASE},
    {label: 'Групповой', value: LESSON_TYPES.GROUP},
]