import { Module } from '@nestjs/common';
import { NodemailerService } from './nodemailer.service';
import { NodemailerController } from './nodemailer.controller';
import {SentRequestEventHandler} from "./handlers/sent-request.handler";


const handlers = [
    SentRequestEventHandler,
]
@Module({
  controllers: [NodemailerController],
  providers: [NodemailerService, ...handlers],
})
export class NodemailerModule {}
