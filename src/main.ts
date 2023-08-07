import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger 띄우기
  const config = new DocumentBuilder()
    .setTitle('TicketNest')
    .setDescription('TicketNest API description')
    .setVersion('1.0')
    .addTag('tickets')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //* 전역 pipe 설정 (data transformation 및 data validation 할 수 있게 해줌)
  // DTO 데이터 검증 및 입력 데이터를 원하는 형식으로 변환. 즉, 파이프가 입력 데이터르 원하는 형식으로 변환시켜줌(EX. string "7" -> number 7)
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true, // DTO에 없는 속성은 무조건 거름.
      // forbidNonWhitelisted: true, // whitelist에 없는 값는 거름.
      // transform: true, // 들어오는 데이터는 JS 일반 객체임. 객체를 자동으로 DTO 변환
      // disableErrorMessages: true, // err message 표시
    }),
  );

  await app.listen(3000);
}
bootstrap();
