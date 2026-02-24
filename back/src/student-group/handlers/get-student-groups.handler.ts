import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { HttpException } from "@nestjs/common";
import { StudentGroup } from "../entities/student-group.entity";
import { GetStudentGroups } from "../queries/get-student-groups.query";
import { RoleList } from "src/user/types";
import { LessonPackage } from "src/lesson-package/entities/lesson-package.entity";

@QueryHandler(GetStudentGroups)
export class GetStudentGroupsHandler implements IQueryHandler<GetStudentGroups> {
  constructor(
    @InjectRepository(StudentGroup)
    private readonly studentGroupRepo: Repository<StudentGroup>,
    @InjectRepository(LessonPackage)
    private readonly lessonPackages: Repository<LessonPackage>,
  ) { }

  async execute(query: GetStudentGroups): Promise<any []> {
 
    const {role, userId} = query;

 

    const qb = this.studentGroupRepo
    .createQueryBuilder('group')
    .leftJoinAndSelect('group.mentor', 'mentor')
    .leftJoinAndSelect('group.students', 'student')
    .leftJoinAndSelect('student.student_profile', 'student_profile')
    .leftJoinAndSelect(
      'student.lessonPackages',
      'lesson_package',
      `
        lesson_package.status = :status
        AND (lesson_package.totalCount - lesson_package.usedCount) > 0
      `,
      { status: 'active' }
    );
    
    if (role === RoleList.MENTOR) {
      qb.andWhere('mentor.id = :mentorId', { mentorId: userId });
    }


    const groups = await qb.getMany();
    
    const result = groups.map(group => {
      const lessonPackages = group.students.flatMap(student =>
        (student.lessonPackages ?? []).map(lp => ({
          studentId: student.id,
          ...lp
        }))
      );

      return {
        ...group,
        lessonPackages,
        mentorName: group.mentor?.fullname ?? null,
        firstStudent: group.students[0]?.fullname ?? null,
        lastStudent: group.students[1]?.fullname ?? null,
        isAvailable: lessonPackages.length && lessonPackages.every(lp => (lp.totalCount - lp.usedCount) > 0)
      };
    });

    if (!groups) {
      throw new HttpException('Student group not found', 404);
    }
   
 
    return result;
  }
}
