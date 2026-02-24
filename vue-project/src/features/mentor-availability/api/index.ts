import type { AxiosResponse } from "axios";
import type { IMentorSlot, IMentorSlotDto } from "../types";
import { axiosInstance } from "@/shared/config/axios";



interface IMentorSlotApi {
  getByMentor: (query: {from: string, to: string}) => Promise<AxiosResponse<IMentorSlot []>>
  getByMentorId: (id: number, query: {date: string}) => Promise<AxiosResponse<IMentorSlot []>>
  create: (dto: IMentorSlotDto, period: {start: string | undefined, end: string | undefined}) => Promise<AxiosResponse<IMentorSlot>>
  delete: (id: number) => Promise<AxiosResponse<boolean>>
}

export const mentorSlotAPi: IMentorSlotApi = {
  getByMentor(query) {
    return axiosInstance.get(`/mentor-availability/me`, {params: query});
  },

  getByMentorId(id, query) {
    return axiosInstance.get(`/mentor-availability/${id}`, {params: query});
  },


  create(dto, period) {
    return axiosInstance.post('/mentor-availability', {slots: dto.slots, period})
  },

  delete(id) {
    return axiosInstance.delete(`/mentor-availability/${id}`)
  }
}