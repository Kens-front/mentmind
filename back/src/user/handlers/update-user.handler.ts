// src/user/handlers/update-user.handler.ts

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/user/entities/user.entity';
import { UpdateUserCommand } from 'src/user/commands/update-user.command';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  /**
   * Обновляем только сущность User (без профилей).
   * Разрешаем менять только "плоские" поля пользователя.
   */
  async execute(command: UpdateUserCommand): Promise<{ isOk: boolean }> {
    const { userId, updateData } = command;

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Разрешённые к обновлению поля User.
    // Пароль, роль и т.п. — отдельные команды / кейсы.
    const allowedFields: (keyof User)[] = [
      'first_name',
      'last_name',
      'email',
      'phone',
      'login',
      'status',
      'about',
      'avatar'
    ];

    let hasChanges = false;

    for (const key of allowedFields) {
      const newValue = (updateData as any)[key];

      if (newValue !== undefined && user[key] !== newValue) {
        (user as any)[key] = newValue;
        hasChanges = true;
      }
    }

    if (!hasChanges) {
      // Ничего не меняем — просто честно говорим "Ок, но изменений нет"
      return { isOk: true };
    }

    await this.userRepository.save(user);

    return { isOk: true };
  }
}
