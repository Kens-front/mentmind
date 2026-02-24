import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { GetLessonQuery } from "../queries/get-lesson.query";
import { InjectRepository } from "@nestjs/typeorm";
import { Lesson } from "../entities/lesson.entity";
import { In, Repository } from "typeorm";
import { HttpException } from "@nestjs/common";
import { GetUserFullQuery } from "src/user/queries/get-user-full.query";
import { RoleList } from "src/user/types";
import { User } from "src/user/entities/user.entity";





@QueryHandler(GetLessonQuery)
export class GetLessonHandler implements IQueryHandler<GetLessonQuery> {
    constructor(
        @InjectRepository(Lesson) private readonly lesson: Repository<Lesson>,
        @InjectRepository(User) private readonly user: Repository<User>,
        private queryBus: QueryBus,
    ) { }

    async execute(query: GetLessonQuery): Promise<Omit<Lesson, 'students' | 'calculateMentorPayout'> & {
        studentIds: number[],
        studentFullname: string
        mentorFullname: string
    } | null> {
        const lesson = await this.lesson.findOne({ where: { id: query.lessonId }, relations: ['participants', 'lessonSlots'] })

        const studentIds = lesson.participants.filter(user => user.role === RoleList.STUDENT)?.map(student => student?.userId)
        const mentorId = lesson.participants.find(user => user.role === RoleList.MENTOR)?.userId

        const mentor = await this.user.findOne({where: {id: mentorId}})

        const students = await this.user.find({where: {id: In(studentIds)}})
        
        if (!students.length || !mentor) {
            throw new HttpException('Не найден ментор или студент', 404)
        }

        if (!lesson) {
            throw new HttpException('Данное занятие не найдено', 404)
        }
        
        return {
            ...lesson,
            studentIds: lesson.participants.filter(p => p.role === RoleList.STUDENT).map(student => student.userId),
            studentFullname: students.reduce((acc, student) => [...acc, student?.fullname ?? null], []).join(', '),
            mentorFullname: mentor.fullname,
        }
    }
}