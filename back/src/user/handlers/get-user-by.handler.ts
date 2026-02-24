import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { GetUserBy } from "../queries/get-user-by.query";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { GetMentorProfileQuery } from "src/mentor_profile/queries/get-mentor-profile.query";
import { GetStudentProfileQuery } from "src/student_profile/queries/get-student-profile.query";
import { RoleList } from "../types";
 

const PROFILES: Partial<Record<RoleList, (userId: number) =>  GetMentorProfileQuery | GetStudentProfileQuery >> = {
    [RoleList.MENTOR]: (userId: number) => new GetMentorProfileQuery(userId),
    [RoleList.STUDENT]: (userId: number) => new GetStudentProfileQuery(userId),
};

 

@QueryHandler(GetUserBy)
export class GetUserByHandler implements IQueryHandler<GetUserBy> {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        private queryBus: QueryBus,
    ) {}
    
    async execute(query: GetUserBy): Promise<User | null> {
        const user = await this.users.findOne({where: {[query.key]: query.params}, relations: ['achieves']});
 
        return user
 
    }
}