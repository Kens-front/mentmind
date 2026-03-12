import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { GetUsersQuery } from "../queries/get-users.query";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { In, Repository } from "typeorm";
import { RoleList } from "../types";

import { GetMentorProfileQuery } from "src/mentor_profile/queries/get-mentor-profile.query";
import { MentorProfile } from "src/mentor_profile/entities/mentor_profile.entity";
import {LessonPackage} from "../../lesson-package/entities/lesson-package.entity";


@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
      @InjectRepository(User) private readonly userRepo: Repository<User >,
      @InjectRepository(LessonPackage) private readonly lessonPackage: Repository<LessonPackage >,
      private readonly queryBus: QueryBus,
  ) {}

  async execute(query: GetUsersQuery): Promise<any[]> {
    const { requester, params } = query;
    const { userId, role, status, mentorId } = params || {};

    // Базовый query builder
    const qb = this.userRepo
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.student_profile', 'student_profile')
        .leftJoinAndSelect('user.mentor_profile', 'mentor_profile')
        .leftJoinAndSelect('user.plan', 'plan')
        .leftJoinAndSelect('user.lessonParticipations', 'lesson_participants')
        .leftJoinAndSelect('user.chats', 'chats')
        .addSelect(
            `(SELECT COUNT(*) 
        FROM "student-profile" 
        WHERE "mentorId" = mentor_profile.id)`,
            'studentsCount'
        )
        // payments пользователя (только paid)
        .leftJoin(
            'user.payments',
            'payment',
            'payment.status = :paid',
            { paid: 'paid' },
        )

        // lesson packages из платежей (только active)
        .leftJoin(
            'payment.lessonPackage',
            'lesson_package',
            'lesson_package.status = :active',
            { active: 'active' },
        )

        // 🔑 считаем разницу
        .addSelect(
            `
      COALESCE(
        SUM(lesson_package.totalCount - lesson_package.usedCount),
        0
      )
      `,
            'available_lessons',
        )

        // ОБЯЗАТЕЛЬНО
        .groupBy('user.id')
        .addGroupBy('student_profile.id')
        .addGroupBy('mentor_profile.id')
        .addGroupBy('chats.id')
        .addGroupBy('plan.id')
        .addGroupBy('lesson_participants.id');



    // ---------- Ролевое ограничение доступа ----------
    switch (requester.role) {
      case RoleList.ADMIN:
 
        break;

      case RoleList.MENTOR: {
        // Ментор видит только своих студентов

        // Получаем профиль ментора по userId
        const mentorProfile = await this.queryBus.execute<GetMentorProfileQuery, MentorProfile>(
            new GetMentorProfileQuery(requester.id),
        );

        if (!mentorProfile) {
          // На всякий случай – если роль MENTOR есть, а профиля ещё нет
          return [];
        }

        qb.innerJoin('user.student_profile', 'sp_for_scope')
            .andWhere('sp_for_scope.mentorId = :mentorIdScope', {
              mentorIdScope: mentorProfile.id,
            })

        if (Number(params.onlyGroup)) {
          qb.andWhere('sp_for_scope.lessonFormat != :groupFormat', {
            groupFormat: 'group',
          });
        }

        break;
      }

      case RoleList.STUDENT:
        // Студент видит только себя, игнорируем внешние фильтры по id
        qb.andWhere('user.id = :currentUserId', { currentUserId: requester.id });
        break;

      default:
        // На всякий пожарный – никакого доступа
        return [];
    }

    // ---------- Фильтры из query-параметров (если есть) ----------

    // Фильтр по конкретному пользователю (для админа/ментора)
    if (userId) {
      qb.andWhere('user.id = :filterUserId', { filterUserId: userId });
    }

    if (role) {
      qb.andWhere('user.role = :filterRole', { filterRole: role });
    }

    if (status) {
      qb.andWhere('user.status = :filterStatus', { filterStatus: status });
    }

    // mentorId как внешний фильтр (например, админ хочет увидеть студентов конкретного ментора)
    // Для АДМИНА: можно использовать mentorId из query
    // Для МЕНТОРА: игнорируем чужой mentorId, оставляем только его scope
    if (mentorId && requester.role === RoleList.ADMIN) {
      qb.innerJoin('user.student_profile', 'sp_for_filter', 'sp_for_filter.mentorId = :filterMentorId', {
        filterMentorId: mentorId,
      });
    }

    // Здесь можно добавить пагинацию:
    // if (params.limit) qb.take(params.limit);
    // if (params.offset) qb.skip(params.offset);
    const { entities, raw } = await qb.getRawAndEntities();

    const users = entities.map((user, index) => ({
      ...user,
      studentsCount: Number(raw[index].studentsCount) || 0, // Добавлено новое поле
    }));

    const packages = await this.lessonPackage.find({
      where: {
        userId: In(users.map(user => user.id)),
        status: 'active'
      }
    })
    
    return users.map(user => {
      const p =  packages.find(p => p.userId === user.id);
      let diff = 0;
      if (p) {
        diff = p.totalCount - p.usedCount;
      }
      
      return {
        ...user,
        availableLessons: diff,
      }
    });
  }
}