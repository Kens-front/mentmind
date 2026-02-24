import { Role } from "src/user/types";

 
export interface ILoginData {
  login: string
  password: string
}

export interface ITokenData {
  id: number, 
  role: Role,
  first_name: string,
  last_name: string,
  email:string
}

export interface ILoginResponse {
  token: string
  user: ITokenData
}

export interface ILogoutData {
  isOk: boolean
}