import {CommandBus, CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HttpException } from "@nestjs/common";
import { StudentGroup } from "../entities/student-group.entity";
import { CreateStudentGroupCommand } from "../commands/create-student-group.command";
import { User } from "src/user/entities/user.entity";
import {CreateChatEvent} from "../../chat/events/create-chat.event";

@CommandHandler(CreateStudentGroupCommand)
export class CreateStudentGroupHandler implements ICommandHandler<CreateStudentGroupCommand> {
  constructor(
    @InjectRepository(StudentGroup)
    private readonly studentGroupRepo: Repository<StudentGroup>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private commandBus: CommandBus ,
  ) { }

  async execute(command: CreateStudentGroupCommand): Promise<StudentGroup> {
    const { dto } = command;
    const { name, description, mentorId, studentIds, maxStudents } = dto;

    // Проверяем наличие ментора
    const mentor = await this.userRepo.findOne({ where: { id: mentorId } });
    if (!mentor) {
      throw new HttpException('Mentor not found', 404);
    }

    // Проверяем наличие студентов
    const students = await this.userRepo.findByIds(studentIds);
    if (students.length !== studentIds.length) {
      throw new HttpException('Some students not found', 404);
    }

    // Проверяем лимит студентов
    if (maxStudents && students.length > maxStudents) {
      throw new HttpException(
        `Group exceeds maximum students limit (${maxStudents})`,
        400
      );
    }

    // Создаем группу
    const group = this.studentGroupRepo.create({
      name,
      description,
      mentor,
      mentorId,
      students,
      maxStudents: maxStudents || 10,
      active: true,
    });

    
    await Promise.all([
        this.commandBus.execute(new CreateChatEvent([students[0].id, mentor.id])),
        this.commandBus.execute(new CreateChatEvent([students[1].id, mentor.id])),
    ])
 
    return this.studentGroupRepo.save(group);
  }
}
