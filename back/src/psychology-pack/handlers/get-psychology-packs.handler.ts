import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {GetPsychologyPacksQuery} from "../queries/get-psychology-packs.query";
import {InjectRepository} from "@nestjs/typeorm";
import {PsychologyPack} from "../entities/psychology-pack.entity";
import {Repository} from "typeorm";


@QueryHandler(GetPsychologyPacksQuery)
export class GetPsychologyPacksQueryHandler implements IQueryHandler<GetPsychologyPacksQuery> {
    constructor(@InjectRepository(PsychologyPack) private readonly psychology: Repository<PsychologyPack>) {}
    
    async execute(query: GetPsychologyPacksQuery) {
        return this.psychology.find({
            relations: {
                user: true,
            }
        })
    }
}