import {Injectable} from "@nestjs/common";
import {AnalyticProvider} from "../types";
import {InjectRepository} from "@nestjs/typeorm";
import {Lesson} from "../../lesson/entities/lesson.entity";
import {Repository} from "typeorm";
import {User} from "../../user/entities/user.entity";


@Injectable()
export abstract class BaseAnalyticsProvider implements AnalyticProvider {
    constructor(@InjectRepository(Lesson) private lessonRepository: Repository<Lesson>) {
    }
    
    async getUpcomingLesson(where: any): Promise<any> {
        const today = new Date();
        const nextWeek = new Date(today);
        
        nextWeek.setDate(today.getDate() + 7)
        
        const subqb = this.lessonRepository
            .createQueryBuilder('up')
            .where('up.date BETWEEN :today AND :nextWeek', {today, nextWeek})
            .leftJoin('participants', 'participants')
            .andWhere('up.status = :status', { status: 'planned' })
        
        if (where.student?.id) {
            subqb.andWhere(':id IN participants', {id: where.student.id})
        }

        if (where.mentor?.id) {
            subqb.andWhere(':id IN participants', {id: where.mentor.id})
        }

        const upcomingCount = await subqb.getCount();


        return {
            count: upcomingCount,
        };
    }

    abstract getAnalytics(user: User): Promise<any>;
}