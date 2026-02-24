import { Injectable } from '@nestjs/common';
import { CreateLessonParticipantDto } from './dto/create-lesson-participant.dto';
import { UpdateLessonParticipantDto } from './dto/update-lesson-participant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LessonParticipant } from './entities/lesson-participant.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class LessonParticipantService {
  constructor(@InjectRepository(LessonParticipant) private readonly lessonParticipant: Repository<LessonParticipant>) {}
  
  createMany(users: User []) {
    return users.map(user => this.lessonParticipant.create(user))
  }

  create(createLessonParticipantDto: CreateLessonParticipantDto) {
    return 'This action adds a new lessonParticipant';
  }

  findAll() {
    return `This action returns all lessonParticipant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lessonParticipant`;
  }

  update(id: number, updateLessonParticipantDto: UpdateLessonParticipantDto) {
    return `This action updates a #${id} lessonParticipant`;
  }

  remove(id: number) {
    return `This action removes a #${id} lessonParticipant`;
  }
}
