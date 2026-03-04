import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UpdatePsychologySessionDto} from "../dto/update-psychology-session.dto";
import {UpdatePsychologySessionCommand} from "../command/update-psychology-session.command";
import {InjectRepository} from "@nestjs/typeorm";
import {PsychologySession} from "../entities/psychology-session.entity";
import {Repository} from "typeorm";
import {HttpException} from "@nestjs/common";


@CommandHandler(UpdatePsychologySessionCommand)
export class UpdatePsychologySessionHandler implements ICommandHandler<UpdatePsychologySessionCommand> {
    constructor(@InjectRepository(PsychologySession) private psychology: Repository<PsychologySession>) {
    }
    
    async execute(command: UpdatePsychologySessionCommand): Promise<PsychologySession> {
        const session = await this.psychology.findOne({
            where: {id: command.dto.id}
        })
        
        if (!session) {
            throw new HttpException("No such psychology with id " + command.dto.id, 404);
        }
        
        Object.assign(session, command.dto);
        
        return this.psychology.save(session) 
    }
}