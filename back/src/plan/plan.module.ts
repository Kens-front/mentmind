import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Plan} from "./entities/plan.entity";
import {GetPlanQueryHandler} from "./handlers/get-plan.handler";
import {UpdatePlanCommandHandler} from "./handlers/update-plan.handler";
import {CreatePlanCommandHandler} from "./handlers/create-plan.handler";


const handlers = [
    GetPlanQueryHandler,
    UpdatePlanCommandHandler,
    CreatePlanCommandHandler,
]
@Module({
  imports: [TypeOrmModule.forFeature([Plan])],
  controllers: [PlanController],
  providers: [PlanService, ...handlers],
})
export class PlanModule {}
