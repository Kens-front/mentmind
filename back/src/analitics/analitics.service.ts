// analytics.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, MoreThanOrEqual, Not, Repository } from 'typeorm';
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
  async getSummary(user: AppUser): Promise<AnalyticsSummaryResponse> {
    const role = user.role;

    const builders: Record<UserRole, () => Promise<AnalyticsSummaryResponse>> = {
      admin: async () => ({ role: 'admin', data: await this.buildAdminSummary() }),
      mentor: async () => ({ role: 'mentor', data: await this.buildMentorSummary(user.id) }),
      student: async () => ({ role: 'student', data: await this.buildStudentSummary(user.id) }),
    };

    const build = builders[role];
    if (!build) throw new ForbiddenException('Unknown role');

    return build();
  }

  private async buildAdminSummary(): Promise<AdminAnalytics> {
    const currentData = new Date().toISOString().slice(0, 10);
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const [lessonMetrics, salaryResult, averageLessonCount, totalRevenue, upcomingPayouts] =
        await Promise.all([
          // Существующий запрос метрик уроков
          this.lessonRepo.createQueryBuilder('lesson')
              .select("COUNT(*)", "total")
              .addSelect("COUNT(CASE WHEN lesson.status = :completedStatus THEN 1 END)", "completed")
              .addSelect("COUNT(CASE WHEN lesson.status = :cancelledStatus THEN 1 END)", "cancelled")
              .leftJoin('lesson.lessonSlots', 'slot')
              .addSelect("COUNT(DISTINCT CASE WHEN slot.status = :slotCompletedStatus THEN lesson.id END)", "paid")
              .andWhere('lesson.date >= :currentDate', { currentDate: currentData })
              .addSelect(
                  "COUNT(CASE WHEN lesson.status = :plannedStatus AND lesson.date >= :currentDate THEN 1 END)",
                  "closer"
              )
              .setParameters({
                completedStatus: LESSON_STATUS.COMPLETED,
                cancelledStatus: LESSON_STATUS.CANCELLED,
                slotCompletedStatus: LessonSlotStatus.COMPLETED,
                plannedStatus: LESSON_STATUS.PLANNED,
                currentDate: currentData,
              })
              .getRawOne(),

          // Существующий запрос общей суммы выплат
          this.mentorPayout.createQueryBuilder('payout')
              .select('SUM(payout.finalAmount)', 'sum')
              .getRawOne(),

          // Среднее количество уроков
          this.lessonRepo.createQueryBuilder('lesson')
              .select('COUNT(lesson.id)', 'averageLessonCount')
              .where('lesson.date BETWEEN :startLastMonth AND :endLastMonth', {
                startLastMonth: new Date(today.getFullYear(), today.getMonth() - 1, 1),
                endLastMonth: new Date(today.getFullYear(), today.getMonth(), 0)
              })
              .getRawOne(),

          // НОВЫЙ: Расчёт общей выручки (оплаченные уроки)
          this.lessonRepo.createQueryBuilder('lesson')
              .select('SUM(lesson.price)', 'totalRevenue')
              // .innerJoin('lesson.lessonSlots', 'slot')
              .where('lesson.lessonType != :type', { type: LESSON_TYPES.TRIAL })
              .andWhere('lesson.status = :status', { status: LESSON_STATUS.COMPLETED })
              .getRawOne(),

          // НОВЫЙ: Расчёт выплат в ближайшие 7 дней
          this.mentorPayout.createQueryBuilder('payout')
              .select('SUM(payout.finalAmount)', 'upcomingSum')
              .where('payout.createAt BETWEEN :startDate AND :endDate', {
                startDate: today.toISOString(),
                endDate: nextWeek.toISOString()
              })
              .getRawOne(),
        ]);

    console.log('totalRevenue', totalRevenue);
    return {
      ...lessonMetrics,
      totalRevenue: parseFloat(totalRevenue.totalRevenue) || 0,
      allSalaryCount: parseFloat(salaryResult.sum) || 0,
      upcomingSum: parseFloat(upcomingPayouts.upcomingSum) || 0,
      averageLessonCount: Math.round(averageLessonCount.averageLessonCount / 4)
    };
  }

  private async buildMentorSummary(mentorUserId: number): Promise<MentorAnalytics> {
    /**
     * В твоей Lesson сейчас нет явной связи "ментор".
     * Поэтому ниже — шаблон.
     *
     * Когда добавишь, например:
     * lesson.mentor: User (ManyToOne) или lesson.mentorId:number
     * — просто заменишь where.
     */
    const myCompletedLessonCount = 0;

    return { myCompletedLessonCount };
  }

  private async buildStudentSummary(studentUserId: number): Promise<StudentAnalytics> {
    const currentData = new Date().toISOString().slice(0, 10)
    console.log('studentUserId', studentUserId);
    /**
     * У тебя есть ManyToMany lesson.users.
     * Значит можно считать занятия студента через join.
     * Это корректно и не раздувает данные, потому что считаем COUNT.
     */
    const myCompletedLessonCount = await this.lessonRepo
      .createQueryBuilder('lesson')
      .innerJoin('lesson.participants', 'user', 'user.userId IN (:uid)', { uid: studentUserId })
      .select("COUNT(*)", "total")
      .addSelect("COUNT(CASE WHEN lesson.status = :completedStatus THEN 1 END)", "completed")
      .addSelect("COUNT(CASE WHEN lesson.status = :cancelledStatus THEN 1 END)", "cancelled")
      .addSelect(
          "COUNT(CASE WHEN lesson.status = :plannedStatus AND lesson.date >= :currentDate THEN 1 END)",
          "closer"
      )
      .setParameters({
        completedStatus: LESSON_STATUS.COMPLETED,
        cancelledStatus: LESSON_STATUS.CANCELLED,
        plannedStatus: LESSON_STATUS.PLANNED,
        currentDate: currentData,
      })
      .getRawOne();
    
    const packageInfo = await this.lessonPackageRepo
        .createQueryBuilder('pkg') // алиас не особо важен, т.к. основной WHERE только для суммы
        .select([
          // Среднее по всей таблице
          `(SELECT AVG("totalCount") FROM "lesson-package") AS "averageLessonCount"`,

          // Сумма только для текущего студента
          'SUM(pkg."totalCount") AS "totalLessonCount"',
        ])
        .where('pkg."userId" = :studentUserId', { studentUserId })
        .getRawOne();

    return { ...myCompletedLessonCount, ...packageInfo };
  }
}
