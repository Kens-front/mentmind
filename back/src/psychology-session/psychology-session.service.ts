import { Injectable } from '@nestjs/common';
import { CreatePsychologySessionDto } from './dto/create-psychology-session.dto';
import { UpdatePsychologySessionDto } from './dto/update-psychology-session.dto';

@Injectable()
export class PsychologySessionService {
  create(createPsychologySessionDto: CreatePsychologySessionDto) {
    return 'This action adds a new psychologySession';
  }

  findAll() {
    return `This action returns all psychologySession`;
  }

  findOne(id: number) {
    return `This action returns a #${id} psychologySession`;
  }

  update(id: number, updatePsychologySessionDto: UpdatePsychologySessionDto) {
    return `This action updates a #${id} psychologySession`;
  }

  remove(id: number) {
    return `This action removes a #${id} psychologySession`;
  }
}
