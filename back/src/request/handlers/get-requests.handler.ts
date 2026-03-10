import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetRequestQuery } from "../queries/get-requests.query";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "../entities/request.entity";
import {And, LessThanOrEqual, MoreThanOrEqual, Repository} from "typeorm";



@QueryHandler(GetRequestQuery) 
export class GetRequestHandler implements IQueryHandler<GetRequestQuery> {
    constructor(@InjectRepository(Request) private readonly repo: Repository<Request>) {}

    async execute(query: GetRequestQuery): Promise<any> {
        const {params} = query;
        return this.repo.findAndCount({
            where: {
                createAt: And(MoreThanOrEqual(params.start_date), LessThanOrEqual(params.end_date)),
            },
            take: params.take ?? 10,
            skip: params.skip ?? 0
        })
    }
}