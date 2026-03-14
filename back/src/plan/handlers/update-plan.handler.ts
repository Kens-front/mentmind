import {CommandHandler, ICommandHandler, QueryBus} from "@nestjs/cqrs";
import {CreatePlanCommand} from "../commands/create-plan.command";
import {InjectRepository} from "@nestjs/typeorm";
import {Plan} from "../entities/plan.entity";
import {Repository} from "typeorm";
import {GetUserBy} from "../../user/queries/get-user-by.query";
import {USER_PARAMS} from "../../auth/constants";
import {NotFoundException} from "@nestjs/common";
import {UpdatePlanCommand} from "../commands/update-plan.command";


@CommandHandler(UpdatePlanCommand)
export class UpdatePlanCommandHandler implements ICommandHandler<UpdatePlanCommand> {
    constructor(
        @InjectRepository(Plan) private readonly plan: Repository<Plan>,
    ) {}

    async execute(command: UpdatePlanCommand): Promise<Plan> {
        const {id, text} = command.updatePlanDto
    
        const plan = await this.plan.findOne({
            where: {
                id: id,
            }
        })
        
        if (!plan) {
            throw new NotFoundException("Planr not found");
        }

        Object.assign(plan, { text});

        return this.plan.save(plan);
    }
}