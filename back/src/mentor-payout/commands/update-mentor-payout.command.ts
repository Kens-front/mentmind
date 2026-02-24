import { UpdateMentorPayoutDto } from "../dto/update-mentor-payout.dto";


export class UpdateMentorPayoutCommand {
    constructor(public payout: UpdateMentorPayoutDto) {}
}