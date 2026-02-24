import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUsersQuery } from './queries/get-users.query';
import { GetUserBy } from './queries/get-user-by.query';
import { USER_PARAMS } from 'src/auth/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { RoleList } from './types';

@Injectable()
export class UserService {
  constructor(
    private queryBus: QueryBus, 
    private commandBus: CommandBus,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}
 
  async findusersById(usersId: number []) {
    return this.userRepository.find({where: {id: In(usersId)}})
  }

  create(createUserDto: CreateUserDto) {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return this.queryBus.execute(new GetUserBy(USER_PARAMS.ID, id.toString()));
  }

  // Альтернативный метод с явным указанием отношений (если нужен больший контроль)
  async findOneWithRelations(id: number, relations: string[] = []) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['student_profile', 'mentor_profile', ...relations]
    });
  }

  // Метод для получения всех пользователей с явным указанием отношений
  async findAllWithRelations(relations: string[] = []) {
    return this.userRepository.find({
      relations: ['student_profile', 'mentor_profile', ...relations]
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
