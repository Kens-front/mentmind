 
import { CreateUserDto } from "src/user/dto/create-user.dto";
 
 
 

export class RegisterUserCommand {
    constructor(public user: CreateUserDto) {}
}