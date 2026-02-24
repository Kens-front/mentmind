import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateMentorPayoutCommand } from "../commands/update-mentor-payout.command";
import { InjectRepository } from "@nestjs/typeorm";
import { MentorPayout } from "../entities/mentor-payout.entity";
import { Repository } from "typeorm";
import { HttpException } from "@nestjs/common";




@CommandHandler(UpdateMentorPayoutCommand)
export class UpdateMentorPayoutHandler implements ICommandHandler<UpdateMentorPayoutCommand> {
    constructor(@InjectRepository(MentorPayout) private readonly mentorPayout: Repository<MentorPayout>) {}


    async execute(command: UpdateMentorPayoutCommand): Promise<MentorPayout> {
        const mentorPayout = await this.mentorPayout.findOne({where: {id: command.payout.id}})

        if (!mentorPayout) {
            throw new HttpException('Платеж не найдён', 404)
        }

        await this.mentorPayout.update({id: command.payout.id}, {...command.payout})
        return mentorPayout
    }
}