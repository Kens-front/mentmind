import { PartialType } from '@nestjs/mapped-types';
import { CreateMentorPayoutDto } from './create-mentor-payout.dto';
import { LESSON_PAYOUTS } from 'src/lesson/entities/lesson.entity';
import { IsOptional } from 'class-validator';

export class UpdateMentorPayoutDto extends PartialType(CreateMentorPayoutDto) {
    id: number
    
    @IsOptional( )
    status?: LESSON_PAYOUTS
}
