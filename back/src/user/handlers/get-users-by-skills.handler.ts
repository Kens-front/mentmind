import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {GetUsersBySkillsQuery} from "../queries/get-users-by-skills.query";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import {Repository} from "typeorm";
import {RoleList} from "../types";


@QueryHandler(GetUsersBySkillsQuery)
export class GetUsersBySkillsHandler implements IQueryHandler<GetUsersBySkillsQuery>  {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}
    
    async execute(query: GetUsersBySkillsQuery): Promise<User []> {
        if (!query.skill) {
            return this.userRepository.find({where: {role: RoleList.MENTOR}});
        }
        
        const users = await this.userRepository.find({
            where: { role: RoleList.MENTOR,  },
            relations: ['mentor_profile'],
        });
 
        return users.filter(user => {
            if (!user.mentor_profile || !user.mentor_profile.tags) {
                return false;
            }

            // Разбиваем теги по запятым, убираем пробелы и ищем совпадение
            const tagsArray = user.mentor_profile.tags 
            return tagsArray.includes(query.skill.toLowerCase()); // чувствительно к регистру
        });
    }
}