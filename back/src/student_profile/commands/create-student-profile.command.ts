import { CreateStudentProfileDto } from "../dto/create-student_profile.dto";



export class CreateStudentProfileCommand {
    constructor(public createStudentProfileDto: CreateStudentProfileDto) {}
}