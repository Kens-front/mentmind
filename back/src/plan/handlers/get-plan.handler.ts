import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {GetPlanQuery} from "../queries/get-plan.query";
import {InjectRepository} from "@nestjs/typeorm";
import {Plan} from "../entities/plan.entity";
import {Repository} from "typeorm";
import {NotFoundException} from "@nestjs/common";


@QueryHandler(GetPlanQuery)
export class GetPlanQueryHandler implements IQueryHandler<GetPlanQuery> {
    constructor(@InjectRepository(Plan) private readonly planRepository: Repository<Plan>) {}
    
    async execute(query: GetPlanQuery): Promise<Plan> {
        const plan = await this.planRepository.findOne({
            where: {
                user: {
                    id: query.userId,
                }
            }
        })
        
        if (!plan) {
            throw new NotFoundException("No plan found")
        }
        
        return plan
    }
}