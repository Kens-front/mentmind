import { Injectable } from '@nestjs/common';
import { CreateLearnDirectionDto } from './dto/create-learn_direction.dto';
import { UpdateLearnDirectionDto } from './dto/update-learn_direction.dto';

@Injectable()
export class LearnDirectionService {
  create(createLearnDirectionDto: CreateLearnDirectionDto) {
    return 'This action adds a new learnDirection';
  }

  findAll() {
    return `This action returns all learnDirection`;
  }

  findOne(id: number) {
    return `This action returns a #${id} learnDirection`;
  }

  update(id: number, updateLearnDirectionDto: UpdateLearnDirectionDto) {
    return `This action updates a #${id} learnDirection`;
  }

  remove(id: number) {
    return `This action removes a #${id} learnDirection`;
  }
}
