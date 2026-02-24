import { AnyUserDto } from "src/auth/dto/register-user.dto";
import { CreateUserDto } from "../dto/create-user.dto";


export class CreateUserCommand {
    constructor(public user: CreateUserDto) {}
}