import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {CalculatePaymentQuery} from "../queries/calculate-payment.query";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../../user/entities/user.entity";
import {Repository} from "typeorm";
import {NotFoundException} from "@nestjs/common";
import {ELessonPrices} from "../../lesson/types";
import {LESSON_TYPES} from "../../lesson/entities/lesson.entity";


@QueryHandler(CalculatePaymentQuery)
export class CalculatePaymentQueryHandler implements IQueryHandler<CalculatePaymentQuery> {
    constructor(@InjectRepository(User) private user: Repository<User>) {
    }
    
    async execute(query: CalculatePaymentQuery) {
        const {duration, user, lessonCount, lessonType} = query.paymentData

        const mentor = await this.user.findOne({
            where: {
                mentor_profile: {
                    students: {
                        userId: user.id
                    }
                },
            },
            relations: {
                mentor_profile: true
            }
        })
        
        if (!mentor || !lessonCount || !duration) {
            throw new NotFoundException("Недостаточно данных");
        }
        
        let priceMentor = mentor.mentor_profile.level === 'base' ? ELessonPrices.BASE : ELessonPrices.PREMIUM;
        let amount = 18;
 
        return {
            amount: lessonType === LESSON_TYPES.GROUP ? amount : (duration / 60) * lessonCount * priceMentor,
            description: `
                <h4>Цена складывается из:</h4>
                <p>Ставка ментора: ${priceMentor}</p>
                <p>Кол-во занятий: ${lessonCount}</p>
                <p>Длительность занятий: ${duration}</p>
            `
        };
    }
}