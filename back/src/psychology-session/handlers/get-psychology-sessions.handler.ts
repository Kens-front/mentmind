import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {GetPsychologySessionsQuery} from "../queries/get-psychology-sessions.query";
import {InjectRepository} from "@nestjs/typeorm";
import {PsychologySession} from "../entities/psychology-session.entity";
import {Repository} from "typeorm";
import {RoleList} from "../../user/types";


@QueryHandler(GetPsychologySessionsQuery)
export class GetPsychologySessionsQueryHandler implements IQueryHandler<GetPsychologySessionsQuery> {
    constructor(@InjectRepository(PsychologySession) private readonly psychology: Repository<PsychologySession>) {
    }
    
    async execute(query: GetPsychologySessionsQuery) {
        const {user} = query
        
        if (user.role === RoleList.ADMIN) {
            return this.psychology.find({relations: {user: true}});
        }
        
        return await this.psychology.find({
            where: {
                user: {
                    id: user.id,
                }
            }
        });
        
    }
}