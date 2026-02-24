import { CommandHandler, IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { GetStudentProfilesByMentorIdQuery } from "../queries/get-student-profiles-by-mentro-id.query";
import { InjectRepository } from "@nestjs/typeorm";
import { StudentProfile } from "../../student_profile/entities/student_profile.entity";
import { In, Repository } from "typeorm";
import { MentorProfile } from "src/mentor_profile/entities/mentor_profile.entity";
import { GetMentorProfileQuery } from "src/mentor_profile/queries/get-mentor-profile.query";
import { User } from "src/user/entities/user.entity";
import { GetUserBy } from "../queries/get-user-by.query";
import { USER_PARAMS } from "src/auth/constants";
import { RoleList } from "../types";





@QueryHandler(GetStudentProfilesByMentorIdQuery)
export class GetStudentProfilesByMentorIdHandler implements IQueryHandler<GetStudentProfilesByMentorIdQuery> {
    constructor(
        @InjectRepository(StudentProfile) private readonly studentProfile: Repository<StudentProfile>,
        @InjectRepository(User) private readonly user: Repository<User>,
        private queryBus: QueryBus
    ) {}

    async execute(query: GetStudentProfilesByMentorIdQuery): Promise<User []> {
        const user = await this.queryBus.execute<GetUserBy, User>(new GetUserBy(USER_PARAMS.ID, `${query.userId}`))

        if (user.role === RoleList.ADMIN || !query.userId) {
            return this.user.find();
        }

        const profiles = await this.studentProfile.find({where: {mentorId: user.id}})
        return this.user.find({where: {id: In(profiles.map(profile => profile.userId))}})
    }
}   