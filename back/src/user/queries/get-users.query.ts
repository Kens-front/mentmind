import { GetUsersQueryParamsDto } from "../dto/get-users.dto";
import { RoleList } from "../types";

export class GetUsersQuery {
    constructor(
      public readonly requester: { id: number; role: RoleList },
      public readonly params: GetUsersQueryParamsDto,
    ) {}
  }