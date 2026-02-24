import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In,  Not } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { UpdateLessonCommand } from '../commands/update-lesson.command';
import { Lesson, LESSON_STATUS, LESSON_TYPES } from '../entities/lesson.entity';
import { LessonSlots } from 'src/lesson-slots/entities/lesson-slot.entity';
import { LessonSlotStatus } from 'src/lesson-slots/types';
import { LessonPackage } from 'src/lesson-package/entities/lesson-package.entity';
import { RoleList } from 'src/user/types';
// Only status/info updates live here; schedule updates happen via create/set handlers
@CommandHandler(UpdateLessonCommand)
export class UpdateLessonHandler
  implements ICommandHandler<UpdateLessonCommand>
{
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,

    @InjectRepository(LessonPackage)
    private readonly lessonPackage: Repository<LessonPackage>,
  ) {}

  async execute(command: UpdateLessonCommand): Promise<Lesson> {
    return this.lessonRepository.manager.transaction(
      async (manager) => {
        const lesson = await manager.findOne(Lesson, {
          where: { id: command.lessonid },
          relations: {participants: {lessonPackage: true}}
        });

        if (!lesson) {
          throw new HttpException(
            'No planned lesson found',
            404,
          );
        }

        // обновляем поля
        Object.assign(lesson, command.updateLessonDto);

        const slot = await manager.findOne(LessonSlots, {
          where: { lesson: { id: lesson.id } },
        });

        if (!slot) {
          throw new HttpException(
            'Lesson credit not found',
            404,
          );
        }
 
        await manager.save(Lesson, lesson);
        await manager.save(LessonSlots, slot);
        return lesson
      },
    );
  }
}