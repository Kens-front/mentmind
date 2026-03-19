import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {DeleteGroupCommand} from "../commands/delete-group.command";
import {InjectRepository} from "@nestjs/typeorm";
import {StudentGroup} from "../entities/student-group.entity";
import {In, Repository} from "typeorm";
import {NotFoundException} from "@nestjs/common";
import {User} from "../../user/entities/user.entity";


@CommandHandler(DeleteGroupCommand)
export class DeleteGroupHandler implements ICommandHandler<DeleteGroupCommand> {
    constructor(
        @InjectRepository(StudentGroup) private studentGroupRepository: Repository<StudentGroup>,
 
    ) {}
    
    async execute(command: DeleteGroupCommand): Promise<void> {
        const group = await  this.studentGroupRepository.findOne({
            where: {
                id: command.groupId
            },
            relations: {
                students: {
                    student_profile: true
                }
            }
        })
        if (!group) {
            throw new NotFoundException("Unable to find student group");
        }
        
        group.students.forEach(student => {
            if (student.student_profile?.mentor) {
                student.student_profile.mentor = null 
            }
        })
        await this.studentGroupRepository.save(group);
        group.students = []
        await this.studentGroupRepository.save(group);

        // ❗ удаляем группу
        await this.studentGroupRepository.remove(group);
    }
}