import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ITokenData } from "src/user/types";



@Injectable()
export class JwtPort {
    constructor(private jwtService: JwtService) {}

    generateToken(data: ITokenData) {
        return this.jwtService.sign(data, {secret: 'secret-key'});
    }

    decodeToken(token: string) {
        try {
             return this.jwtService.decode(token)
        } catch(e) {
            console.warn('Проблема с токеном')
        }
    }

    verifayToken(token: string) {
        try {
             const user = this.jwtService.verify(token, {secret: 'secret-key'})
             return {
                user,
                isOk: true,
             }
        } catch(e) {
            throw new HttpException({message: HttpStatus.UNAUTHORIZED, isOk: false}, 401)
        }
    }
}