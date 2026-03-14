import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {CreatePlanCommand} from "./commands/create-plan.command";
import {GetPlanQuery} from "./queries/get-plan.query";
import {UpdatePlanCommand} from "./commands/update-plan.command";
import {AuthGuard} from "../common/decorators/auth-guard";
import {CurrentUser} from "../common/decorators/current-user";
import {User} from "../user/entities/user.entity";

@Controller('plan')
export class PlanController {
  constructor(
      private readonly planService: PlanService,
      private queryBus: QueryBus,
      private commandBus: CommandBus 
      
  ) {}

  @Post()
  create(@Body() createPlanDto: CreatePlanDto) {

    return this.commandBus.execute(new CreatePlanCommand(createPlanDto));
  }

  @Get()
  findAll() {
    return this.planService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.queryBus.execute(new GetPlanQuery(Number(id)));
  }

  @Get('/user/me')
  @UseGuards(AuthGuard)
  findByMe(@CurrentUser()user: User) {
    console.log('findByMe', user);
    return this.queryBus.execute(new GetPlanQuery(Number(user?.id)));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.queryBus.execute(new UpdatePlanCommand({...updatePlanDto, id: Number(id) }));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planService.remove(+id);
  }
}
