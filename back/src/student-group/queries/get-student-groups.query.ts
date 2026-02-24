import { RoleList } from "src/user/types";

export class GetStudentGroups {
    constructor(public role: RoleList, public userId: number) {

    }
}