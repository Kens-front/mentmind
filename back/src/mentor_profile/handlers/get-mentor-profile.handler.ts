import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { GetMentorProfileQuery } from "../queries/get-mentor-profile.query";
import { InjectRepository } from "@nestjs/typeorm";
import { MentorProfile } from "../entities/mentor_profile.entity";
import { Repository } from "typeorm";
import { HttpException } from "@nestjs/common";
 

type TMentorProfileResponse = Omit<MentorProfile, 'learn_directions'> & { learn_directions: number [], studentsCount: number}


@QueryHandler(GetMentorProfileQuery)
export class GetMentorProfileHandler implements IQueryHandler<GetMentorProfileQuery> {
    constructor(
        @InjectRepository(MentorProfile) private readonly mentorPofile: Repository<MentorProfile>,
        private queryBus: QueryBus
    ) {}

    async execute(query: GetMentorProfileQuery): Promise<TMentorProfileResponse> {
        const profile = await this.mentorPofile.findOne({where: {userId: query.userId}, relations: ['students', 'availability_slots', 'learn_directions']})
        // const user = await this.queryBus.execute(new GetUserBy(USER_PARAMS.ID, `${profile.userId}`));
        
        if (!profile) {
            throw new HttpException('Данный ментор не найден', 404);
        }
        return { ...profile, learn_directions: profile.learn_directions?.map(ld => ld.id), studentsCount: profile.students?.length};
    }
}