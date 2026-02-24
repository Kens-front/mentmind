import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { GetMentorPayoutsQuery } from "../queries/get-mentor-payouts.query";
import { InjectRepository } from "@nestjs/typeorm";
import { MentorPayout } from "../entities/mentor-payout.entity";
import { And, Between, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { RoleList } from "src/user/types";
import { GetMentorProfileQuery } from "src/mentor_profile/queries/get-mentor-profile.query";
import { HttpException } from "@nestjs/common";
 







@QueryHandler(GetMentorPayoutsQuery)
export class GetMentorPayoutsHandler implements IQueryHandler<GetMentorPayoutsQuery> {
    constructor(
        @InjectRepository(MentorPayout) private readonly payout: Repository<MentorPayout>,
        private queryBus: QueryBus
    ) { }

    private rolesFilter: Record<RoleList, (params: Partial<any>) => Promise<any>> = {
        //@ts-ignore
        admin: async (params) => {
            return this.payout.findAndCount({
                where: {
                    mentor: { userId: params.mentorId ?? null },
                    createAt: And(MoreThanOrEqual(params.start_date), LessThanOrEqual(params.end_date)),
                }, relations: { lesson: true, mentor: { user: true } },
                take: params.take ?? 10,
                skip: params.skip ?? 0
            })
        },
        mentor: async (params) => {
            const { userId, ...filter } = params;

            const mentor = await this.queryBus.execute(new GetMentorProfileQuery(userId))

            if (!mentor) {
                throw new HttpException('mentor has not found', 404)
            }

            return this.payout.findAndCount({
                where: {
                    mentorId: params.mentorId,
                    createAt: Between(new Date(params.start_date), new Date(params.end_date))
                }, relations: { lesson: true, mentor: { user: true } },
                take: params.take ?? 5,
                skip: params.skip ?? 0
            })
        },
        student: () => undefined
    }
    async execute(query: GetMentorPayoutsQuery): Promise<MentorPayout[]> {
        const role = query.user.role



        return this.rolesFilter[role]({ ...query.filter });
    }
}