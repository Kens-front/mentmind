

export class GetUsersBySkillsQuery {
    constructor(public skill: string, public start: string, public end: string, public date: string) {
    }
}