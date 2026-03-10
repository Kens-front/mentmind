import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {CreatePlanCommand} from "./commands/create-plan.command";
import {GetPlanQuery} from "./queries/get-plan.query";
import {UpdatePlanCommand} from "./commands/update-plan.command";

@Controller('plan')
export class PlanController {
  constructor(
      private readonly planService: PlanService,
      private queryBus: QueryBus,
      private commandBus: CommandBus 
      
  ) {}

  @Post()
  create(@Body() createPlanDto: CreatePlanDto) {
    console.log('createPlanDto', Array.isArray(createPlanDto.items[0]));
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.queryBus.execute(new UpdatePlanCommand({...updatePlanDto, id: Number(id) }));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planService.remove(+id);
  }
}
