import { Inject, Injectable } from "@nestjs/common";
import { Connection, DataSource, EntityManager, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm";
import { StudentProfile } from "../entities/student_profile.entity";
import { QueryBus } from "@nestjs/cqrs";
import { MentorProfile } from "src/mentor_profile/entities/mentor_profile.entity";
import { GetStudentProfileQuery } from "../queries/get-student-profile.query";







@EventSubscriber()
@Injectable()
export class GenerateStudentFullnameSubscribe implements EntitySubscriberInterface<StudentProfile> {
    constructor(@Inject(DataSource) readonly connection: DataSource) {
        connection.subscribers.push(this)
    }

    listenTo(): Function | string {
 
        return StudentProfile
    }

    async afterInsert(event: InsertEvent<StudentProfile>): Promise<void> {
 
        await this.getFullName(event.entity, event.manager)
    }

    async afterUpdate(event: UpdateEvent<StudentProfile>): Promise<void> {
        const entity = event.entity

        if (entity) {
            await this.getFullName(entity as StudentProfile, event.manager)
        }
    }

    async getFullName(entity: StudentProfile, manager: EntityManager) {
 

        await manager.save(StudentProfile, entity)
    }
}