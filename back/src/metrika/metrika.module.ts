import { Module } from '@nestjs/common';
import { MetrikaService } from './metrika.service';
import { MetrikaController } from './metrika.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Metrika } from './entities/metrika.entity';
import { CreateMetrikDataHandler } from './handlers/create-metrik-data.handler';


const handlers = [
  CreateMetrikDataHandler
]
@Module({
  imports: [TypeOrmModule.forFeature([Metrika])],
  controllers: [MetrikaController],
  providers: [MetrikaService, ...handlers],
})
export class MetrikaModule {}
