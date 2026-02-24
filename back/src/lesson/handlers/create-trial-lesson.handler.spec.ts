import { CreateTrialLessonHandler } from './create-trial-lesson.handler';
import { Lesson, LESSON_STATUS } from '../entities/lesson.entity';
import { Repository } from 'typeorm';
import { StudentProfile } from 'src/student_profile/entities/student_profile.entity';
import { MentorAvailability } from 'src/mentor-availability/entities/mentor-availability.entity';
import { CreateTrialLessonCommand } from '../commands/create-trial-lesson.command';

type MockRepo<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('CreateTrialLessonHandler', () => {
  let handler: CreateTrialLessonHandler;
  let lessonRepo: MockRepo<Lesson>;
  let studentRepo: MockRepo<StudentProfile>;
  let availabilityRepo: MockRepo<MentorAvailability>;
  let queryBus: { execute: jest.Mock };
  let eventBus: { publish: jest.Mock };

  const dto = {
    studentIds: [1],
    mentorId: 2,
    start_time: '10:00',
    date: '2024-01-01',
  } as any;

  beforeEach(() => {
    lessonRepo = {
      create: jest.fn((dto) => ({ ...dto })),
      createQueryBuilder: jest.fn(),
      manager: { transaction: (fn: any) => fn({ save: jest.fn(), delete: jest.fn() }) } as any,
    };
    studentRepo = {
      find: jest.fn(),
    };
    availabilityRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn((dto) => dto as any),
    };
    queryBus = { execute: jest.fn() };
    eventBus = { publish: jest.fn() };

    handler = new CreateTrialLessonHandler(
      lessonRepo as any,
      studentRepo as any,
      queryBus as any,
      eventBus as any,
      availabilityRepo as any,
    );
  });

  it('throws on overlap with mentor or students', async () => {
    (studentRepo.find as jest.Mock).mockResolvedValue([{ id: 10, userId: 1 }]);
    queryBus.execute.mockResolvedValue({ id: 20, userId: 2 });
    const qb: any = {
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([{}]),
    };
    (lessonRepo.createQueryBuilder as jest.Mock).mockReturnValue(qb);

    await expect(handler.execute(new CreateTrialLessonCommand(dto))).rejects.toThrow('Time slot is not available for mentor or students');
  });

  it('throws when outside availability', async () => {
    (studentRepo.find as jest.Mock).mockResolvedValue([{ id: 10, userId: 1 }]);
    queryBus.execute.mockResolvedValue({ id: 20, userId: 2 });
    const qb: any = {
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    };
    (lessonRepo.createQueryBuilder as jest.Mock).mockReturnValue(qb);
    (availabilityRepo.find as jest.Mock).mockResolvedValue([]);

    await expect(handler.execute(new CreateTrialLessonCommand(dto))).rejects.toThrow('Lesson is outside mentor availability');
  });

  it('creates trial lesson and publishes event', async () => {
    (studentRepo.find as jest.Mock).mockResolvedValue([{ id: 10, userId: 1 }]);
    queryBus.execute.mockResolvedValue({ id: 20, userId: 2 });
    const qb: any = {
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    };
    (lessonRepo.createQueryBuilder as jest.Mock).mockReturnValue(qb);
    (availabilityRepo.find as jest.Mock).mockResolvedValue([{ id: 1, mentorProfileId: 20, date: dto.date, start: '09:00', end: '11:00' }]);
    (availabilityRepo.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      mentorProfileId: 20,
      date: dto.date,
      start: '09:00',
      end: '11:00',
    });

    const saved = { id: 99, status: LESSON_STATUS.PLANNED };
    (lessonRepo.manager as any).transaction = (fn: any) =>
      fn({
        save: jest.fn().mockResolvedValue(saved),
        delete: jest.fn(),
      });

    const result = await handler.execute(new CreateTrialLessonCommand(dto));

    expect(result).toEqual(saved);
    expect(eventBus.publish).toHaveBeenCalled();
  });
});

