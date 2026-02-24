import type { ILessonSlot } from "../lesson-slots/types"

 


export interface IMentorSlot {
  "mentorProfileId": number,
  "start" :string,
  "end": string,
  "date": string,
  "id": number
}

export interface IMentorSlotDto {
	"slots": {
    "date": string | undefined,
    "start": string,
    "end": string
  } []
}

export interface ILessonSlotEvent {
  start: Date,
  end: Date,
  title?: string
  content: string
  lessonId?: number
  class?: string
  lessonCredit: {
    status: ILessonSlot
  }
  _: {
    id: number
    startFormatted: string
    startMinutes: number
    endMinutes: number
  }
}