import { Injectable } from '@nestjs/common';
import { CreateAchieveDto } from './dto/create-achieve.dto';
import { UpdateAchieveDto } from './dto/update-achieve.dto';
import {EventBus} from "@nestjs/cqrs";
import {LessonCompleteEvent} from "../lesson/events/lesson-completed.event";

@Injectable()
export class AchieveService {
  constructor(private eventBus: EventBus) {
  }
  lessonComplete() {
    this.eventBus.publish(new LessonCompleteEvent([8, 9]))
    return 'This action adds a new achieve';
  }

  findAll() {
    return `This action returns all achieve`;
  }

  findOne(id: number) {
    return `This action returns a #${id} achieve`;
  }

  update(id: number, updateAchieveDto: UpdateAchieveDto) {
    return `This action updates a #${id} achieve`;
  }

  remove(id: number) {
    return `This action removes a #${id} achieve`;
  }
}
