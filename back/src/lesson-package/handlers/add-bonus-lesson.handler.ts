import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AddBonusLessonCommand } from "../commands/add-bonus.lesson.command";
import { InjectRepository } from "@nestjs/typeorm";
import { LessonPackage } from "../entities/lesson-package.entity";
import { Repository } from "typeorm";
import { HttpException } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";




@CommandHandler(AddBonusLessonCommand) 
export class AddBonusLessonHandler implements ICommandHandler<AddBonusLessonCommand> {
    constructor(
        @InjectRepository(LessonPackage) private readonly lessonPackage: Repository<LessonPackage>,
        @InjectRepository(User) private readonly user: Repository<User>,
    ) {}


    async execute(command: AddBonusLessonCommand): Promise<LessonPackage> {
        let lessonPackage = await this.lessonPackage.findOne({where: {userId: command.userId, status: 'active'}})

        if (!lessonPackage) {
            const user = await this.user.findOne({where: {id: command.userId}})
            lessonPackage = this.lessonPackage.create({totalCount: 1})
            lessonPackage.duration = 60
            lessonPackage.status = 'active'
            lessonPackage.user = user
        } else {
            lessonPackage.totalCount += 1
        }

        return this.lessonPackage.save(lessonPackage)
    }
}