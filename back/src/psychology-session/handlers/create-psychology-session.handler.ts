import {CommandHandler, ICommandHandler, QueryBus} from "@nestjs/cqrs";
import {CreatePsychologySessionCommand} from "../create-psychology-session.command";
import {InjectRepository} from "@nestjs/typeorm";
import {PsychologySession} from "../entities/psychology-session.entity";
import {Repository} from "typeorm";
import {HttpException} from "@nestjs/common";
import {GetUserBy} from "../../user/queries/get-user-by.query";
import {USER_PARAMS} from "../../auth/constants";
import {PsychologyPack} from "../../psychology-pack/entities/psychology-pack.entity";


@CommandHandler(CreatePsychologySessionCommand)
export class CreatePsychologySessionHandler implements ICommandHandler<CreatePsychologySessionCommand> {
    constructor(
        @InjectRepository(PsychologySession) private readonly psychology: Repository<PsychologySession>,
        @InjectRepository(PsychologyPack) private readonly psychologyPack: Repository<PsychologyPack>,
        private queryBus: QueryBus
    ) {}
    
    async execute(command: CreatePsychologySessionCommand): Promise<PsychologySession> {
        
        const pack = await this.psychologyPack.findOne({
            where: {
                user: {
                    id: command.dto.userId,
                },
                status: 'active'
            }
        })
        
        const user = await this.queryBus.execute(new GetUserBy(USER_PARAMS.ID, `${command.dto.userId}`));
        if (!user) {
            throw new HttpException("Пользователь не найден", 404)
        }
        
        if (!pack) {
            throw new HttpException('Нет досутпных пакетов', 404)
        }
        
        if (pack.used_count >= pack.available_count) {
            pack.status = 'inactive';
            throw new HttpException('Нет досутпных пакетов', 404)
        }
        
        const session = this.psychology.create({date: command.dto.date, time: command.dto.time})
        
        
        session.user = user;
        
        pack.used_count++
        
        await this.psychologyPack.save(pack)
        
        return this.psychology.save(session)
    }
}