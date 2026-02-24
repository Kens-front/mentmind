import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetLessonSlotsQuery } from "../queries/get-lesson-slots.query";
import { InjectRepository } from "@nestjs/typeorm";
import { LessonSlots } from "../entities/lesson-slot.entity";
import { Repository } from "typeorm";





@QueryHandler(GetLessonSlotsQuery)
export class GetLessonCreditsHandler implements IQueryHandler<GetLessonSlotsQuery> {
    constructor(@InjectRepository(LessonSlots) private readonly lessonCredit: Repository<LessonSlots>) {}

    async execute(query: GetLessonSlotsQuery): Promise<any> {
        return this.lessonCredit.find({relations: {lesson: true}}) || []
    }
}