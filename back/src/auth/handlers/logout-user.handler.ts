import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LogoutUserCommand } from "../commands/logout-user.command";



@CommandHandler(LogoutUserCommand) 
export class LogoutUserHandler implements ICommandHandler<LogoutUserCommand> {
    constructor() {}

    async execute(command: LogoutUserCommand): Promise<any> {
        return {
            isOk: true,
        }
    }
}