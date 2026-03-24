export enum ELessonPrices {
    BASE = 2600,
    GROUP = 1800,
    PREMIUM = 3600
}


export interface IQA {
    question: string,
    answer: string,
}

export interface IMessage {
    message: string
    sent: boolean
}