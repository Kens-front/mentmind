import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetLearnDirectionQuery } from "../queries/get-learn-directions.query";
import { LearnDirection } from "../entities/learn_direction.entity";
import { InjectRepository } from "@nestjs/typeorm";
import {EntityManager, In, Repository} from "typeorm";

interface IFilter {
    id: number | number []
    title: string
}

function getQueryData(query: any) {
    const where: any = {};

    if (!Object.keys(query).length) {
        return where
    }

    if (Array.isArray(query.id)) {
        const id = query.id?.includes(',')
        where.id = In(id);
    }
 

    if (typeof query.id === 'number') {
        where.id = query.id;
    }

    return where
}

 
@QueryHandler(GetLearnDirectionQuery)
export class GetLearnDirectionHandler implements IQueryHandler <GetLearnDirectionQuery> {
    constructor(
        @InjectRepository(LearnDirection) private readonly learnDirection: Repository<LearnDirection>,
        private connection: EntityManager
    ) {}
    async execute(query: GetLearnDirectionQuery): Promise<LearnDirection []> {

        const where = getQueryData(query.filter)
        // Можно добавить сортировку, пагинацию (skip/take), если нужно
        return this.learnDirection.find({where, relations: ['mentors', 'students']});
    }
}



