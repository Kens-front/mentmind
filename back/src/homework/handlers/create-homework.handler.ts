import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { CreateHomeWorkCommand } from "../commands/create-homework.command";
import { InjectRepository } from "@nestjs/typeorm";
import { Homework } from "../entities/homework.entity";
import { Repository } from "typeorm";
import { StudentProfile } from "src/student_profile/entities/student_profile.entity";
import { HttpException } from "@nestjs/common";





@CommandHandler(CreateHomeWorkCommand)
export class CreateHomeworkHandler implements ICommandHandler<CreateHomeWorkCommand> {
    constructor(
        @InjectRepository(Homework) private readonly homework: Repository<Homework>,
        @InjectRepository(StudentProfile) private readonly student: Repository<StudentProfile>,
    ) {}

    async execute(command: CreateHomeWorkCommand): Promise<Homework> {
        const {studentId, ...data} = command.createHomeWork
        const student = await this.student.findOne({where: {userId: studentId}})

        if (!student) {
            throw new HttpException('Студент не найден', 404)
        }

        const homework = this.homework.create(data)

        homework.student = student
        
        return this.homework.save(homework);
    }
}