import type { RoleList } from "@/features/users/types"


export interface ILogin {
    login: string

    password: string
}

export interface ILoginResponse {
    user: {
        id: number
        role: RoleList
        first_name: string
        last_name: string
        email: string
        avatar: string | null
    } | null

    token: string
}

export interface IValidateData {
    id: number
    role: RoleList
    first_name: string
    last_name: string
    email: string
    avatar: string | null
}