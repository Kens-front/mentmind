// analytics.types.ts
import {User} from "../../user/entities/user.entity";

export type UserRole = 'admin' | 'mentor' | 'student';

export type AdminAnalytics = {
  allLessonCount: number;
  allCompletedLessonCount: number;
  allCancelledLessonCount: number;

  allPaidLessonCount: number; // 👈 новое
  allCloserLessons: number
  allSalaryCount: number
};

export type MentorAnalytics = {
  // пример: потом добавишь mentorLessonCount и т.д.
  myCompletedLessonCount: number;
};

export type StudentAnalytics = {
  // пример
  myCompletedLessonCount: number;
};

export type AnalyticsSummaryResponse =
  | { role: 'admin'; data: AdminAnalytics }
  | { role: 'mentor'; data: MentorAnalytics }
  | { role: 'student'; data: StudentAnalytics };

export interface AnalyticData {
  upcomingLessons: number
  completedLessons?: number
}
export interface AnalyticProvider {
  getAnalytics(user: User): Promise<AnalyticData>
}
