// src/student_profile/handlers/update-student-profile.handler.ts

import {
    NotFoundException,
  } from '@nestjs/common';
  import { CommandBus, CommandHandler, EventBus, ICommandHandler, QueryBus } from '@nestjs/cqrs';
  import { InjectRepository } from '@nestjs/typeorm';
  import { EntityManager, Repository } from 'typeorm';
  
  import { StudentProfile } from 'src/student_profile/entities/student_profile.entity';
  import { LearnDirection } from 'src/learn_direction/entities/learn_direction.entity';
  import { UpdateStudentProfileCommand } from 'src/student_profile/commands/update-student-profile.command';
  
  import { GetMentorProfileQuery } from 'src/mentor_profile/queries/get-mentor-profile.query';
  import { MentorProfile } from 'src/mentor_profile/entities/mentor_profile.entity';
  import { CreateChatEvent } from 'src/chat/events/create-chat.event';
  
  @CommandHandler(UpdateStudentProfileCommand)
  export class UpdateStudentProfileHandler
    implements ICommandHandler<UpdateStudentProfileCommand>
  {
    constructor(
      @InjectRepository(StudentProfile)
      private readonly studentRepo: Repository<StudentProfile>,
  
      @InjectRepository(LearnDirection)
      private readonly learnDirectionRepo: Repository<LearnDirection>,
  
      private readonly queryBus: QueryBus,
      private readonly commandBus: CommandBus,
      private readonly entityManager: EntityManager,
    ) {}
  
    /**
     * Обновляем профиль студента:
     * - learn_direction (если передан)
     * - mentorId (если передан)
     * При смене ментора создаём чат между студентом и ментором.
     */
    async execute(
      command: UpdateStudentProfileCommand,
    ): Promise<{ isOk: boolean }> {
      const { userId, updateStudentProfileDto } = command;
  
      await this.entityManager.transaction(async (manager) => {
        const studentRepo = manager.getRepository(StudentProfile);
        const learnRepo = manager.getRepository(LearnDirection);
  
        const studentProfile = await studentRepo.findOne({
          where: { userId },
          relations: ['mentor'],
        });
  
        if (!studentProfile) {
          throw new NotFoundException('Профиль студента не найден');
        }
  
        let mentorProfile: MentorProfile | null = null;
        let mentorChanged = false;
  
        // Обновление направления обучения, если есть
        if (updateStudentProfileDto.learn_direction) {
          const learnDirection = await learnRepo.findOne({
            where: { id: updateStudentProfileDto.learn_direction },
          });
  
          if (!learnDirection) {
            throw new NotFoundException('Направление обучения не найдено');
          }
  
          studentProfile.learn_direction = learnDirection;
        }
  
        // Обновление ментора, если передан mentorId
        if (updateStudentProfileDto.mentorId) {
          mentorProfile = await this.queryBus.execute<GetMentorProfileQuery, MentorProfile | null>(
            new GetMentorProfileQuery(updateStudentProfileDto.mentorId),
          );
  
          if (!mentorProfile) {
            throw new NotFoundException('Профиль ментора не найден');
          }
  
          if (!studentProfile.mentor || studentProfile.mentor.id !== mentorProfile.id) {
            studentProfile.mentor = mentorProfile;
            mentorChanged = true;

            this.commandBus.execute(
              new CreateChatEvent([studentProfile.userId, mentorProfile.userId]),
            );
          }
        }

        if (updateStudentProfileDto.lessonFormat) {
          studentProfile.lessonFormat = updateStudentProfileDto.lessonFormat
        }
  
        await studentRepo.save(studentProfile);
  
        // ВАЖНО: событие публикуем уже после успешного сохранения.
        // if (mentorChanged && mentorProfile) {
        //   this.commandBus.execute(
        //     new CreateChatEvent([studentProfile.userId, mentorProfile.userId]),
        //   );
        // }
      });
  
      return { isOk: true };
    }
  }
  