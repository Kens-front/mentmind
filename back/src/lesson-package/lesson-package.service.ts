import { Injectable } from '@nestjs/common';
import { CreateLessonPackageDto } from './dto/create-lesson-package.dto';
import { UpdateLessonPackageDto } from './dto/update-lesson-package.dto';

@Injectable()
export class LessonPackageService {
  create(createLessonPackageDto: CreateLessonPackageDto) {
    return 'This action adds a new lessonPackage';
  }

  findAll() {
    return `This action returns all lessonPackage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lessonPackage`;
  }

  update(id: number, updateLessonPackageDto: UpdateLessonPackageDto) {
    return `This action updates a #${id} lessonPackage`;
  }

  remove(id: number) {
    return `This action removes a #${id} lessonPackage`;
  }
}
