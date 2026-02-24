import { User } from "src/user/entities/user.entity";


 

export class GetMentorPayoutsQuery {
    constructor(public user: User, public filter: {start_date: string, end_date: string, userId: number}) {}
}