import { UpdateLessonSlotDto } from "../dto/update-lesson-slot.dto";



export class UpdateLessonSlotCommand {
    constructor(public lessonId: number, public dto: UpdateLessonSlotDto) {}
 
}