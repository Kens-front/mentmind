import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateMentorPayoutsCommand } from "../commands/update-mentor-payouts.command";
import { InjectRepository } from "@nestjs/typeorm";
import { MentorPayout } from "../entities/mentor-payout.entity";
import { Between, Repository } from "typeorm";
import { LESSON_PAYOUTS } from "src/lesson/entities/lesson.entity";





@CommandHandler(UpdateMentorPayoutsCommand)
export class UpdateMentorPayoutsHandler implements ICommandHandler<UpdateMentorPayoutsCommand> {
    constructor(@InjectRepository(MentorPayout) private readonly mentorPayout: Repository<MentorPayout>) {}


    async execute(command: UpdateMentorPayoutsCommand): Promise<any> {

 
        const mentorPayouts = await this.mentorPayout.find({where: {
            createAt: Between(new Date(command.dto.start_date), new Date(command.dto.end_date)),
            mentor: {userId: command.dto.mentorId},
            status: LESSON_PAYOUTS.PENDING
        }})

        const arrayDateItems = new Date().toLocaleDateString().split('.')

        console.log(arrayDateItems.reverse().join('-'));
        return this.mentorPayout.save(mentorPayouts.map(payout => (
            {
                ...payout, 
                status: command.dto.status ?? payout.status,
                paidAt: arrayDateItems.reverse().join('-')
            }
        )))
    } 
}