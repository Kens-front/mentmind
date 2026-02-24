// src/mentor/commands/handlers/create-availability-slots.handler.ts
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository, EntityManager, In, Between, MoreThanOrEqual, And, LessThanOrEqual} from 'typeorm';
import { CreateMentorAvailabilityCommand } from '../commands/create-mentor-availablity.command';
import { MentorAvailability } from '../entities/mentor-availability.entity';
import { MentorProfile } from 'src/mentor_profile/entities/mentor_profile.entity';
 

@CommandHandler(CreateMentorAvailabilityCommand)
export class CreateAvailabilitySlotsHandler implements ICommandHandler<CreateMentorAvailabilityCommand, MentorAvailability []> {
  constructor(
    @InjectRepository(MentorAvailability) private readonly availabilityRepo: Repository<MentorAvailability>,
    @InjectRepository(MentorProfile) private readonly mentorDetailsRepo: Repository<MentorProfile>,
    private readonly entityManager: EntityManager,
  ) {}

  async execute(command: CreateMentorAvailabilityCommand): Promise<any  > {
    return this.entityManager.transaction(async (manager) => {   
      const mentor = await this.mentorDetailsRepo.findOne({where: {userId: command.dto.userId}})
 
      //const slots = command.dto.slots?.sort((a, b) => a.date.localeCompare(b.date))
      await manager.delete(MentorAvailability, {mentorProfileId:mentor.id, date: And(MoreThanOrEqual(command.dto.period?.start), LessThanOrEqual(command.dto.period?.end))})
      // Преобразуем ISO строки в Date объекты
      const slotsWithDates = command.dto.slots.map(slot => ({
        mentorProfileId: mentor.id,
        start: slot.start,
        end: slot.end,
        date: slot.date
      }));

      return manager.save(MentorAvailability, slotsWithDates);
    });
  }

  getWeekStartMonday(dateString) {
    const date = new Date(dateString);
    const day = date.getDay(); // 0 (Вс) - 6 (Сб)

    // Вычисляем разницу до понедельника
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);

    const weekStart = new Date(date.setDate(diff));
    return weekStart.toISOString().split('T')[0]; // Формат YYYY-MM-DD
  }
  getWeekSunday(dateString) {
    const date = new Date(dateString);
    const day = date.getDay(); // 0 (Вс) - 6 (Сб)

    // Вычисляем разницу до воскресенья
    const diff = date.getDate() + (7 - day);

    const sunday = new Date(date.setDate(diff));
    return sunday.toISOString().split('T')[0]; // Формат YYYY-MM-DD
  }
}