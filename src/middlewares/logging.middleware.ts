import { Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class LoggingMiddleware implements NestMiddleware {
  // nestjs에 내장되어 있는 Logger 클래스 사용
  private readonly logger = new Logger();

  // req, res, next 사용
  use(req: Request, res: Response, next: NextFunction) {
    // method, originalUrl을 request에 받아온다.
    const { method, originalUrl } = req;
    // ms 계산을 위해 startTime을 대입
    const startTime = Date.now();

    // 응답이 끝난 후 statusCode 반환 및 responseTime 계산
    res.on('finish', () => {
      // statusCode
      const { statusCode } = res;
      // responseTime을 계산하여 대입
      const responseTime = Date.now() - startTime;

      this.logger.log(
        `${statusCode} [${method}] ${originalUrl} - ${responseTime}ms`,
      );
    });

    next();
  }
}
