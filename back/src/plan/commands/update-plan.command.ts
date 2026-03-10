import {UpdatePlanDto} from "../dto/update-plan.dto";


export class UpdatePlanCommand {
    constructor(public readonly updatePlanDto: UpdatePlanDto) {}
}