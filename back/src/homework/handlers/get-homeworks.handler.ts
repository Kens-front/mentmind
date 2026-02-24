import { CommandHandler, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetHomeWorksQuery } from "../queries/get-homeworks.query";
import { InjectRepository } from "@nestjs/typeorm";
import { Homework } from "../entities/homework.entity";
import { In, Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { RoleList } from "src/user/types";
import { MentorProfile } from "src/mentor_profile/entities/mentor_profile.entity";
import { StudentProfile } from "src/student_profile/entities/student_profile.entity";

@QueryHandler(GetHomeWorksQuery)
export class GetHomeWorksHandler implements IQueryHandler<GetHomeWorksQuery> {
    constructor(
        @InjectRepository(Homework) private readonly homework: Repository<Homework>,
        @InjectRepository(User) private readonly user: Repository<User>,
        @InjectRepository(MentorProfile) private readonly mentor: Repository<MentorProfile>,
        @InjectRepository(StudentProfile) private readonly student: Repository<MentorProfile>,
    ) {}

    async execute(query: GetHomeWorksQuery): Promise<Homework []> {
        

        const {user} = query
        if (user.role === RoleList.ADMIN) {
            return this.homework.find();
        }
 

        if (user.role === RoleList.MENTOR) {
            const mentorPropfile = await this.mentor.findOne({where: {userId: user.id}, relations: ['students']})

 
            return this.homework.find({where: {studentId: In(mentorPropfile?.students?.map(student => student.id))},  relations: {student: {user: true}}})
        }

        const student = await this.student.findOne({where: {userId: user.id}})

 
        return  this.homework.find({where: {studentId: student.id}, relations: {student: {user: true}}})
    }
}