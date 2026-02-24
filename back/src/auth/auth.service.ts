import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AnyUserDto } from './dto/register-user.dto';
import { ILoginData } from './types';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { RegisterUserCommand } from './commands/register-user.command';
import { LoginUserCommand } from './commands/login-user.command';
import { LogoutUserCommand } from './commands/logout-user.command';
import { JwtPort } from 'src/jwt/jwt.service';
import { ValidateUserQuery } from './query/validate-user.query';
@Injectable()
export class AuthService {
  constructor( 
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private jwtSerice: JwtPort
  ) {}

  register(anyUserDto: CreateUserDto) {
    return this.commandBus.execute(new RegisterUserCommand(anyUserDto))
  }

  login(loginData: ILoginData) {
    return this.commandBus.execute(new LoginUserCommand(loginData))
  }

  validate(token: string) {
    return this.queryBus.execute(new ValidateUserQuery(token))
  }

  logout() {
    return this.commandBus.execute(new LogoutUserCommand())
  }
  
  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
