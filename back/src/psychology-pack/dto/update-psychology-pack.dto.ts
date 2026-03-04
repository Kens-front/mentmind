import { PartialType } from '@nestjs/mapped-types';
import { CreatePsychologyPackDto } from './create-psychology-pack.dto';

export class UpdatePsychologyPackDto extends PartialType(CreatePsychologyPackDto) {}
