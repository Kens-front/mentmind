import { PartialType } from '@nestjs/mapped-types';
import { CreateYoukassaDto } from './create-youkassa.dto';

export class UpdateYoukassaDto extends PartialType(CreateYoukassaDto) {}
