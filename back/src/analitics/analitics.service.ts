// analytics.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {In, MoreThan, MoreThanOrEqual, Not, Repository} from 'typeorm';
import {Lesson, LESSON_STATUS, LESSON_TYPES} from 'src/lesson/entities/lesson.entity';
import {
  AnalyticsSummaryResponse,
  UserRole,
  AdminAnalytics,
  MentorAnalytics,
  StudentAnalytics,
} from './types';
import { LessonSlotStatus } from 'src/lesson-slots/types';
import { MentorPayout } from 'src/mentor-payout/entities/mentor-payout.entity';
import {LessonPackage} from "../lesson-package/entities/lesson-package.entity";
import {groupBy} from "rxjs";

type AppUser = { id: number; role: UserRole }; // подстрой под свою User entity/interface

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,

    @InjectRepository(LessonPackage)
    private readonly lessonPackageRepo: Repository<LessonPackage>,

    @InjectRepository(MentorPayout)
    private readonly mentorPayout: Repository<MentorPayout>,
  ) {}

  // “одна ручка”
  async getSummary(user: AppUser): Promise<any> {
      return this.lessonRepo.findAndCount({
          where: {
              participants: {
                  userId: In([user.id]),
              },
              date: new Date().toISOString().split('T')[0]
          }
      })
 }
}
