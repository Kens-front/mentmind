import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import {AuthService} from "../../auth/auth.service";
import {Reflector} from "@nestjs/core";
import {Roles} from "./roles.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const payload = jwt.verify(token, 'secret-key');

 
      
      // @ts-ignore
      if(requiredRoles && !requiredRoles?.includes(payload?.role)) {
        throw new UnauthorizedException('Invalid role');
      }
      // Кладём в request.user, чтобы использовать в @CurrentUser()
      // @ts-ignore
      request.user = payload;

      return true;
    } catch (err) {
      throw new UnauthorizedException(err.message || 'Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | null {
    const token = request.cookies.token;
    if (!token) return null;

    return token
  }
}
