import { CookieOptions } from "express";

export enum USER_PARAMS {
    EMAIL = 'email',
    LOGIN = 'login',
    ID = 'id',
}

 
export const TOKEN_DATA = {
    httpOnly: true, // Доступно только через HTTP (защита от XSS)
    maxAge: 1000 * 60 * 60 * 24, // Время жизни cookie (1 день в миллисекундах)
    partitioned: true,
    secure: true,
    sameSite: 'none'
  } as CookieOptions