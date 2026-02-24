import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { MentorAvailability } from "../entities/mentor-availability.entity";
import { Between, Repository } from "typeorm";
import { GetMentorProfileQuery } from "src/mentor_profile/queries/get-mentor-profile.query";
import { MentorProfile } from "src/mentor_profile/entities/mentor_profile.entity";
import { GetMentorAvailabiltiessQuery } from "../queries/get-mentor-availabilty.query";





@QueryHandler(GetMentorAvailabiltiessQuery)
export class GetMentorAvailabiltiesdHandler implements IQueryHandler<GetMentorAvailabiltiessQuery> {
    constructor(
        @InjectRepository(MentorAvailability) private mentorAvaibilit: Repository<MentorAvailability>,
        private queryBus: QueryBus,
    ) {}

    async execute(query: GetMentorAvailabiltiessQuery): Promise<any> {
        const mentor = await this.queryBus.execute<GetMentorProfileQuery, MentorProfile>(new GetMentorProfileQuery(query.userId));

        return this.mentorAvaibilit.find({where: {mentorProfileId: mentor.id, date: Between(query.query.from, query.query.to)}})
    }
}