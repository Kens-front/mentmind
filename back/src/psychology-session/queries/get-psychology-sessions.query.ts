import {PsychologySessionService} from "../psychology-session.service";
import {User} from "../../user/entities/user.entity";


export class GetPsychologySessionsQuery {
    constructor(public readonly user: User) {}
}