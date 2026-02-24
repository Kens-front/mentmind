import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateAchieveCommand } from "../commands/create-achieve.command";
import { InjectRepository } from "@nestjs/typeorm";
import { Achieve } from "../entities/achieve.entity";
import { Repository } from "typeorm";



@CommandHandler(CreateAchieveCommand)
export class CreateAchieveHandler implements ICommandHandler<CreateAchieveCommand> {
    constructor(@InjectRepository(Achieve) private readonly achieve: Repository<Achieve>) {}

    async execute(command: CreateAchieveCommand): Promise<Achieve> {
        const achieve = this.achieve.create(command.createAchieveDto)

        return this.achieve.save(achieve);
    }
}