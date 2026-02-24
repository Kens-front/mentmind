import { CommandHandler, ICommandHandler, CommandBus } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { UpdateUserFullCommand } from "../commands/update-user-full.command";

import { RoleList } from "../types";
import { UpdateUserCommand } from "../commands/update-user.command";
import { UpdateMentorCommand } from "src/mentor_profile/commands/update-mentor.command";
import { UpdateStudentProfileCommand } from "src/student_profile/commands/update-student-profile.command";
import { UpdateMentorProfileDto } from "src/mentor_profile/dto/update-mentor_profile.dto";
import { UpdateStudentProfileDto } from "src/student_profile/dto/update-student_profile.dto";

@CommandHandler(UpdateUserFullCommand)
export class UpdateUserFullHandler implements ICommandHandler<UpdateUserFullCommand> {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,

    private readonly commandBus: CommandBus,
    private readonly entityManager: EntityManager
  ) {}

  async execute(command: UpdateUserFullCommand) {
    const { userId, payload } = command;

    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    await this.entityManager.transaction(async () => {

      // 1️⃣ Обновляем USER, если есть изменения
      if (payload.user && Object.keys(payload.user).length > 0) {
        await this.commandBus.execute(
          new UpdateUserCommand(userId, payload.user)
        );
      }

      // 2️⃣ Обновляем ПРОФИЛЬ (в зависимости от роли)
      if (payload.profile && Object.keys(payload.profile).length > 0) {
        if (user.role === RoleList.MENTOR) {
          await this.commandBus.execute(
            new UpdateMentorCommand(userId, payload.profile as UpdateMentorProfileDto)
          );
        }

        if (user.role === RoleList.STUDENT) {
          await this.commandBus.execute(
            new UpdateStudentProfileCommand(userId, payload.profile as UpdateStudentProfileDto)
          );
        }
      }
    });

    return { isOk: true };
  }
}
