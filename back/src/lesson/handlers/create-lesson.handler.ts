import {CommandHandler, EventBus, ICommandHandler} from "@nestjs/cqrs";
import { CreateLessonCommand } from "../commands/create-lesson.command";
import { InjectRepository } from "@nestjs/typeorm";
import { Lesson, LESSON_STATUS, LESSON_TYPES } from "../entities/lesson.entity";
import { Equal, In, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { StudentProfile } from "src/student_profile/entities/student_profile.entity";
import { MentorProfile } from "src/mentor_profile/entities/mentor_profile.entity";
import { MentorAvailability } from "src/mentor-availability/entities/mentor-availability.entity";
import { BadRequestException, NotFoundException, ConflictException, HttpException } from "@nestjs/common";
import { addMinutesToTime, formatDateToISO } from "src/common";
import { LESSON_DURATION } from "src/payment/types";
import { User } from "src/user/entities/user.entity";
import { LessonSlots } from "src/lesson-slots/entities/lesson-slot.entity";
import { LessonSlotStatus } from "src/lesson-slots/types";
import { LessonParticipant } from "src/lesson-participant/entities/lesson-participant.entity";
import { UserService } from "src/user/user.service";
import { RoleList } from "src/user/types";
import { LessonCreditsService } from "src/lesson-slots/lesson-slot.service";
import { LessonParticipantService } from "src/lesson-participant/lesson-participant.service";
import { LESSON_PRICES } from "src/common/constants";
import { LessonPackage } from "src/lesson-package/entities/lesson-package.entity";
import {LessonCompleteEvent} from "../events/lesson-completed.event";

@CommandHandler(CreateLessonCommand)
export class CreateLessonHandler implements ICommandHandler<CreateLessonCommand> {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,

    @InjectRepository(MentorProfile)
    private readonly mentorProfileRepo: Repository<MentorProfile>,

    @InjectRepository(MentorAvailability)
    private readonly availabilityRepo: Repository<MentorAvailability>,

    @InjectRepository(LessonSlots)
    private readonly lessonSlotRepo: Repository<LessonSlots>,

    @InjectRepository(LessonParticipant)
    private readonly lessonParticipantRepo: Repository<LessonParticipant>,

    @InjectRepository(LessonPackage)
    private readonly lessonPackageRepo: Repository<LessonPackage>,

    private readonly userService: UserService,
    private readonly eventBus: EventBus
  ) { }

  notTrialLessons = [LESSON_TYPES.BASE, LESSON_TYPES.GROUP, LESSON_TYPES.FREE, LESSON_TYPES.PREMIUM]

  async execute(command: CreateLessonCommand): Promise<Lesson> {
    const { kind, mentorId, studentIds, date, start_time, notes, lessonLink } =
      command.createLessonDto;

    // ------------------------------------------------
    // 1) Пользователи
    // ------------------------------------------------
    const usersId = [mentorId, ...studentIds];

    const { foundUsers, students, mentor, mentorProfile } = await this.getUsers(usersId);

    // ------------------------------------------------
    // 3) Длительность и end_time
    // ------------------------------------------------
    // trial: фикс
    // non-trial: берём duration из payment у доступного кредита
    let lessonDuration: LESSON_DURATION;
    let lessonPackages: LessonPackage [] | null = null;

    if (kind === 'trial') {
      lessonDuration = LESSON_DURATION.MIN;
    }
    else if(kind === 'group') {
        lessonDuration = LESSON_DURATION.AVERAGE;

 
        lessonPackages = await this.lessonPackageRepo.find({
          where: { 
            userId: In(studentIds),
            type: LESSON_TYPES.GROUP
          },
        });
      console.log('lessonPackages', lessonPackages)
        if (!lessonPackages.length) {
          throw new HttpException('Нет доступного', 404);
        }
    }
    else {
      // Тут твоя исходная логика: берём один AVAILABLE слот
      // (если по факту у тебя non-trial может быть только один студент — это идеально)
      lessonPackages = await this.lessonPackageRepo.find({
        where: { userId: In(studentIds) },
      });

      console.log('lessonPackages', lessonPackages);
      if (!lessonPackages.length) {
        throw new HttpException('Нет доступного', 404);
      }

      lessonDuration = lessonPackages[0].duration
    }

    const end_time = addMinutesToTime(start_time, lessonDuration);

    const startDateTime = formatDateToISO(date, start_time);
    const endDateTime = formatDateToISO(date, end_time);
 
    // ------------------------------------------------
    // 4) Проверка пересечений по всем участникам
    // ------------------------------------------------
    await this.getOverlaps(usersId, date, start_time, end_time)

    // ------------------------------------------------
    // 5) Проверка availability ментора
    // ------------------------------------------------
    await this.checkMentorAvailabilty(mentorProfile.id, date, startDateTime, endDateTime);

    // ------------------------------------------------
    // 6) Транзакция: split availability + создание lesson + participants + credits
    // ------------------------------------------------
    return this.lessonRepo.manager.transaction(async (em) => {
      // --- split availability (как у тебя)
      const availSlot = await em.findOne(MentorAvailability, {
        where: {
          mentorProfileId: mentorProfile.id,
          date,
          start: LessThanOrEqual(start_time),
          end: MoreThanOrEqual(end_time),
        },
      });

      if (!availSlot) {
        throw new NotFoundException('Availability slot not found');
      }

      if (availSlot.start !== start_time) {
        await em.save(
          MentorAvailability,
          em.create(MentorAvailability, {
            mentorProfileId: mentorProfile.id,
            date,
            start: availSlot.start,
            end: start_time,
          }),
        );
      }

      if (availSlot.end !== end_time) {
        await em.save(
          MentorAvailability,
          em.create(MentorAvailability, {
            mentorProfileId: mentorProfile.id,
            date,
            start: end_time,
            end: availSlot.end,
          }),
        );
      }

      await em.delete(MentorAvailability, { id: availSlot.id });

      // --- 1) создаём Lesson
      const lesson = em.create(Lesson, {
        date,
        start_time,
        end_time,
        duration: lessonDuration,
        lessonType: kind,
        status: LESSON_STATUS.PLANNED,
        notes,
        lessonLink,

      });

      await em.save(Lesson, lesson);

      const participants = foundUsers.map(user =>
        em.create(LessonParticipant, {
          lesson,
          userId: user.id,
          role: user.role,
          user, // если у тебя есть relation ManyToOne -> User
          lessonPackage: user.role === RoleList.STUDENT ? lessonPackages?.find(lp => lp.userId === user.id) : null,
        })
      );

      await em.save(LessonParticipant, participants);


      const slot = this.lessonSlotRepo.create({
        start_time,
        end_time,
        date,
        duration: lesson.duration,
        lesson,
        lessonType: lesson.lessonType,
        status: LessonSlotStatus.BOOKED
      })



      if (this.notTrialLessons.includes(kind) && lessonPackages) {
        lessonPackages?.forEach(lp => ++lp.usedCount)
 
        await em.save(LessonPackage, lessonPackages)
      }


      lesson.price = this.getLessonPrice(lesson.lessonType, lesson.duration)
      // Опционально: проставляем связь lesson -> lessonCredit (у тебя она есть)

      await Promise.all([
        await em.save(LessonParticipant, participants),
        await em.save(LessonSlots, slot),
        await em.save(Lesson, lesson),
      ])


      this.eventBus.publish(new LessonCompleteEvent(usersId))

      // Вернём lesson (при желании можно загрузить relations)
      return lesson;
    });
  }


  getLessonPrice(type: LESSON_TYPES, duration: LESSON_DURATION) {
    const priceForHour = LESSON_PRICES[type];
    return priceForHour * (duration / 60);
  }

  private async getUsers(usersId: number[]) {
    const foundUsers = await this.userService.findusersById(usersId);

    const mentor = foundUsers.find((u) => u.role === RoleList.MENTOR);
    const students = foundUsers.filter((u) => u.role === RoleList.STUDENT);



    // ------------------------------------------------
    // 2) Профиль ментора
    // ------------------------------------------------
    const mentorProfile = await this.mentorProfileRepo.findOne({
      where: { userId: mentor.id },
    });

    if (!mentorProfile) {
      throw new NotFoundException('Mentor profile not found');
    }

    return {
      foundUsers,
      mentor,
      students,
      mentorProfile
    }
  }

  async getOverlaps(usersId: number[], date: string, start_time: string, end_time: string) {
    const usersOverlaps = await this.lessonRepo
      .createQueryBuilder('lesson')
      .leftJoin('lesson.participants', 'participants')
      .where('participants.userId IN (:...ids)', { ids: usersId })
      .andWhere('lesson.date = :date', { date })
      .andWhere('lesson.status = :status', { status: 'planned' })
      .andWhere(':start < lesson.end_time AND :end > lesson.start_time', {
        start: start_time,
        end: end_time,
      })
      .getCount();

    if (usersOverlaps > 0) {
      throw new ConflictException('Кто-то из пользователей не сможет в это время');
    }
  }

  async checkMentorAvailabilty(mentorProfileId: number, date: string, startDateTime: Date, endDateTime: Date) {
    const availability = await this.availabilityRepo.find({
      where: { mentorProfileId, date },
    });

    const fitsAvailability = availability.some((slot) => {
      const slotStart = new Date(`${slot.date}T${slot.start}`);
      const slotEnd = new Date(`${slot.date}T${slot.end}`);

      return (
        slotStart.getTime() <= startDateTime.getTime() &&
        slotEnd.getTime() >= endDateTime.getTime()
      );
    });

    if (!fitsAvailability) {
      throw new ConflictException('Lesson is outside mentor availability');
    }
  }
}
