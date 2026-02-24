import { Injectable } from '@nestjs/common';
import { CreateMentorPayoutDto } from './dto/create-mentor-payout.dto';
import { UpdateMentorPayoutDto } from './dto/update-mentor-payout.dto';

@Injectable()
export class MentorPayoutService {
  create(createMentorPayoutDto: CreateMentorPayoutDto) {
    return 'This action adds a new mentorPayout';
  }

  findAll() {
    return `This action returns all mentorPayout`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mentorPayout`;
  }

  update(id: number, updateMentorPayoutDto: UpdateMentorPayoutDto) {
    return `This action updates a #${id} mentorPayout`;
  }

  remove(id: number) {
    return `This action removes a #${id} mentorPayout`;
  }
}
