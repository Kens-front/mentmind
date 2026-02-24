import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAchieveQuery } from "../queries/get-achieves.query";
import { InjectRepository } from "@nestjs/typeorm";
import { Achieve } from "../entities/achieve.entity";
import { Repository } from "typeorm";




@QueryHandler(GetAchieveQuery)
export class GetAchievesHandler implements IQueryHandler<GetAchieveQuery> {
    constructor(@InjectRepository(Achieve) private readonly achieve: Repository<Achieve>) {}

    async execute(query: GetAchieveQuery): Promise<any> {
        return this.achieve.find({relations: ['users']})
    }
}