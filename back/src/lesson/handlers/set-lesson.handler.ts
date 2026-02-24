import { CommandHandler, EventBus, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { SetLessonCommand } from "../commands/set-lesson.command";
import { InjectRepository } from "@nestjs/typeorm";
import { Lesson, LESSON_STATUS, LESSON_TYPES } from "../entities/lesson.entity";
import { In, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { StudentProfile } from "src/student_profile/entities/student_profile.entity";
import { ConflictException, HttpException, BadRequestException, NotFoundException } from "@nestjs/common";
import { GetMentorProfileQuery } from "src/mentor_profile/queries/get-mentor-profile.query";
import { LESSON_DURATION } from "src/payment/types";
import { MentorAvailability } from "src/mentor-availability/entities/mentor-availability.entity";
import { addMinutesToTime, formatDateToISO } from "src/common";
import { LessonCompleteEvent } from "../events/lesson-completed.event";

@CommandHandler(SetLessonCommand)
export class SetLessonHandler implements ICommandHandler<SetLessonCommand> {
    constructor(
        @InjectRepository(Lesson) private readonly lessons: Repository<Lesson>,
        @InjectRepository(StudentProfile)
        private readonly studentProfileRepository: Repository<StudentProfile>,
        private readonly queryBus: QueryBus,
        private readonly eventBus: EventBus,
        @InjectRepository(MentorAvailability) private readonly availabilityRepo: Repository<MentorAvailability>,
    ){}

    async execute(command: SetLessonCommand): Promise<any> {
      const lesson = await this.findLesson(command);
      if (!lesson) {
          throw new HttpException('not found lesson', 404);
      }

      const mentor = await this.queryBus.execute(new GetMentorProfileQuery(command.setLEssonDto.mentorId));
      const students = await this.studentProfileRepository.find({where: {userId: In(command.setLEssonDto.studentIds)}});
      const date = command.setLEssonDto.date;
      const start = command.setLEssonDto.start_time;
      if (!date || !start) {
        throw new BadRequestException('date and start_time are required');
      }

      const end_time = addMinutesToTime(start, lesson.duration);
      const startDateTime = formatDateToISO(date, start);
      const endDateTime = formatDateToISO(date, end_time);

      let qb = this.lessons
        .createQueryBuilder('lesson')
        .leftJoin('lesson.students', 'student')
        .where('lesson.date = :date', { date })
        .andWhere(':start < lesson.end_time AND :end > lesson.start_time', { start, end: end_time });

      if (lesson.lessonType === LESSON_TYPES.TRIAL) {
        qb = qb.andWhere('(lesson.mentorId = :mentorId OR student.userId IN (:...studentIds))', {
          mentorId: command.setLEssonDto.mentorId,
          studentIds: command.setLEssonDto.studentIds,
        });
      } else {
        qb = qb.andWhere('student.userId IN (:...studentIds)', { studentIds: command.setLEssonDto.studentIds });
      }

      if (lesson.id) {
        qb = qb.andWhere('lesson.id != :lessonId', { lessonId: lesson.id });
      }

      const overlappingLessons = await qb.getMany();

      if (overlappingLessons.length > 0) {
        throw new ConflictException('Time slot is not available for mentor or students');
      }

      const availability = await this.availabilityRepo.find({
        where: { mentorProfileId: mentor.id, date },
      });
      const fitsAvailability = availability.some((slot) => {
        const slotStart = new Date(`${slot.date}T${slot.start}`);
        const slotEnd = new Date(`${slot.date}T${slot.end}`);
        return slotStart.getTime() <= startDateTime.getTime() && slotEnd.getTime() >= endDateTime.getTime();
      });
      if (!fitsAvailability && lesson.lessonType === LESSON_TYPES.TRIAL) {
        throw new ConflictException('Lesson is outside mentor availability');
      }

      const createdLesson = await this.lessons.manager.transaction(async (transactionalEntityManager) => {
        if (lesson.lessonType === LESSON_TYPES.TRIAL) {
          const foundSlot = await this.availabilityRepo.findOne({
            where: {
              mentorProfileId: mentor.id,
              start: LessThanOrEqual(lesson.start_time),
              end: MoreThanOrEqual(end_time),
              date,
            },
          });

          if (!foundSlot) {
            throw new NotFoundException('Availability slot not found for mentor');
          }

          const beforeSlot = this.availabilityRepo.create({
            mentorProfileId: mentor.id,
            date: foundSlot.date,
            start: foundSlot.start,
            end: lesson.start_time,
          });

          const afterSlot = this.availabilityRepo.create({
            mentorProfileId: mentor.id,
            date: foundSlot.date,
            start: end_time,
            end: foundSlot.end,
          });

          if (foundSlot.start !== lesson.start_time) {
            await transactionalEntityManager.save(MentorAvailability, beforeSlot);
          }
          if (foundSlot.end !== end_time) {
            await transactionalEntityManager.save(MentorAvailability, afterSlot);
          }

          await transactionalEntityManager.delete(MentorAvailability, { id: foundSlot.id });
        }

        // lesson.date = date;
        // lesson.start_time = start;
        // lesson.end_time = end_time;
        // lesson.students = students;
        // lesson.mentor = mentor
        // lesson.notes = command.setLEssonDto.notes;
        // lesson.status = LESSON_STATUS.PLANNED;

        return transactionalEntityManager.save(Lesson, lesson);
      });

      this.eventBus.publish(new LessonCompleteEvent([mentor.userId, ...command.setLEssonDto.studentIds]));

      return createdLesson;
    }

    private async findLesson(command: SetLessonCommand): Promise<Lesson> {
      let lesson;


      // if (command.setLEssonDto.lesson_type === LESSON_TYPES.TRIAL) {
      //   lesson = this.lessons.create(command.setLEssonDto);
      //   lesson.duration = LESSON_DURATION.MIN;
      //   lesson.lesson_type = LESSON_TYPES.TRIAL;
      //   lesson.status = LESSON_STATUS.PLANNED;
      // } else if (command.setLEssonDto.id) {
      //   lesson = await this.lessons.findOne({where: { id: command.setLEssonDto.id }});
      // } else {
      //   lesson = await this.lessons.findOne({where: {students: {userId: In(command.setLEssonDto.studentIds)}, status: LESSON_STATUS.AVAILABLE}});
      // }
      return lesson;
    }
}