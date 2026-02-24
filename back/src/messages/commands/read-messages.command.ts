

export class ReadMessagesCommand {
    constructor(public chatId: number, public lastMessageId: number, public userId: number) {}
}