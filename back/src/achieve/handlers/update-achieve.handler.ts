import { CommandBus, CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreateAchieveCommand } from "../commands/create-achieve.command";
import { InjectRepository } from "@nestjs/typeorm";
import { Achieve } from "../entities/achieve.entity";
import { Repository } from "typeorm";
import { UpdateAchieveDto } from "../dto/update-achieve.dto";
import { GetMentorProfileQuery } from "src/mentor_profile/queries/get-mentor-profile.query";
import { GetStudentProfileQuery } from "src/student_profile/queries/get-student-profile.query";
import { GetUserBy } from "src/user/queries/get-user-by.query";
import { USER_PARAMS } from "src/auth/constants";
import { HttpException } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";
import { UpdateAchieveCommand } from "../commands/update-achieve.command";
import { AchieveGateway } from "../gateways/achieve.gateway";



@CommandHandler(UpdateAchieveCommand)
export class UpdateAchieveHandler implements ICommandHandler<UpdateAchieveCommand> {
    constructor(
        @InjectRepository(Achieve) private readonly achieve: Repository<Achieve>,
        private queryBus: QueryBus,
        private commandBus: CommandBus,
 
    ) {}

    async execute(command: UpdateAchieveCommand): Promise<Achieve> {
        const {userId, code, leesonId } = command.updateAchieveDto
        const user = await this.queryBus.execute<GetUserBy, User>(new GetUserBy(USER_PARAMS.ID, `${userId}`));
        const achieve = await this.achieve.findOne({where: {code}, relations: ['users']}) as Achieve
        if (!user) {
            throw new HttpException('not found user', 404);
        }

        if (!achieve) {
            throw new HttpException('not found achieve', 404);
        }

 
        const hasAchieve = achieve.users.find(user => user.id === userId)

        if (!hasAchieve) {
            achieve.users = [...achieve.users, user];

            await this.achieve.save(achieve)
 
        }

        return achieve

    }
}