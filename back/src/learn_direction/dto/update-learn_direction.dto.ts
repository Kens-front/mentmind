import { PartialType } from '@nestjs/mapped-types';
import { CreateLearnDirectionDto } from './create-learn_direction.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateLearnDirectionDto extends PartialType(CreateLearnDirectionDto) {
}
