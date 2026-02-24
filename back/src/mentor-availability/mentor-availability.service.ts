import { Injectable } from '@nestjs/common';
import { CreateMentorAvailabilityDto } from './dto/create-mentor-availability.dto';
import { UpdateMentorAvailabilityDto } from './dto/update-mentor-availability.dto';

@Injectable()
export class MentorAvailabilityService {
  create(createMentorAvailabilityDto: CreateMentorAvailabilityDto) {
    return 'This action adds a new mentorAvailability';
  }

  findAll() {
    return `This action returns all mentorAvailability`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mentorAvailability`;
  }

  update(id: number, updateMentorAvailabilityDto: UpdateMentorAvailabilityDto) {
    return `This action updates a #${id} mentorAvailability`;
  }

  remove(id: number) {
    return `This action removes a #${id} mentorAvailability`;
  }
}
