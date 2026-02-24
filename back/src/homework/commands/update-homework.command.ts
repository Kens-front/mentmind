import { CreateHomeworkDto } from "../dto/create-homework.dto";
import { UpdateHomeworkDto } from "../dto/update-homework.dto";





export class UpdateHomeWorkCommand {
    constructor(public id: number, public updateHomeWork: UpdateHomeworkDto) {}
}