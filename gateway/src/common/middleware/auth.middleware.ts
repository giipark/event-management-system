import {Injectable, NestMiddleware, UnauthorizedException} from '@nestjs/common';
import {Request, Response, NextFunction} from 'express';
import axios from 'axios';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    private readonly protectedPaths = [
        '/api/auth/profile',
        '/api/auth/admin/promote',
    ];

    async use(req: Request, res: Response, next: NextFunction) {
        // 인증이 필요 없는 경로는 통과
        const isProtected = this.protectedPaths.some((path) => req.path.startsWith(path));
        if (!isProtected) return next();

        const authHeader = req.headers['authorization'];
        if (!authHeader) throw new UnauthorizedException('authorization 헤더가 존재하지 않습니다.');

        try {
            const {data} = await axios.post('http://auth:3001/auth/validate-token', {
                token: authHeader,
            });

            req['user'] = data;
            next();
        } catch (err) {
            throw new UnauthorizedException('유효하지 않은 토큰입니다.');
        }
    }
}
