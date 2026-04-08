import { CookieOptions } from "express";

export enum USER_PARAMS {
    EMAIL = 'email',
    LOGIN = 'login',
    ID = 'id',
}

 
export const TOKEN_DATA = {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: false, // 🔥 true только на HTTPS
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 🔥 'none' требует secure
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined,
  } as CookieOptions