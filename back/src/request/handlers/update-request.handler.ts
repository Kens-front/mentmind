import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UpdateRequestCommand} from "../commands/update-request.command";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Request} from "../entities/request.entity";
import {NotFoundException} from "@nestjs/common";

@CommandHandler(UpdateRequestCommand)
export class UpdateRequestHandler implements ICommandHandler<UpdateRequestCommand>{
    constructor(@InjectRepository(Request) private requestRepository: Repository<Request>) {
    }
    
    async execute(command: UpdateRequestCommand): Promise<Request> {
        const request = await this.requestRepository.findOne({
            where: {
                id: command.dto.id
            }
        })
        
        if (!request) {
            throw new NotFoundException(command.dto.id)
        }
        
        request.status = command.dto.status;
        
        return this.requestRepository.save(request);
    }
}