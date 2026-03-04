import { Injectable } from '@nestjs/common';
import { CreatePsychologyPackDto } from './dto/create-psychology-pack.dto';
import { UpdatePsychologyPackDto } from './dto/update-psychology-pack.dto';

@Injectable()
export class PsychologyPackService {
  create(createPsychologyPackDto: CreatePsychologyPackDto) {
    return 'This action adds a new psychologyPack';
  }

  findAll() {
    return `This action returns all psychologyPack`;
  }

  findOne(id: number) {
    return `This action returns a #${id} psychologyPack`;
  }

  update(id: number, updatePsychologyPackDto: UpdatePsychologyPackDto) {
    return `This action updates a #${id} psychologyPack`;
  }

  remove(id: number) {
    return `This action removes a #${id} psychologyPack`;
  }
}
