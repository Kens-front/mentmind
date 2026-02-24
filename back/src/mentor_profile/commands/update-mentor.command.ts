import { UpdateMentorProfileDto } from "../dto/update-mentor_profile.dto";


export class UpdateMentorCommand {
    constructor(public userId: number, public updateMentorDto: UpdateMentorProfileDto) {}
}