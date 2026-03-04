import { Module } from '@nestjs/common';
import { PsychologySessionService } from './psychology-session.service';
import { PsychologySessionController } from './psychology-session.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PsychologySession} from "./entities/psychology-session.entity";
import {CreatePsychologySessionHandler} from "./handlers/create-psychology-session.handler";
import {PsychologyPack} from "../psychology-pack/entities/psychology-pack.entity";
import {GetPsychologyPacksQueryHandler} from "../psychology-pack/handlers/get-psychology-packs.handler";
import {GetPsychologySessionsQueryHandler} from "./handlers/get-psychology-sessions.handler";
import {UpdatePsychologySessionHandler} from "./handlers/update-psychology-session.handler";

const handlers = [
    CreatePsychologySessionHandler,
    GetPsychologySessionsQueryHandler,
    UpdatePsychologySessionHandler,
]
@Module({
  imports: [TypeOrmModule.forFeature([PsychologySession, PsychologyPack])],
  controllers: [PsychologySessionController],
  providers: [PsychologySessionService, ...handlers],
})
export class PsychologySessionModule {}
