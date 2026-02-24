import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { CreateHomeWorkCommand } from "../commands/create-homework.command";
import { InjectRepository } from "@nestjs/typeorm";
import { Homework } from "../entities/homework.entity";
import { Repository } from "typeorm";
import { StudentProfile } from "src/student_profile/entities/student_profile.entity";
import { UpdateHomeWorkCommand } from "../commands/update-homework.command";
import { HttpException } from "@nestjs/common";





@CommandHandler(UpdateHomeWorkCommand)
export class UpdateHomeworkHandler implements ICommandHandler<UpdateHomeWorkCommand> {
    constructor(
        @InjectRepository(Homework) private readonly homework: Repository<Homework>,
        @InjectRepository(StudentProfile) private readonly student: Repository<StudentProfile>,
    ) {}

    async execute(command: UpdateHomeWorkCommand): Promise<Homework> {
        const {id} = command
        
        const homeWork = await this.homework.findOne({where: {id}})

        if (!homeWork) {
            throw new HttpException('Занятие не найдено', 404)
        }

        Object.assign(homeWork, command.updateHomeWork)


        await this.homework.update({id}, homeWork)

        return homeWork
    }
}