import {User} from "../../user/entities/user.entity";


export class GetPlanQuery {
    constructor(public readonly userId: number) {}
}