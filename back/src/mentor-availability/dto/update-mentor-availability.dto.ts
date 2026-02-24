import { PartialType } from '@nestjs/mapped-types';
import { CreateMentorAvailabilityDto } from './create-mentor-availability.dto';

export class UpdateMentorAvailabilityDto extends PartialType(CreateMentorAvailabilityDto) {}
