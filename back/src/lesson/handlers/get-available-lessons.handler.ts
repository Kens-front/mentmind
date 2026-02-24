import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { GetAvailableLessonsQuery } from "../queries/get-available-lessons.query";
import { InjectRepository } from "@nestjs/typeorm";
import { Lesson, LESSON_STATUS } from "../entities/lesson.entity";
import { Repository } from "typeorm";
import { GetStudentProfileQuery } from "src/student_profile/queries/get-student-profile.query";
import { HttpException } from "@nestjs/common";




@QueryHandler(GetAvailableLessonsQuery)
export class GetAvailableLessonsHandler implements IQueryHandler<GetAvailableLessonsQuery> {
    constructor(
        @InjectRepository(Lesson) private readonly lesson: Repository<Lesson>,
        private queryBus: QueryBus,
    ) {}

    async execute(query: GetAvailableLessonsQuery): Promise<Lesson> {
        const student = await this.queryBus.execute(new GetStudentProfileQuery(query.userId));

        if (!student) {
            throw new HttpException('not found student profile', 404);
        }

        const lesson = await this.lesson.findOne({ })
        return { ...lesson}
    }
}