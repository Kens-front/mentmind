// src/mentor_profile/handlers/update-mentor-profile.handler.ts

import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';

import { MentorProfile } from 'src/mentor_profile/entities/mentor_profile.entity';
import { LearnDirection } from 'src/learn_direction/entities/learn_direction.entity';
import { UpdateMentorCommand } from 'src/mentor_profile/commands/update-mentor.command';

import { GetUserBy } from 'src/user/queries/get-user-by.query';
import { USER_PARAMS } from 'src/auth/constants';
import { User } from 'src/user/entities/user.entity';
import { RoleList } from 'src/user/types';

@CommandHandler(UpdateMentorCommand)
export class UpdateMentorProfileHandler
  implements ICommandHandler<UpdateMentorCommand> {
  constructor(
    @InjectRepository(MentorProfile)
    private readonly mentorRepo: Repository<MentorProfile>,

    @InjectRepository(LearnDirection)
    private readonly learnDirectionRepo: Repository<LearnDirection>,

    private readonly queryBus: QueryBus,
    private readonly entityManager: EntityManager,
  ) { }

  /**
   * Обновляем профиль ментора:
   * - learn_directions
   * - level (если есть в DTO)
   */
  async execute(
    command: UpdateMentorCommand,
  ): Promise<{ isOk: boolean }> {
    const { userId, updateMentorDto } = command;

    await this.entityManager.transaction(async (manager) => {
      const user = await this.queryBus.execute<GetUserBy, User | null>(
        new GetUserBy(USER_PARAMS.ID, `${userId}`),
      );

      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      if (user.role !== RoleList.MENTOR) {
        throw new BadRequestException('Пользователь не является ментором');
      }

      const mentorRepo = manager.getRepository(MentorProfile);
      const learnRepo = manager.getRepository(LearnDirection);

      const mentorProfile = await mentorRepo.findOne({
        where: { userId: user.id },
        relations: ['learn_directions'],
      });

      if (!mentorProfile) {
        throw new NotFoundException('Профиль ментора не найден');
      }

      // Обновляем направления, если есть
      if (updateMentorDto.learn_directions?.length) {
        const learnDirections = await learnRepo.find({
          where: { id: In(updateMentorDto.learn_directions) },
        });

        mentorProfile.learn_directions = learnDirections;
      }

      // Обновляем уровень, если передан
      if ((updateMentorDto as any).level !== undefined) {
        mentorProfile.level = (updateMentorDto as any).level;
      }

      // Обновляем уровень, если передан
      if ((updateMentorDto as any).tags !== undefined) {
        mentorProfile.tags = (updateMentorDto as any).tags;
      }

      await mentorRepo.save(mentorProfile);
    });

    return { isOk: true };
  }
}
