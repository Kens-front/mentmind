import { CreateMentorAvailabilityDto } from "../dto/create-mentor-availability.dto";



export class CreateMentorAvailabilityCommand {
    constructor(public dto: {userId: number, slots: CreateMentorAvailabilityDto [], period: {start: string, end: string}}) {}
}