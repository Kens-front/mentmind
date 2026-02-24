import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpStatus, HttpException } from '@nestjs/common';
import { AchieveService } from './achieve.service';
import { CreateAchieveDto } from './dto/create-achieve.dto';
import { UpdateAchieveDto } from './dto/update-achieve.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAchieveCommand } from './commands/create-achieve.command';
import { UpdateAchieveCommand } from './commands/update-achieve.command';
import { GetAchieveQuery } from './queries/get-achieves.query';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('achieve')
export class AchieveController {
  constructor(
    private readonly achieveService: AchieveService,
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
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
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('Only image files are allowed!'), false)
      }
      
      callback(null, true);
    },

    limits: {
      fieldSize: 5 * 1024 * 1024
    }
  }))
  async create(@UploadedFile() file: Express.Multer.File, @Body() createAchieveDto: CreateAchieveDto) {
    if (!file) {
      throw new HttpException('Файл не загружен', HttpStatus.BAD_REQUEST);
    }
    await this.commandBus.execute(new CreateAchieveCommand(createAchieveDto))

    return  {
      title: createAchieveDto.title,
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
    };
  }

  @Get()
  findAll() {
    return this.queryBus.execute(new GetAchieveQuery())
  }

  @Get('/lesson-complete')
  lessonComplete() {
    return this.achieveService.lessonComplete();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.achieveService.findOne(+id);
  }

  @Patch()
  update(@Body() updateAchieveDto: UpdateAchieveDto) {
    return this.commandBus.execute(new UpdateAchieveCommand(updateAchieveDto))
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.achieveService.remove(+id);
  }
}
