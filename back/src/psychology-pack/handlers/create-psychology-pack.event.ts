import {EventsHandler, IEventHandler, QueryBus} from "@nestjs/cqrs";
import {PaymentPaid} from "../../payment/events/payment-paid.event";
import {InjectRepository} from "@nestjs/typeorm";
import {PsychologyPack} from "../entities/psychology-pack.entity";
import {Repository} from "typeorm";
import {GetUserBy} from "../../user/queries/get-user-by.query";
import {USER_PARAMS} from "../../auth/constants";


@EventsHandler(PaymentPaid)
export class CreatePsychologyPackEvent implements IEventHandler<PaymentPaid> {
    constructor(
        @InjectRepository(PsychologyPack) private readonly psychology: Repository<PsychologyPack>,
        private queryBus: QueryBus,
    ) {
    }
    
    async handle(event: PaymentPaid) {
        const {lessonCount, userId} = event;
        
        const packCount = Math.floor(lessonCount / 10);
        
        const packs = []
        for (let index = 0; index < packCount; index++) {
            packs.push(this.psychology.create())
        }
        
        const user = await this.queryBus.execute(new GetUserBy(USER_PARAMS.ID, `${userId}`))
        
        packs.forEach(psychology => {
            psychology.user = user
        })
        console.log('packs', packs);
        this.psychology.save(packs);
    }
}