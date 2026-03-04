import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ITokenData } from "src/user/types";
import {ConfigService} from "@nestjs/config";



@Injectable()
export class JwtPort {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    generateToken(data: ITokenData) {
        console.log( this.configService.get('KEY'));
        return this.jwtService.sign(data, {secret: this.configService.get('KEY')});
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
             const user = this.jwtService.verify(token, {secret: this.configService.get('KEY')})
             return {
                user,
                isOk: true,
             }
        } catch(e) {
            throw new HttpException({message: HttpStatus.UNAUTHORIZED, isOk: false}, 401)
        }
    }
}