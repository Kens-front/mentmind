import {CommandHandler, EventBus, ICommandHandler} from "@nestjs/cqrs";
import { CreateRequestCommand } from "../commands/create-request.command";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "../entities/request.entity";
import { Repository } from "typeorm";
import {CreatedRequestEvent} from "../events/created-request.event";




@CommandHandler(CreateRequestCommand)
export class CreateRequestHandler implements ICommandHandler<CreateRequestCommand> {
    constructor(
        @InjectRepository(Request) private readonly repo: Repository<Request>,
        private eventBus: EventBus,
    ) {}

    async execute(command: CreateRequestCommand): Promise<any> {
        const request = this.repo.create(command.request)
        this.eventBus.publish(new CreatedRequestEvent(command.request));
        return this.repo.save(request);
    }
}