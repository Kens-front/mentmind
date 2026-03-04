import {CreatePsychologySessionDto} from "./dto/create-psychology-session.dto";


export class CreatePsychologySessionCommand {
    constructor(public dto: CreatePsychologySessionDto) {
        
    }
}