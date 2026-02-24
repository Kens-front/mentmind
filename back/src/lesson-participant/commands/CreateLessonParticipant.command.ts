import { CreateLessonParticipantDto } from "../dto/create-lesson-participant.dto";


export class CreateLessonParticipantCommand {
    constructor(public dto: CreateLessonParticipantDto) {}
}