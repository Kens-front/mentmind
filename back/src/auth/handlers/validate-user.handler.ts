import {IQueryHandler, QueryBus, QueryHandler} from "@nestjs/cqrs";
import {ValidateUserQuery} from "../query/validate-user.query";
import {JwtPort} from "src/jwt/jwt.service";
import {GetUserBy} from "../../user/queries/get-user-by.query";
import {USER_PARAMS} from "../constants";


@QueryHandler(ValidateUserQuery)
export class ValidateUserHandler implements IQueryHandler<ValidateUserQuery> {
    constructor(
        private jwtService: JwtPort,
        private queryBus: QueryBus,
    ) {}

    async execute(query: ValidateUserQuery): Promise<any> {
        try {
            const data = this.jwtService.verifayToken(query.token)
            const user = await this.queryBus.execute(new GetUserBy(USER_PARAMS.ID, `${data.user.id}`));
            
            console.log(user);
            return user;
        } catch {
            return false;
        }
    }
}