 
import {YookassaWebhookPayload} from "../types";

export class CapturePaymentCommand {
    constructor(public payment: YookassaWebhookPayload) {}
}