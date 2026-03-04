import { Module } from '@nestjs/common';
import { YoukassaService } from './youkassa.service';
import { YoukassaController } from './youkassa.controller';

@Module({
  controllers: [YoukassaController],
  providers: [YoukassaService],
})
export class YoukassaModule {}
