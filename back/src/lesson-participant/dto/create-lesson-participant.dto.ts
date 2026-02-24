import { RoleList } from "src/user/types";

export class CreateLessonParticipantDto {
 
 
    lessonId: number;
  
 
    userId: number;
 
    role: RoleList;
 
    lessonCreditId?: number;
 
    active: boolean;   
}
