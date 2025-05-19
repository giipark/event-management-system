import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

@Injectable()
export class EventMiddleware implements NestMiddleware {
    // 토큰 인증이 필요없는 예외 경로
    private readonly publicPaths = [
        '/api/event', // 전체 이벤트 목록 조회
        '/api/event/ended', // 종료된 이벤트 목록 조회
        '/api/event/:id', // 이벤트 상세 조회
        '/api/event/:id/announcement', // 당첨자 발표 목록 조회
    ];

    async use(req: Request, res: Response, next: NextFunction) {
        const path = req.path;

        const isPublic = this.publicPaths.some((pattern) => {
            const regex = new RegExp('^' + pattern.replace(/:[^/]+/g, '[^/]+') + '$');
            return regex.test(path);
        });

        if (isPublic) return next();

        const authHeader = req.headers['authorization'];
        if (!authHeader) throw new UnauthorizedException('Authorization 헤더가 존재하지 않습니다.');

        try {
            const { data } = await axios.post('http://auth:3001/auth/validate-token', {
                token: authHeader,
            });

            req['user'] = data;
            next();
        } catch (err) {
            throw new UnauthorizedException('유효하지 않은 토큰입니다.');
        }
    }
}
