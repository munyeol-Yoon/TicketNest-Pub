import { config } from 'dotenv';
import * as apm from 'elastic-apm-node';
config();
apm.start({
  serviceName: 'API_POST_TEST',
  serverUrl: process.env.APM_SERVER_URL,
  logLevel: 'off',
  logUncaughtExceptions: true,
  captureErrorLogStackTraces: 'always',
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './filters/exception.filter';

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
  app.enableCors({
    origin: true, // 들어오는 요청 허용
    credentials: true, // 자격 증명 포함. true 일 경우 Access-Control-Allow-Origin 헤더는 와일드 카드를 사용할 수 없음.
    // exposedHeaders: ['Authorization'], // CORS 요청 후 클라이언트 측에서 브라우저가 액세스할 수 있는 헤더
  });
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(8080);
}
bootstrap();
