import { CommandBus, EventBus, EventsHandler, IEventHandler, QueryBus } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateAchieveCommand } from "src/achieve/commands/update-achieve.command";
import { AchieveGateway } from "src/achieve/gateways/achieve.gateway";
import { EAchieves } from "src/achieve/types";
import { LessonCompleteEvent } from "src/lesson/events/lesson-completed.event";
import { MentorProfile } from "src/mentor_profile/entities/mentor_profile.entity";
import { StudentProfile } from "src/student_profile/entities/student_profile.entity";
import { User } from "src/user/entities/user.entity";
import { In, Repository } from "typeorm";
import {AppGateway} from "../../../app.gateway";
import {LessonParticipant} from "../../../lesson-participant/entities/lesson-participant.entity";





@EventsHandler(LessonCompleteEvent)
export class FirstLessonCompletedByMentor implements IEventHandler<LessonCompleteEvent> {
    constructor(
        private queryBus: QueryBus,
        private command: CommandBus,
        @InjectRepository(User) private readonly user: Repository<User>,
        @InjectRepository(MentorProfile) private readonly mentor: Repository<MentorProfile>,
        @InjectRepository(StudentProfile) private readonly student: Repository<StudentProfile>,
        @InjectRepository(LessonParticipant) private readonly lessonParticipant: LessonParticipant,
        private gateway: AppGateway
    ) {}

    async handle(event: LessonCompleteEvent) {
        const { userIds } = event
        //
        // const mentors = await this.mentor.find({where: {userId: In(userIds)}, relations: ['lessons']})
        // const students = await this.student.find({where: {userId: In(userIds)}, relations: ['lessons']})

        const users = await this.user.find({
            where: {
                id: In(userIds),
            },
            relations: {
                lessonParticipations: true
            }
        });

        console.log('userIds', userIds);
        console.log('users', users.map(user => user));
        const firstLessonUsers = users.filter(user => user.lessonParticipations.length === 1);

 
        const requestsForAchieve = firstLessonUsers.map(user =>  this.command.execute(new UpdateAchieveCommand({userId: user.id, code: EAchieves.FIRST_LESSON_COMPLETED})))
  
        //await Promise.all(requestsForAchieve)

        return users
        try {
            firstLessonUsers.forEach(user => {
                this.gateway.addAchieve(
                    String(user.id),
                    'achieve',
                    '{test: 8908998042}',
                );  
            })
        } catch (err) {
            // логируем, но не падаем
        }
    }
}