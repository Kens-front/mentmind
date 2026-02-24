import { USER_PARAMS } from "src/auth/constants";


export class GetUserBy {
    constructor(public key: USER_PARAMS, public params: string) {

    }
}