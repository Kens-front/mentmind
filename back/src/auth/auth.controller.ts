import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AnyUserDto } from './dto/register-user.dto';
import { ILoginData } from './types';
import express from 'express'
import { TOKEN_DATA } from './constants';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() createAuthDto: CreateUserDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('/login')
  async login(@Body() loginData: ILoginData, @Res({ passthrough: true }) res: express.Response) {
    const userData = await this.authService.login(loginData)
    res.cookie('token', userData.token, TOKEN_DATA)
    return userData;
  }

  @Get('/validate')
  async validateToken(@Req() request: express.Request) {
    return this.authService.validate(request.cookies['token'])
  }

  @Post('/logout')
  async logoutUser(@Res() res: express.Response) {
    res.clearCookie('token', TOKEN_DATA);
    const data = await this.authService.logout();
    res.json(data)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id') 
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
