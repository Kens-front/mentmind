import { CommandHandler, EventBus, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Lesson, LESSON_STATUS, LESSON_TYPES } from "../entities/lesson.entity";
import { Equal, In, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { StudentProfile } from "src/student_profile/entities/student_profile.entity";
import { ConflictException, BadRequestException, NotFoundException } from "@nestjs/common";
import { GetMentorProfileQuery } from "src/mentor_profile/queries/get-mentor-profile.query";
import { LESSON_DURATION } from "src/payment/types";
import { MentorAvailability } from "src/mentor-availability/entities/mentor-availability.entity";
import { addMinutesToTime, formatDateToISO } from "src/common";
import { CreateTrialLessonCommand } from "../commands/create-trial-lesson.command";
import { LessonCompleteEvent } from "../events/lesson-completed.event";

@CommandHandler(CreateTrialLessonCommand)
export class CreateTrialLessonHandler implements ICommandHandler<CreateTrialLessonCommand> {
    constructor(
        @InjectRepository(Lesson) private readonly lessons: Repository<Lesson>,
        @InjectRepository(StudentProfile)
        private readonly studentProfileRepository: Repository<StudentProfile>,
        private readonly queryBus: QueryBus,
        private readonly eventBus: EventBus,
        @InjectRepository(MentorAvailability) private readonly availabilityRepo: Repository<MentorAvailability>,
    ) {}

    async execute(command: CreateTrialLessonCommand): Promise<any> {
      const { date, start_time, studentIds, mentorId } = command.createLessonDto;
      if (!date || !start_time) {
        throw new BadRequestException('date and start_time are required');
      }

      const lesson = this.lessons.create(command.createLessonDto);
      lesson.duration = LESSON_DURATION.MIN;
      lesson.lessonType = LESSON_TYPES.TRIAL;
      lesson.status = LESSON_STATUS.PLANNED;

      const mentor = await this.queryBus.execute(new GetMentorProfileQuery(mentorId));
      const students = await this.studentProfileRepository.find({ where: { userId: In(studentIds) } });

      if (students.length !== studentIds.length) {
        throw new NotFoundException('One or more students not found');
      }

      const end_time = addMinutesToTime(start_time, lesson.duration);
      const startDateTime = formatDateToISO(date, start_time);
      const endDateTime = formatDateToISO(date, end_time);

      const overlappingLessons = await this.lessons
        .createQueryBuilder('lesson')
        .leftJoin('lesson.students', 'student')
        .where('(lesson.mentorId = :mentorId OR student.id IN (:...studentIds))', {
          mentorId: mentor.id,
          studentIds: students.map((student) => student.id),
        })
        .andWhere('lesson.date = :date', { date })
        .andWhere(':start < lesson.end_time AND :end > lesson.start_time', { start: start_time, end: end_time })
        .getMany();

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
      if (!fitsAvailability) {
        throw new ConflictException('Lesson is outside mentor availability');
      }

      const createdLesson = await this.lessons.manager.transaction(async (transactionalEntityManager) => {
        const foundSlot = await this.availabilityRepo.findOne({
          where: {
            mentorProfileId: mentor.id,
            start: LessThanOrEqual(lesson.start_time),
            end: MoreThanOrEqual(end_time),
            date: Equal(date),
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

        lesson.date = date;
        lesson.start_time = start_time;
        lesson.end_time = end_time;
        // lesson.students = students;
        // lesson.mentor = mentor;
        lesson.notes = command.createLessonDto.notes;

        return transactionalEntityManager.save(Lesson, lesson);
      });

      this.eventBus.publish(new LessonCompleteEvent([mentor.userId, ...studentIds]));
      return createdLesson;
    }
}
