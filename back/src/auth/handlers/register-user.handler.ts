import { CommandBus, CommandHandler, ICommandBus, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { RegisterUserCommand } from "../commands/register-user.command";
import { USER_PARAMS } from "../constants";
import { GetUserBy } from "../../user/queries/get-user-by.query";
 
import { HttpException } from "@nestjs/common";
import * as bcrypt from 'bcrypt' 
import { CreateMentorProfileCommand } from "src/mentor_profile/commands/create-mentor-profile.command";
import { CreateStudentProfileCommand } from "src/student_profile/commands/create-student-profile.command";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { EntityManager, Repository } from "typeorm";
import { RoleList } from "src/user/types";
import { MentorProfile } from "src/mentor_profile/entities/mentor_profile.entity";
import { StudentProfile } from "src/student_profile/entities/student_profile.entity";
import { CreateStudentProfileDto } from "src/student_profile/dto/create-student_profile.dto";
import { CreateMentorProfileDto } from "src/mentor_profile/dto/create-mentor_profile.dto";
import { CreateAdminCommand } from "src/admin/commands/create-admin.command";
import { CreateAdminDto } from "src/admin/dto/create-admin.dto";
// Тип для PROFILES

type Profile = CreateMentorProfileCommand | CreateStudentProfileCommand | CreateAdminCommand
type ProfileDto = CreateStudentProfileDto | CreateMentorProfileDto | CreateAdminDto
type ProfileCommandCreator = (data: ProfileDto) => Profile;

export type RegisterUserResponse = User & (MentorProfile | StudentProfile);


 
const PROFILES: Partial<Record<RoleList, ProfileCommandCreator>> = {
    [RoleList.MENTOR]: (mentorDto: CreateMentorProfileDto) => new CreateMentorProfileCommand(mentorDto),
    [RoleList.STUDENT]: (studentData: CreateStudentProfileDto) => new CreateStudentProfileCommand(studentData),
    [RoleList.ADMIN]: () => new CreateAdminCommand(),
};

const PROFILES_DATA: Partial<Record<RoleList, (dto: ProfileDto) => ProfileDto>> = {
    [RoleList.MENTOR]: (mentorDto: CreateMentorProfileDto) => {
        const {userId, learn_directions} = mentorDto;
        return {
            userId,
            learn_directions,
        }
    },
    [RoleList.STUDENT]: (studentData: CreateStudentProfileDto) => {
        const {userId, learn_direction} = studentData;
        return {
            userId,
            learn_direction,
        }
    },
    [RoleList.ADMIN]: (adminDto: CreateAdminDto) => adminDto
};

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    async execute(command: RegisterUserCommand): Promise<{ user: User; profile: any }> {

        const { user } = command;

        // 1. Проверка уникальности
        const existing = await this.queryBus.execute(new GetUserBy(USER_PARAMS.LOGIN, user.login));
        if (existing) {
            throw new HttpException('Пользователь с таким логином уже существует', 400);
        }

        // 2. Хэш
        const hashedPassword = await bcrypt.hash(user.password, 10);

        // 3. Создаём и сохраняем пользователя
        const entity = this.userRepo.create({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            login: user.login,
            password: hashedPassword,
            role: user.role,
            fullname: `${user.first_name} ${user.last_name}`
        });

        const savedUser = await this.userRepo.save(entity);

        // 4. Создаём профиль на основе роли
        let profile = null;

        switch (savedUser.role) {
            case RoleList.STUDENT:
                profile = await this.commandBus.execute(
                    new CreateStudentProfileCommand({
                        userId: savedUser.id,
                        learn_direction: user.learn_direction,
                    }),
                );
                break;

            case RoleList.MENTOR:
                profile = await this.commandBus.execute(
                    new CreateMentorProfileCommand({
                        userId: savedUser.id,
                        learn_directions: user.learn_directions,
                    }),
                );
                break;

            case RoleList.ADMIN:
                profile = await this.commandBus.execute(
                    new CreateAdminCommand()
                );
                break;
        }

        return { user: savedUser, profile };
    }
}
