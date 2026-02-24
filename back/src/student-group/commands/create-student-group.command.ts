import { CreateStudentGroupDto } from "../dto/create-student-group.dto";

export class CreateStudentGroupCommand {
  constructor(public readonly dto: CreateStudentGroupDto) { }
}
