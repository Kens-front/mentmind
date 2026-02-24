import { CreateLessonDto } from "../dto/create-lesson.dto";


export class CreateTrialLessonCommand {
    constructor(public createLessonDto: CreateLessonDto) {}
}