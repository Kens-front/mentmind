import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetHomeworkQuery } from "../queries/get-homework.query";
import { InjectRepository } from "@nestjs/typeorm";
import { Homework } from "../entities/homework.entity";
import { Repository } from "typeorm";




@QueryHandler(GetHomeworkQuery)
export class GetHomeworkHandler implements IQueryHandler<GetHomeworkQuery> {
    constructor(@InjectRepository(Homework) private readonly homework: Repository<Homework>) {}

    async execute(query: GetHomeworkQuery): Promise<Homework> {
        return this.homework.findOne({where: {id: query.id}})
    }
}