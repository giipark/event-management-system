import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {INestApplication} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  addSwagger(app);

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

bootstrap();
