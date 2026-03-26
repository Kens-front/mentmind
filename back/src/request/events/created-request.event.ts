import {CreateRequestDto} from "../dto/create-request.dto";


export class CreatedRequestEvent {
    constructor(public event: CreateRequestDto) {}
}