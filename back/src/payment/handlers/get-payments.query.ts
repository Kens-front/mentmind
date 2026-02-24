import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetPaymentsQuery } from "../queries/get-payments.query";
import { InjectRepository } from "@nestjs/typeorm";
import { Payment } from "../entities/payment.entity";
import {Or, Between, LessThanOrEqual, MoreThanOrEqual, Repository, And} from "typeorm";
import { HttpException } from "@nestjs/common";
import { RoleList } from "src/user/types";




@QueryHandler(GetPaymentsQuery) 
export class GetPaymentsHandler implements IQueryHandler<GetPaymentsQuery> {
    constructor(@InjectRepository(Payment) private readonly payment: Repository<Payment>) {}

    async execute(query: GetPaymentsQuery): Promise<[Payment [], number]> {
        const user = query.user;
        const filter = query.filter;

        if (!user) {
            throw new HttpException('Нет доступа', 403)
        }
        
        if (user.role === RoleList.ADMIN) {
            console.log('filter', filter);
            return this.payment.findAndCount({
                relations: ['user'],
                where: {
                    createdAt: And(MoreThanOrEqual(new Date(filter.start_date || '')), LessThanOrEqual(new Date(filter.end_date || ''))),
                },
                take: Number(filter.take) ?? 10,
                skip: Number(filter.skip) ?? 0
            })
        }

        if (user.role === RoleList.STUDENT) {
            return this.payment.findAndCount({
                where: {
                    user: {
                        id: user.id
                    },
                    createdAt: And(MoreThanOrEqual(new Date(filter.start_date || '')), LessThanOrEqual(new Date(filter.end_date || ''))),
                }, 
                relations: {
                    lessonPackage: true
                } 
            });
        }
    }
}