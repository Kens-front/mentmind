import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetLessonPackageQuery } from "../queries/get-lesson-package.query";
import { InjectRepository } from "@nestjs/typeorm";
import { LessonPackage } from "../entities/lesson-package.entity";
import { In, Repository } from "typeorm";





@QueryHandler(GetLessonPackageQuery)
export class GetLessonPackageHandler implements IQueryHandler<GetLessonPackageQuery> {
    constructor(@InjectRepository(LessonPackage) private lessonPackage: Repository<LessonPackage>) {}

    async execute(query: GetLessonPackageQuery): Promise<any> {
        if (!query.userId.length) {
            return this.lessonPackage.find()
        }
        return this.lessonPackage.findOne({where: {userId: In(query.userId), status: 'active'}})
    }
}