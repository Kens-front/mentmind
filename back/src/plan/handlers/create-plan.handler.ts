import {CommandHandler, ICommandHandler, QueryBus} from "@nestjs/cqrs";
import {CreatePlanCommand} from "../commands/create-plan.command";
import {InjectRepository} from "@nestjs/typeorm";
import {Plan} from "../entities/plan.entity";
import {Repository} from "typeorm";
import {GetUserBy} from "../../user/queries/get-user-by.query";
import {USER_PARAMS} from "../../auth/constants";
import {NotFoundException} from "@nestjs/common";


@CommandHandler(CreatePlanCommand)
export class CreatePlanCommandHandler implements ICommandHandler<CreatePlanCommand> {
    constructor(
        @InjectRepository(Plan) private readonly plan: Repository<Plan>,
        private queryBus: QueryBus
    ) {}
    
    async execute(command: CreatePlanCommand): Promise<Plan> {
        const {userId, text} = command.createPlanDto
        const user = await this.queryBus.execute(new GetUserBy(USER_PARAMS.ID,`${userId}`));
        
        if (!user) {
            throw new NotFoundException("User not found");
        }
        
        let plan = await this.plan.findOne({
            where: {
                user: {
                    id: userId,
                }
            }
        })
        
        if (plan) {
            console.log('plan', command.createPlanDto);
            
            plan.text = text;
        } 
        else {
            plan = this.plan.create({text, user}); 
        }
        
 
        return this.plan.save(plan);
    }
}