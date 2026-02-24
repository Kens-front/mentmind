import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteLearnDirectionCommand } from "../commands/delete-learn-direction.command";
import { InjectRepository } from "@nestjs/typeorm";
import { LearnDirection } from "../entities/learn_direction.entity";
import { Repository } from "typeorm";








@CommandHandler(DeleteLearnDirectionCommand)
export class DeleteLearnDirectionHandler implements ICommandHandler<DeleteLearnDirectionCommand> {
    constructor(@InjectRepository(LearnDirection) private readonly learnDirection: Repository<LearnDirection>) {}

    async execute(command: DeleteLearnDirectionCommand): Promise<{id: number}> {
        // const direction = await learnDirection .findOne({
        //     where: { id },
        //     relations: ['mentors'],
        //   });
          
        const direction = await this.learnDirection.findOne({
            where: {id: command.id},
            relations: ['mentors'],
        })
          // 2. Очистить связи
        direction.mentors = [];

        direction.students = []
        await this.learnDirection.save(direction);

        await this.learnDirection.delete({id: command.id});

        return {id: command.id};
    }
}