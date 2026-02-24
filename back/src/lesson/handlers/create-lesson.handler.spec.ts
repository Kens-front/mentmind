import { CreateLessonHandler } from './create-lesson.handler';
import { Lesson, LESSON_STATUS } from '../entities/lesson.entity';
import { Repository } from 'typeorm';
import { StudentProfile } from 'src/student_profile/entities/student_profile.entity';
import { MentorProfile } from 'src/mentor_profile/entities/mentor_profile.entity';
import { CreateLessonCommand } from '../commands/create-lesson.command';

type MockRepo<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('CreateLessonHandler', () => {
  let handler: CreateLessonHandler;
  let lessonRepo: MockRepo<Lesson>;
  let studentRepo: MockRepo<StudentProfile>;
  let mentorRepo: MockRepo<MentorProfile>;

  const dto = {
    studentIds: [1],
    mentorId: 2,
    start_time: '10:00',
    date: '2024-01-01',
    duration: 30,
  } as any;

  beforeEach(() => {
    lessonRepo = {
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
      save: jest.fn(),
    };
    studentRepo = {
      find: jest.fn(),
    };
    mentorRepo = {
      findOne: jest.fn(),
    };

    handler = new CreateLessonHandler(lessonRepo as any, studentRepo as any, mentorRepo as any);
  });

  it('throws when no available lesson', async () => {
    (studentRepo.find as jest.Mock).mockResolvedValue([{ id: 10, userId: 1 }]);
    (mentorRepo.findOne as jest.Mock).mockResolvedValue({ id: 20, userId: 2 });
    (lessonRepo.findOne as jest.Mock).mockResolvedValue(null);

    await expect(handler.execute(new CreateLessonCommand(dto))).rejects.toThrow('Нет доступных занятий');
  });

  it('throws when student has overlap', async () => {
    (studentRepo.find as jest.Mock).mockResolvedValue([{ id: 10, userId: 1 }]);
    (mentorRepo.findOne as jest.Mock).mockResolvedValue({ id: 20, userId: 2 });
    (lessonRepo.findOne as jest.Mock).mockResolvedValue({ id: 5, duration: 30, status: LESSON_STATUS.AVAILABLE });

    const qb: any = {
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([{}]),
    };
    (lessonRepo.createQueryBuilder as jest.Mock).mockReturnValue(qb);

    await expect(handler.execute(new CreateLessonCommand(dto))).rejects.toThrow('Пересечение с другими занятиями студента');
  });

  it('creates planned lesson when no overlaps', async () => {
    (studentRepo.find as jest.Mock).mockResolvedValue([{ id: 10, userId: 1 }]);
    (mentorRepo.findOne as jest.Mock).mockResolvedValue({ id: 20, userId: 2 });
    const availableLesson = { id: 5, duration: 30, status: LESSON_STATUS.AVAILABLE };
    (lessonRepo.findOne as jest.Mock).mockResolvedValue(availableLesson);

    const qb: any = {
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    };
    (lessonRepo.createQueryBuilder as jest.Mock).mockReturnValue(qb);

    const saved = { ...availableLesson, status: LESSON_STATUS.PLANNED };
    (lessonRepo.save as jest.Mock).mockResolvedValue(saved);

    const result = await handler.execute(new CreateLessonCommand(dto));

    expect(result.status).toBe(LESSON_STATUS.PLANNED);
    expect(result.end_time).toBe('10:30');
    expect(lessonRepo.save).toHaveBeenCalled();
  });
});

