import { User } from "src/user/entities/user.entity";

export class GetHomeWorksQuery {
    constructor(public user: User) {}
}