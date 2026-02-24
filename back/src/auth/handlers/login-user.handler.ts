import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { LoginUserCommand } from "../commands/login-user.command";
import { ILoginResponse } from "../types";
import { USER_PARAMS } from "../constants";
import { HttpException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

import { JwtPort } from "src/jwt/jwt.service";
import { GetUserBy } from "src/user/queries/get-user-by.query";


@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
    constructor(
        private queryBus: QueryBus,
        private jwt: JwtPort
    ) { }

    async execute(command: LoginUserCommand): Promise<ILoginResponse> {
        const candidate = await this.queryBus.execute(new GetUserBy(USER_PARAMS.LOGIN, command.user.login))


        if (!candidate) {
            throw new HttpException('Такого пользователя не существует', 404);
        }

        const isComparePassword = await bcrypt.compare(command.user.password, candidate.password)

        if (!isComparePassword) {
            throw new HttpException('Некорректный логин или пароль', 404);
        }

        const tokenData = {
            id: candidate.id,
            role: candidate.role,
            first_name: candidate.first_name,
            last_name: candidate.last_name,
            email: candidate.email,
            avatar: candidate.avatar
        }

        const token = this.jwt.generateToken(tokenData)
        return {
            user: tokenData,
            token
        }
    }
} 