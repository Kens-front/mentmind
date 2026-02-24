import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateLearnDirectionCommand } from "../commands/update-learn-direction.command";
import { InjectRepository } from "@nestjs/typeorm";
import { LearnDirection } from "../entities/learn_direction.entity";
import { Repository } from "typeorm";





@CommandHandler(UpdateLearnDirectionCommand)
export class UpdateLearnDirectionHandler implements ICommandHandler<UpdateLearnDirectionCommand> {
    constructor(@InjectRepository(LearnDirection) private readonly learnDirection: Repository<LearnDirection>) {}

    async execute(command: UpdateLearnDirectionCommand): Promise<{isOk: boolean}> {
        const isOk = await this.learnDirection.update({id: command.id }, { ...command.learnDirection });

        return { isOk: Boolean(isOk) }
    }
}