import { UpdateUserDto } from "../dto/update-user.dto";

export class UpdateUserCommand {
    constructor(
        public readonly userId: number, 
        public readonly updateData: UpdateUserDto
    ) {}
}