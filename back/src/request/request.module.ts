import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from './entities/request.entity';
import { GetRequestHandler } from './handlers/get-requests.handler';
import { CreateRequestHandler } from './handlers/create-request.handler';


const handlers = [
  GetRequestHandler,
  CreateRequestHandler,
];

@Module({
  imports: [TypeOrmModule.forFeature([Request])],
  controllers: [RequestController],
  providers: [RequestService, ...handlers],
})
export class RequestModule {}
