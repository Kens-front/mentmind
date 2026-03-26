import {EventsHandler, IEventHandler} from "@nestjs/cqrs";
import {CreatedRequestEvent} from "../../request/events/created-request.event";
import {NodemailerService} from "../nodemailer.service";


@EventsHandler(CreatedRequestEvent)
export class SentRequestEventHandler implements IEventHandler<CreatedRequestEvent>{
    constructor(private nodemailerService: NodemailerService) {
    }
    
    handle(req: CreatedRequestEvent):void {
        console.log(`Received request: ${JSON.stringify(req.event)}`);
        this.nodemailerService.sendEmail(process.env.MAIL_USER, 'Новая заявка', `Пришла заявка от ${req.event.name} в ${req.event.method}, данные - ${req.event.callbackMethod}`)
    }
}