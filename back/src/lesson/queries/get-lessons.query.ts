import { LESSON_STATUS } from "../entities/lesson.entity"

export interface ILessonQuery {
    userId: number
    status?: LESSON_STATUS
    start_date?: string
    end_date?: string
}
export class GetLessonsQuery {
    constructor(public params?: ILessonQuery) {}
}