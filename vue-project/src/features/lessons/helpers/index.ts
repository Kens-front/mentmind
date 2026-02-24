import type { LESSON_STATUS, LESSON_TYPES } from "../types";

const LESSON_TYPES_DICTIONARY = {
    group: 'Групповое',
    base: 'Платное',
    premium: 'Премиальное',
    trial: 'Пробное',
    free: 'Бесплатное',
}

const LESSON_CLASS_DICTIONARY_BY_STATUS = {
    available: 'available',
    planned: 'planned',
    completed: 'completed',
    cancelled: 'cancelled',
    
}
export function translateLessonType(lessonType: LESSON_TYPES) {
    return LESSON_TYPES_DICTIONARY[lessonType]
}


export function parseLessonTypeToClass(lessonType: LESSON_STATUS) {
    return LESSON_CLASS_DICTIONARY_BY_STATUS[lessonType]
}