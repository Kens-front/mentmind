import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, Query, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { UpdateUserCommand } from './commands/update-user.command';
import { GetUserBy } from './queries/get-user-by.query';
import { USER_PARAMS } from 'src/auth/constants';
import { GetStudentProfilesByMentorIdQuery } from './queries/get-student-profiles-by-mentro-id.query';
import { LessonCompleteEvent } from 'src/lesson/events/lesson-completed.event';
import { RoleList } from './types';
import { GetUsersQuery } from './queries/get-users.query';
import { GetUsersQueryParamsDto } from './dto/get-users.dto';
import { CurrentUser } from 'src/common/decorators/current-user';
import { User } from './entities/user.entity';

import { AuthGuard } from 'src/common/decorators/auth-guard';
import { GetUserFullQuery } from './queries/get-user-full.query';
import { UpdateUserFullCommand } from './commands/update-user-full.command';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateAvatarCommand } from './commands/update-avatar.command';


@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
  ) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    try {
      return this.userService.create(createUserDto);
    } catch (e) {
      new HttpException(e, 400);
    }
  }

  @Get('/ws')
  ws() {
    this.eventBus.publish(new LessonCompleteEvent([3]))
    return 123
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @Query() params: GetUsersQueryParamsDto,
    @CurrentUser() user: User
  ) {
    // Теперь автоматически загружает связанные профили благодаря eager: true
    return this.queryBus.execute(new GetUsersQuery({ id: user.id, role: user.role }, params,))
  }

  @Get('/full/:id')
  getOneFull(@Param('id') id: string) {
    return this.queryBus.execute(new GetUserFullQuery(+id))
  }


  @Get('/profile')
  @UseGuards(AuthGuard)
  getProfile(@Req() req) {
    return this.queryBus.execute(new GetUserFullQuery(req.user.id))
  }

  @Get('/by-mentor/:id')
  findAllByMentorId(@Param('id') id: string) {
    return this.queryBus.execute(new GetStudentProfilesByMentorIdQuery(+id))
  }

  @Get('with-relations')
  findAllWithRelations() {
    // Альтернативный метод с явным указанием отношений
    return this.userService.findAllWithRelations();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // Теперь автоматически загружает связанные профили благодаря eager: true
    return this.queryBus.execute(new GetUserBy(USER_PARAMS.ID, id))
  }

  @Get(':id/with-relations')
  findOneWithRelations(@Param('id') id: string) {
    // Альтернативный метод с явным указанием отношений
    return this.userService.findOneWithRelations(parseInt(id));
  }

  @Patch("full/:id")
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname)
        const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
        callback(null, filename)
      }
    }),
    fileFilter: (req, file, callback) => {
      try {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          callback(new Error('Only image files are allowed!'), false)
        }
      }
      catch {
        throw new HttpException('Only image files are allowed!', 409)
      }

      callback(null, true);
    },

    limits: {
      fileSize: 15 * 1024 * 1024 // 15 МБ в байтах
    }
  }))
  async updateFull(
    @Param("id") id: number,
    @Body() dto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {

    let payload: Record<'user' | 'profile', Record<string, string>> = { user: {}, profile: {} };

    if (typeof dto.user === 'string' && typeof dto.profile === 'string') {
      const user = JSON.parse(dto.user)
      const profile = JSON.parse(dto.profile)
      user.avatar = file?.path;

      payload.user = user
      payload.profile = profile
    } else {
      payload = dto
    }


    return this.commandBus.execute(
      new UpdateUserFullCommand(id, payload)
    );
  }


  // @Patch('/profile/avatar')
  // @UseGuards(AuthGuard)
  // @UseInterceptors(FileInterceptor('avatar', {
  //   storage: diskStorage({
  //     destination: './uploads',
  //     filename: (req, file, callback) => {
  //       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  //       const ext = extname(file.originalname)
  //       const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
  //       callback(null, filename)
  //     }
  //   }),
  //   fileFilter: (req, file, callback) => {
  //     if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
  //       return callback(new Error('Only image files are allowed!'), false)
  //     }

  //     callback(null, true);
  //   },

  //   limits: {
  //     fileSize: 15 * 1024 * 1024 // 15 МБ в байтах
  //   }
  // }))
  // updateProfileAvatar(@Req() req, @UploadedFile() file: Express.Multer.File,) {
  //   const user = req.user
  //   const userId = user ? Number(user.id) : 0


  //   if (!file) {
  //     return this.commandBus.execute(new UpdateAvatarCommand(userId, ''))
  //   }
  //   return this.commandBus.execute(new UpdateAvatarCommand(userId, file?.path))
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
