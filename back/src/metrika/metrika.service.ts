import { Injectable } from '@nestjs/common';
import { CreateMetrikaDto } from './dto/create-metrika.dto';
import { UpdateMetrikaDto } from './dto/update-metrika.dto';

@Injectable()
export class MetrikaService {
  create(createMetrikaDto: CreateMetrikaDto) {
    return 'This action adds a new metrika';
  }

  findAll() {
    return `This action returns all metrika`;
  }

  findOne(id: number) {
    return `This action returns a #${id} metrika`;
  }

  update(id: number, updateMetrikaDto: UpdateMetrikaDto) {
    return `This action updates a #${id} metrika`;
  }

  remove(id: number) {
    return `This action removes a #${id} metrika`;
  }
}
