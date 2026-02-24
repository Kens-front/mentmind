import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LoginUserHandler } from './handlers/login-user.handler';
import { RegisterUserHandler } from './handlers/register-user.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtPort } from 'src/jwt/jwt.service';
import { ValidateUserHandler } from './handlers/validate-user.handler';
import { LogoutUserHandler } from './handlers/logout-user.handler';



const handlers = [
  LoginUserHandler,
  RegisterUserHandler,
  ValidateUserHandler,
  LogoutUserHandler
];

@Module({
  imports: [
    JwtModule.register({secret: 'secret-key', signOptions: {expiresIn: '7days'}}),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtPort, ...handlers],
})
export class AuthModule {}
