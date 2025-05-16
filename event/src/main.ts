import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {INestApplication} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  addSwagger(app);

  await app.listen(process.env.PORT ?? 3002);
}

function addSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
      .setTitle('Event API')
      .setDescription('이벤트 생성 / 참여 / 이벤트 관련 API')
      .setVersion('0.1')
      .addBearerAuth()
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
}

bootstrap();
