import { UpdateMentorPayoutsDto } from "../dto/update-mentor-payouts.dto";


export class UpdateMentorPayoutsCommand {
    constructor(public dto: UpdateMentorPayoutsDto) {}
}