import type { RoleList } from "@/features/users/types";
import { axiosInstance } from "@/shared/config/axios";
import type { Axios, AxiosResponse } from "axios";


export interface IAnalytic {
    "role": RoleList,
    "data": {
      "total": number,
      "completed": number,
      "cancelled": number,
      "closer": number,
      "allCloserLessons":number,
      "allSalaryCount": {
        "finalamount": string
      }
    }
  }

interface IAnalyticApi {
    get: () => Promise<AxiosResponse<IAnalytic>>
}

export const analyticApi: IAnalyticApi = {
    get() {
        return axiosInstance.get('/analytics')
    }
}