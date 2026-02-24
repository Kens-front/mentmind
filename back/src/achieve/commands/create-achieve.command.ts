import { CreateAchieveDto } from "../dto/create-achieve.dto";


export class CreateAchieveCommand {
    constructor(public createAchieveDto: CreateAchieveDto) {}
}