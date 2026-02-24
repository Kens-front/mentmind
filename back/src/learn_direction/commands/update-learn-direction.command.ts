import { UpdateLearnDirectionDto } from "../dto/update-learn_direction.dto";


export class UpdateLearnDirectionCommand {
    constructor(public id: number, public learnDirection: UpdateLearnDirectionDto) {}
}