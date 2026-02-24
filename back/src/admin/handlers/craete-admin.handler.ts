import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateAdminCommand } from "../commands/create-admin.command";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Admin } from "../entities/admin.entity";


@CommandHandler(CreateAdminCommand)
export class CreateAdminHandler implements ICommandHandler<CreateAdminCommand> {
    constructor(@InjectRepository(Admin) private readonly admin: Repository<Admin>) {}

    async execute(command: CreateAdminCommand): Promise<any> {
        const admin = this.admin.create()
        return this.admin.save(admin);
    }
}