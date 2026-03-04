import { Module } from '@nestjs/common';
import { PsychologyPackService } from './psychology-pack.service';
import { PsychologyPackController } from './psychology-pack.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PsychologyPack} from "./entities/psychology-pack.entity";
import {GetPsychologyPacksQueryHandler} from "./handlers/get-psychology-packs.handler";
import {CreatePsychologyPackEvent} from "./handlers/create-psychology-pack.event";


const handlers = [
    GetPsychologyPacksQueryHandler,
    CreatePsychologyPackEvent
]
@Module({
  imports: [TypeOrmModule.forFeature([PsychologyPack])],
  controllers: [PsychologyPackController],
  providers: [PsychologyPackService, ...handlers],
})
export class PsychologyPackModule {}
