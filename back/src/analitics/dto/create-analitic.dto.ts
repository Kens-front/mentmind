export interface MentorAnalyticsDto {
    lessonsNextWeek: number;
    potentialIncomeNextWeek: number;
    shareOfAllMentorLessonsNextWeek: number; // 0..1
    averageRating: number | null;
  }
  
  export interface StudentAnalyticsDto {
    lessonsNextWeek: number;
    shareOfAllStudentLessonsNextWeek: number; // 0..1
    sameLevelStudentsPercent: number; // 0..100
  }
  