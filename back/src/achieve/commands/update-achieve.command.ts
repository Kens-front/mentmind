import { UpdateAchieveDto } from "../dto/update-achieve.dto";

export class UpdateAchieveCommand {
    constructor(public updateAchieveDto: UpdateAchieveDto) {}
}