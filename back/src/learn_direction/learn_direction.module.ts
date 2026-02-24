import { Module } from '@nestjs/common';
import { LearnDirectionService } from './learn_direction.service';
import { LearnDirectionController } from './learn_direction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearnDirection } from './entities/learn_direction.entity';
import { CreateLearnDirectionHandler } from './handlers/create-learn-direction.handler';
import { GetLearnDirectionHandler } from './handlers/get-learn-directions.handler';
import { DeleteLearnDirectionHandler } from './handlers/delete-learn-direction.handler';
import { UpdateLearnDirectionHandler } from './handlers/update-learn-direction.handler';


const handlers = [
  CreateLearnDirectionHandler,
  GetLearnDirectionHandler,
  DeleteLearnDirectionHandler,
  UpdateLearnDirectionHandler,
];

@Module({
  imports: [TypeOrmModule.forFeature([LearnDirection])],
  controllers: [LearnDirectionController],
  providers: [LearnDirectionService, ...handlers],
})
export class LearnDirectionModule {}
