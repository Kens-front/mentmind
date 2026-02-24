import { PartialType } from '@nestjs/mapped-types';
import { CreateLessonPackageDto } from './create-lesson-package.dto';

export class UpdateLessonPackageDto extends PartialType(CreateLessonPackageDto) {}
