import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreateMentorProfileCommand } from "../commands/create-mentor-profile.command";
import { InjectRepository } from "@nestjs/typeorm";
import { MentorProfile } from "../entities/mentor_profile.entity";
import { In, Repository } from "typeorm";
import { GetUserBy } from "src/user/queries/get-user-by.query";
import { USER_PARAMS } from "src/auth/constants";
import { User } from "src/user/entities/user.entity";
import { LearnDirection } from "src/learn_direction/entities/learn_direction.entity";




@CommandHandler(CreateMentorProfileCommand)
export class CreateMentorProfileHandler implements ICommandHandler<CreateMentorProfileCommand> {
    constructor(
        @InjectRepository(MentorProfile) private readonly mentorRepo: Repository<MentorProfile>,
        @InjectRepository(LearnDirection) private readonly directionRepo: Repository<LearnDirection>,
        private queryBus: QueryBus,
    ) {}

    async execute(command: CreateMentorProfileCommand): Promise<MentorProfile> {
        const { userId, learn_directions } = command.createMentorProfileDto;

        const user = await this.queryBus.execute(new GetUserBy(USER_PARAMS.ID, userId.toString()));

        if (!user) {
            throw new Error("User not found");
        }

        if (user.student_profile) {
            throw new Error("User already has a student profile");
        }

        const directions = await this.directionRepo.find({
            where: { id: In(learn_directions) }
        });

        const profile = this.mentorRepo.create({
            user,
            userId,
            learn_directions: directions,
        });

        return this.mentorRepo.save(profile);
    }
}
