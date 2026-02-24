import { User } from "src/user/entities/user.entity";



export class GetPaymentsQuery {
    constructor(public user: User, public filter: {start_date: string, end_date: string, userId: number, skip: number, take: number}) {}
}