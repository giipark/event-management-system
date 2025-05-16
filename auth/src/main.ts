import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {INestApplication} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  addSwagger(app);

  await app.listen(process.env.PORT ?? 3001);
}

function addSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
      .setTitle('Auth API')
      .setDescription('JWT 관리 / 회원가입(유저 등록) / 로그인 관련 API')
      .setVersion('0.1')
      .addBearerAuth()
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
}

bootstrap();
