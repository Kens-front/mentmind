import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { GetMentorAvailabiltiesByUserIdQuery } from "../queries/get-mentor-ability-by-user-id.query";
import { InjectRepository } from "@nestjs/typeorm";
import { MentorAvailability } from "../entities/mentor-availability.entity";
import { Between, MoreThanOrEqual, Repository } from "typeorm";
import { GetMentorProfileQuery } from "src/mentor_profile/queries/get-mentor-profile.query";
import { MentorProfile } from "src/mentor_profile/entities/mentor_profile.entity";





@QueryHandler(GetMentorAvailabiltiesByUserIdQuery)
export class GetMentorAvailabiltiesByUserIdHandler implements IQueryHandler<GetMentorAvailabiltiesByUserIdQuery> {
    constructor(
        @InjectRepository(MentorAvailability) private mentorAvaibilit: Repository<MentorAvailability>,
        private queryBus: QueryBus,
    ) {}

    async execute(query: GetMentorAvailabiltiesByUserIdQuery): Promise<any> {
        const mentor = await this.queryBus.execute<GetMentorProfileQuery, MentorProfile>(new GetMentorProfileQuery(query.id));
        return this.mentorAvaibilit.find({where: {mentorProfileId: mentor.id, date: MoreThanOrEqual(query.query.date)}})
    }
}