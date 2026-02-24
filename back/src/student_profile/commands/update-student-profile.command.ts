import { UpdateStudentProfileDto } from "../dto/update-student_profile.dto";


export class UpdateStudentProfileCommand {
    constructor(public userId: number, public updateStudentProfileDto: UpdateStudentProfileDto) {}
}