import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { GetStudentProfileQuery } from "../queries/get-student-profile.query";
import { InjectRepository } from "@nestjs/typeorm";
import { StudentProfile } from "../entities/student_profile.entity";
import { Repository } from "typeorm";
import { GetUserBy } from "src/user/queries/get-user-by.query";
import { USER_PARAMS } from "src/auth/constants";
import { User } from "src/user/entities/user.entity";



@QueryHandler(GetStudentProfileQuery)
export class GetStudentProfileHandler implements IQueryHandler<GetStudentProfileQuery> {
    constructor(
        @InjectRepository(StudentProfile) private readonly studentProfile: Repository<StudentProfile>,
        private queryBus: QueryBus
    ) {}

    async execute(query: GetStudentProfileQuery): Promise<Omit<StudentProfile, 'learn_direction'> & { learn_direction: number, fullname: string}> {
   
        const student = await this.studentProfile.findOne({where: {userId: query.userId}, relations: ['mentor', 'learn_direction']})
        
        const {id, student_profile, ...user} = await this.queryBus.execute<GetUserBy, User>(new GetUserBy(USER_PARAMS.ID, `${query.userId}`))
        
        return {
            ...student, 
            learn_direction: student?.learn_direction?.id, 
            mentorId: student.mentor?.userId,
            fullname: 'student.mentor?.fullname',
        }
    }
}