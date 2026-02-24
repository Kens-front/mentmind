import { CreateMentorPayoutDto } from "../dto/create-mentor-payout.dto";



export class CreateMentorPayoutCommand {
    constructor(public createMentorPayoutDto: CreateMentorPayoutDto) {}
}