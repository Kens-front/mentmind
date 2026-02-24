import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetMentorProfilesQuery } from "../queries/get-mentor-profiles.query";
import { InjectRepository } from "@nestjs/typeorm";
import { MentorProfile } from "../entities/mentor_profile.entity";
import { Repository } from "typeorm";



@QueryHandler(GetMentorProfilesQuery)
export class GetMentorProfilesHandler implements IQueryHandler<GetMentorProfilesQuery> {
    constructor(@InjectRepository(MentorProfile) private readonly mentor: Repository<MentorProfile>){}

    async execute(query: GetMentorProfilesQuery): Promise<any> {
        return this.mentor.find()
    }
}