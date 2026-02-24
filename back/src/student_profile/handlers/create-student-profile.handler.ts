import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreateStudentProfileCommand } from "../commands/create-student-profile.command";
import { InjectRepository } from "@nestjs/typeorm";
import { StudentProfile } from "../entities/student_profile.entity";
import { Repository } from "typeorm";
import { USER_PARAMS } from "src/auth/constants";
import { GetUserBy } from "src/user/queries/get-user-by.query";
import { User } from "src/user/entities/user.entity";
import { LearnDirection } from "src/learn_direction/entities/learn_direction.entity";





@CommandHandler(CreateStudentProfileCommand)
export class CreateStudentProfileHandler implements ICommandHandler<CreateStudentProfileCommand> {
    constructor(
        @InjectRepository(StudentProfile) private readonly studentRepo: Repository<StudentProfile>,
        @InjectRepository(LearnDirection) private readonly directionRepo: Repository<LearnDirection>,
        private queryBus: QueryBus,
    ) {}

    async execute(command: CreateStudentProfileCommand): Promise<StudentProfile> {
        const { userId, learn_direction } = command.createStudentProfileDto;

        const user = await this.queryBus.execute(new GetUserBy(USER_PARAMS.ID, userId.toString()));
        let direction = null;

        if (!user) {
            throw new Error("User not found");
        }

        if (user.mentor_profile) {
            throw new Error("User already has a mentor profile");
        }

        if (learn_direction) {
            direction = await this.directionRepo.findOne({
                where: { id: learn_direction }
            });
        }
 

        const profile = this.studentRepo.create({
            user,
            userId,
            learn_direction: direction,
        });

        return this.studentRepo.save(profile);
    }
}
