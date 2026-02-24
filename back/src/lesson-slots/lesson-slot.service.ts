import { Injectable } from '@nestjs/common';
import { CreateLessonSlotDto } from './dto/create-lesson-slot.dto';
import { UpdateLessonSlotDto } from './dto/update-lesson-slot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LessonSlots } from './entities/lesson-slot.entity';
import { Repository } from 'typeorm';
import { LessonSlotStatus } from './types';

@Injectable()
export class LessonCreditsService {
  constructor(@InjectRepository(LessonSlots) private lessonSlot: Repository<LessonSlots>) {}

  async findAvailableOne() {
    return this.lessonSlot.findOne({where: {status: LessonSlotStatus.AVAILABLE}})
  }

  create(createLessonCreditDto: CreateLessonSlotDto) {
 
  }

  findAll() {
    return `This action returns all lessonCredits`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lessonCredit`;
  }

  update(id: number, updateLessonCreditDto: UpdateLessonSlotDto) {
    return `This action updates a #${id} lessonCredit`;
  }

  remove(id: number) {
    return `This action removes a #${id} lessonCredit`;
  }
}
