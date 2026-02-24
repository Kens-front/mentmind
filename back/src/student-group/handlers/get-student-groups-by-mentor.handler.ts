import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StudentGroup } from "../entities/student-group.entity";
import { GetStudentGroupsByMentorQuery } from "../queries/get-student-groups-by-mentor.query";

@QueryHandler(GetStudentGroupsByMentorQuery)
export class GetStudentGroupsByMentorHandler implements IQueryHandler<GetStudentGroupsByMentorQuery> {
  constructor(
    @InjectRepository(StudentGroup)
    private readonly studentGroupRepo: Repository<StudentGroup>,
  ) { }

  async execute(query: GetStudentGroupsByMentorQuery): Promise<StudentGroup[]> {
    const { mentorId } = query;

    return await this.studentGroupRepo.find({
      where: { mentorId, active: true },
      relations: ['mentor', 'students'],
      order: { createdAt: 'DESC' },
    });
  }
}
