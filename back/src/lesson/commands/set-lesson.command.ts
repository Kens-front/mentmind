import { SetLessonDto } from "../dto/set-lesson.dto";

export class SetLessonCommand {
    constructor(public setLEssonDto: SetLessonDto) {}
}