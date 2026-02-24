import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateRequestCommand } from "../commands/create-request.command";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "../entities/request.entity";
import { Repository } from "typeorm";




@CommandHandler(CreateRequestCommand)
export class CreateRequestHandler implements ICommandHandler<CreateRequestCommand> {
    constructor(@InjectRepository(Request) private readonly repo: Repository<Request>) {}

    async execute(command: CreateRequestCommand): Promise<any> {
        const request = this.repo.create(command.request)
        return this.repo.save(request);
    }
}