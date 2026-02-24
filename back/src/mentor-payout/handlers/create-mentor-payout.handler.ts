import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreateMentorPayoutCommand } from "../commands/create-mentor-payout.command";
import { MentorPayout } from "../entities/mentor-payout.entity";
import { GetMentorProfileQuery } from "src/mentor_profile/queries/get-mentor-profile.query";
import { MentorProfile } from "src/mentor_profile/entities/mentor_profile.entity";
import { HttpException } from "@nestjs/common";
import { GetLessonQuery } from "src/lesson/queries/get-lesson.query";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Lesson, LESSON_TYPES } from "src/lesson/entities/lesson.entity";
import { MENTOR_TYPES } from "src/mentor_profile/types";



@CommandHandler(CreateMentorPayoutCommand)
export class CreateMentorPayoutHandler implements ICommandHandler<CreateMentorPayoutCommand> {
    constructor(
        @InjectRepository(MentorPayout) private readonly payout: Repository<MentorPayout>,
        private queryBus: QueryBus
    ) {}


    async execute(command: CreateMentorPayoutCommand): Promise<MentorPayout> {
        const {userId, lessonId, amount, finalAmount, fineAmount} = command.createMentorPayoutDto
        const mentor = await this.queryBus.execute<GetMentorProfileQuery, MentorProfile>(new GetMentorProfileQuery(userId))

        if (!mentor) {
            throw new HttpException('mentor has not found', 404)
        }

        const lesson = await this.queryBus.execute<GetLessonQuery, Lesson>(new GetLessonQuery(lessonId))

        if (!lesson) {
            throw new HttpException('lesson has not found', 404)
        }

        const isPaidLesson = await this.payout.findOne({where: {lessonId}})

        if (isPaidLesson) {
            throw new HttpException('Занятие уже оплачено', 409)
        }
        const payout = this.payout.create({mentorId: mentor.id, lessonId, amount, fineAmount, finalAmount})
        return this.payout.save(payout)
    }
}