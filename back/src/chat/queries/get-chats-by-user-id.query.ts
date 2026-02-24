import { User } from "src/user/entities/user.entity";


export class GetChatsByUserId {
    constructor(public user: User | null) {}
}