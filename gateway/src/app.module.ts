import {Module, NestModule, MiddlewareConsumer, RequestMethod} from '@nestjs/common';
import {AuthMiddleware} from './common/middleware/auth.middleware';

@Module({
    imports: [],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes(
                {path: '/api/auth/profile', method: RequestMethod.ALL},
                {path: '/api/auth/admin/promote', method: RequestMethod.ALL},
            );
    }
}
