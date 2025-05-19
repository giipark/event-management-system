import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {INestApplication} from "@nestjs/common";
import {createProxyMiddleware} from "http-proxy-middleware";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    addSwagger(app);
    addProxyMiddleware(app);

    await app.listen(process.env.PORT ?? 3000);
}

function addSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('Gateway API')
        .setDescription('모든 API요청 라우팅 / 인증 / 권한 검사')
        .setVersion('0.1')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
}

function addProxyMiddleware(app: INestApplication) {
    app.use(
        '/api',
        (req, res, next) => {
            if (req.url.startsWith('/auth')) {
                createProxyMiddleware({
                    target: 'http://auth:3001',
                    changeOrigin: true,
                })(req, res, next);
            } else if (req.url.startsWith('/event') ||
                req.url.startsWith('/my')) {
                createProxyMiddleware({
                    target: 'http://event:3002',
                    changeOrigin: true,
                })(req, res, next);
            } else {
                res.status(404).json({message: '잘못된 요청입니다.'});
            }
        },
    );
}

bootstrap();
