import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetLessonCreditQuery } from "../queries/get-lesson-slot.query";
import { InjectRepository } from "@nestjs/typeorm";
import { LessonSlots } from "../entities/lesson-slot.entity";
import { In, Repository } from "typeorm";
import { LessonParticipant } from "src/lesson-participant/entities/lesson-participant.entity";
import { HttpException } from "@nestjs/common";
import { LessonSlotStatus } from "../types";



@QueryHandler(GetLessonCreditQuery)
export class GetLessonCreditHandler implements IQueryHandler<GetLessonCreditQuery> {
    constructor(
        @InjectRepository(LessonSlots) private readonly lessonCredit: Repository<LessonSlots>,
        @InjectRepository(LessonParticipant) private readonly lessonParticipant: Repository<LessonParticipant>,
    ) {}

    async execute(query: GetLessonCreditQuery): Promise<any> {
         const slot = await this.lessonCredit.findOne({where: { status: LessonSlotStatus.AVAILABLE}, relations: ['lesson'], order: {id: 'ASC'}})  
         
         if (!slot) {
            throw new HttpException('Нет доступного слота', 404);
         }
         return slot
    }
}