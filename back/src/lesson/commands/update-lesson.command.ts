import { UpdateLessonDto } from "../dto/update-lesson.dto";





export class UpdateLessonCommand {
    constructor(public lessonid: number, public updateLessonDto: UpdateLessonDto) {}
}