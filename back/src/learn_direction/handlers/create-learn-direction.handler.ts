import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateLearnDirection } from "../commands/create-learn-direction.command";
import { InjectRepository } from "@nestjs/typeorm";
import { LearnDirection } from "../entities/learn_direction.entity";
import { Repository } from "typeorm";




@CommandHandler(CreateLearnDirection) 
export class CreateLearnDirectionHandler implements ICommandHandler<CreateLearnDirection> {
    constructor(@InjectRepository(LearnDirection) private learnDirection: Repository<LearnDirection> ) {}

    async execute(command: CreateLearnDirection): Promise<LearnDirection> {
        const learnDirection = this.learnDirection.create(command.learnDirection)
        return this.learnDirection.save(learnDirection);
    }
}