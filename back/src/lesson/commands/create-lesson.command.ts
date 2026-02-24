import { CreateLessonDto } from "../dto/create-lesson.dto";


export class CreateLessonCommand {
    constructor(public createLessonDto: CreateLessonDto) {}
}