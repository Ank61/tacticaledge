import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly config: ConfigService) { }

    canActivate(context: ExecutionContext): boolean {
        const request: any = context.switchToHttp().getRequest<Request>();
        const token = request.cookies?.jwt;

        if (!token) {
            throw new UnauthorizedException('Authentication required');
        }

        try {
            const payload = jwt.verify(
                token,
                this.config.get<string>('JWT_SECRET')!,
            );
            request['user'] = payload;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}