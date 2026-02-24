import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../entities/user.entity";
import { GetUserFullQuery } from "../queries/get-user-full.query";

import { RoleList } from "../types";
import { GetMentorProfileQuery } from "src/mentor_profile/queries/get-mentor-profile.query";
import { GetStudentProfileQuery } from "src/student_profile/queries/get-student-profile.query";

import { NotFoundException } from "@nestjs/common";

@QueryHandler(GetUserFullQuery)
export class GetUserFullHandler implements IQueryHandler<GetUserFullQuery> {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(query: GetUserFullQuery) {
    const user = await this.usersRepo.findOne({
      where: { id: query.userId },
      relations: ['achieves'],
    });

    if (!user) {
      throw new NotFoundException("Пользователь не найден");
    }

    let profile = null;
 

    if (user.role === RoleList.MENTOR) {
      profile = await this.queryBus.execute(
        new GetMentorProfileQuery(user.id)
      );
    }

    if (user.role === RoleList.STUDENT) {
      profile = await this.queryBus.execute(
        new GetStudentProfileQuery(user.id)
      );
    }

    return {
      user,
      profile,
    };
  }
}
