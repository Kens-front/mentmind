import {Controller, Get, Post, Body, Patch, Param, Delete, HttpException, Query, UseGuards} from '@nestjs/common';
import { LearnDirectionService } from './learn_direction.service';
import { CreateLearnDirectionDto } from './dto/create-learn_direction.dto';
import { UpdateLearnDirectionDto } from './dto/update-learn_direction.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateLearnDirection } from './commands/create-learn-direction.command';
import { GetLearnDirectionQuery } from './queries/get-learn-directions.query';
import { In } from 'typeorm';
import { DeleteLearnDirectionCommand } from './commands/delete-learn-direction.command';
import { UpdateLearnDirectionCommand } from './commands/update-learn-direction.command';
import {AuthGuard} from "../common/decorators/auth-guard";
import {Roles} from "../common/decorators/roles.decorator";

@Controller('learn-direction')
@UseGuards(AuthGuard)
export class LearnDirectionController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @Post()
  @Roles('admin')
  create(@Body() learnDirection: CreateLearnDirectionDto) {
    try {
      return this.commandBus.execute(new CreateLearnDirection(learnDirection))
    } catch {
      throw new HttpException('qwe', 420);
    }
  }

  @Get()
  @Roles('admin', 'student', 'mentor')
  getAll(@Query() filterParams: {id: number | number []}) {
    return this.queryBus.execute(new GetLearnDirectionQuery({}))
  }

  @Delete(':id')
  @Roles('admin')
  deleteOne(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteLearnDirectionCommand(+id));
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() learnDirection: UpdateLearnDirectionDto) {
    return this.commandBus.execute(new UpdateLearnDirectionCommand(+id, learnDirection))
  }

  // @Post()
  // create(@Body() createLearnDirectionDto: CreateLearnDirectionDto) {
  //   return this.learnDirectionService.create(createLearnDirectionDto);
  // }

  // @Get()
  // findAll() {
  //   return this.learnDirectionService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.learnDirectionService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLearnDirectionDto: UpdateLearnDirectionDto) {
  //   return this.learnDirectionService.update(+id, updateLearnDirectionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.learnDirectionService.remove(+id);
  // }
}
