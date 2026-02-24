import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreateLessonSlotDto } from "../dto/create-lesson-slot.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { LessonSlots } from "../entities/lesson-slot.entity";
import { Repository } from "typeorm";
import { GetUserBy } from "src/user/queries/get-user-by.query";
import { USER_PARAMS } from "src/auth/constants";
import { CreateLessonSlot } from "../commands/create-lesson-slot.command";




@CommandHandler(CreateLessonSlot) 
export class CreateLessonCreditHandler implements ICommandHandler<CreateLessonSlot> {
    constructor(
        @InjectRepository(LessonSlots) private readonly lessonCredit: Repository<LessonSlots>,
        private queryBus: QueryBus
    ) {}

    async execute(command: CreateLessonSlot): Promise<LessonSlots> {
        const credit = this.lessonCredit.create(command.dto)

        return this.lessonCredit.save(credit);
    }
}