import { ILoginData } from "../types";

export class LoginUserCommand {
    constructor(public user: ILoginData) {}
}