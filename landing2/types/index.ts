export enum ELessonPrices {
    BASE = 2400,
    GROUP = 1800,
    PREMIUM = 3400
}


export interface IQA {
    question: string,
    answer: string,
}

export interface IMessage {
    message: string
    sent: boolean
}