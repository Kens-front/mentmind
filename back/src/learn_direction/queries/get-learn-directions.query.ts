import { FindOptionsWhere } from "typeorm"
import { LearnDirection } from "../entities/learn_direction.entity"
interface IFilterParams {
    id: number [] | number
}

interface IFilter {
    id?: number | number []
    title?: string
    age?: number
}

export class GetLearnDirectionQuery {
    constructor(public filter: IFilter) {}
}