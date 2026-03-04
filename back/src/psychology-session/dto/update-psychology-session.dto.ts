import { PartialType } from '@nestjs/mapped-types';
import { CreatePsychologySessionDto } from './create-psychology-session.dto';

export class UpdatePsychologySessionDto extends PartialType(CreatePsychologySessionDto) {
    id: number;
}
