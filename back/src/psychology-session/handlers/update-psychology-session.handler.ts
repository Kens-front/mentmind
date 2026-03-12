import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UpdatePsychologySessionDto} from "../dto/update-psychology-session.dto";
import {UpdatePsychologySessionCommand} from "../command/update-psychology-session.command";
import {InjectRepository} from "@nestjs/typeorm";
import {PsychologySession} from "../entities/psychology-session.entity";
import {EntityManager, Repository} from "typeorm";
import {HttpException} from "@nestjs/common";
import {PsychologyPack} from "../../psychology-pack/entities/psychology-pack.entity";


@CommandHandler(UpdatePsychologySessionCommand)
export class UpdatePsychologySessionHandler implements ICommandHandler<UpdatePsychologySessionCommand> {
    constructor(
        @InjectRepository(PsychologySession) private psychology: Repository<PsychologySession>,
        @InjectRepository(PsychologyPack) private psychologyPack: Repository<PsychologyPack>,
        private entityManager: EntityManager,
    ) {
    }
    
    async execute(command: UpdatePsychologySessionCommand): Promise<PsychologySession> {
        return this.entityManager.transaction(async (manager) => {
            const session = await manager.findOne(PsychologySession, {
                where: {id: command.dto.id}
            })

 
            const pack = await manager.findOne(PsychologyPack,{
                where: {status: 'active'}
            })
            
            if (!pack) {
                throw new HttpException('Нет доступного пакета', 404)
            }

            if (!session) {
                throw new HttpException("No such psychology with id " + command.dto.id, 404);
            }

            Object.assign(session, command.dto);

            pack.used_count++;

            if (pack.used_count > pack.available_count) {
                console.log('pack', pack)
                pack.status = 'inactive';
                await manager.save(PsychologyPack, pack);
                throw new HttpException("Нет доступного пакета" + command.dto.id, 404);
            }
 

            await manager.save(PsychologyPack, pack);
            return manager.save(PsychologySession, session);
        })
 
    }
}