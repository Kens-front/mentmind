import { PartialType } from '@nestjs/mapped-types';
import { CreateMetrikaDto } from './create-metrika.dto';

export class UpdateMetrikaDto extends PartialType(CreateMetrikaDto) {}
