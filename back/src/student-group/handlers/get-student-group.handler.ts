import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HttpException } from "@nestjs/common";
import { StudentGroup } from "../entities/student-group.entity";
import { GetStudentGroupQuery } from "../queries/get-student-group.query";

@QueryHandler(GetStudentGroupQuery)
export class GetStudentGroupHandler implements IQueryHandler<GetStudentGroupQuery> {
  constructor(
    @InjectRepository(StudentGroup)
    private readonly studentGroupRepo: Repository<StudentGroup>,
  ) { }

  async execute(query: GetStudentGroupQuery): Promise<StudentGroup> {
    const { id } = query;

    const group = await this.studentGroupRepo.findOne({
      where: { id },
      relations: ['mentor', 'students'],
    });

    if (!group) {
      throw new HttpException('Student group not found', 404);
    }

    return group;
  }
}
