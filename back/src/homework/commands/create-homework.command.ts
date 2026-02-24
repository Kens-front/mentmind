import { CreateHomeworkDto } from "../dto/create-homework.dto";





export class CreateHomeWorkCommand {
    constructor(public createHomeWork: CreateHomeworkDto) {}
}