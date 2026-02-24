import { CreateMentorProfileDto } from "../dto/create-mentor_profile.dto";



export class CreateMentorProfileCommand {
    constructor(public createMentorProfileDto: CreateMentorProfileDto) {}
}