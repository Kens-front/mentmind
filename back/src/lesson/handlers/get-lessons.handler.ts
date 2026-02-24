import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { GetLessonsQuery, ILessonQuery } from "../queries/get-lessons.query";
import { InjectRepository } from "@nestjs/typeorm";
import { Lesson } from "../entities/lesson.entity";
import { Or, MoreThanOrEqual, Repository, LessThanOrEqual, And } from "typeorm";
import { RoleList } from "src/user/types";
import { GetUserBy } from "src/user/queries/get-user-by.query";
import { USER_PARAMS } from "src/auth/constants";
import { User } from "src/user/entities/user.entity";
import { HttpException } from "@nestjs/common";
import { GetMentorProfileQuery } from "src/mentor_profile/queries/get-mentor-profile.query";
import { MentorProfile } from "src/mentor_profile/entities/mentor_profile.entity";



@QueryHandler(GetLessonsQuery)
export class GetLessonsHandler implements IQueryHandler<GetLessonsQuery> {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,

    private readonly queryBus: QueryBus,
  ) { }

  async execute(query: GetLessonsQuery): Promise<Lesson[]> {
    const { userId, start_date, end_date } = query.params;

    const qb = this.lessonRepo
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'user')
      .leftJoinAndSelect('lesson.lessonSlots', 'lessonSlots')
      .where('lessonSlots.date >= :start', { start: start_date });

    if (end_date) {
      qb.andWhere('lessonSlots.date <= :end', { end: end_date });
    }

    if (!userId) {

      return qb.getMany();
    }

    const user = await this.queryBus.execute<GetUserBy, User>(
      new GetUserBy(USER_PARAMS.ID, String(userId)),
    );

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    switch (user.role) {
      case 'admin':
        break;

      case 'mentor':
        qb.andWhere('participants.userId = :userId', { userId });
        break;

      case 'student':
        qb.andWhere('participants.userId = :userId', { userId });
        break;

      default:
        throw new HttpException('Forbidden role', 403);
    }

    return qb.getMany();
  }
}
