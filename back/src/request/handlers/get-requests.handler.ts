import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetRequestQuery } from "../queries/get-requests.query";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "../entities/request.entity";
import { Repository } from "typeorm";



@QueryHandler(GetRequestQuery) 
export class GetRequestHandler implements IQueryHandler<GetRequestQuery> {
    constructor(@InjectRepository(Request) private readonly repo: Repository<Request>) {}

    async execute(query: GetRequestQuery): Promise<any> {
        return this.repo.find();
    }
}