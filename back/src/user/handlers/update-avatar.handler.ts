import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { UpdateAvatarCommand } from "../commands/update-avatar.command";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { HttpException } from "@nestjs/common";






@CommandHandler(UpdateAvatarCommand)
export class UpdateAvatarHandler implements ICommandHandler<UpdateAvatarCommand> {
    constructor(@InjectRepository(User) private readonly user: Repository<User>) { }

    async execute(command: UpdateAvatarCommand): Promise<any> {
        const user = await this.user.findOne({ where: { id: command.userId } })

        if (!user) {
            throw new HttpException('Не найден пользователь', 404)
        }

        user.avatar = command.avatar

        return this.user.save(user)
    }
}