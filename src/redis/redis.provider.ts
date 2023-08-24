import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
const configService = new ConfigService();

export const redisProvider = [
  {
    // Redis를 Provide로 주입하기 위한 Token
    provide: 'REDIS_CLIENT',
    // useFactory 구문을 사용하여 동적으로 Provider를 만드는 작업
    // Provider는 인수를 받고 팩토리 함수에서 반환된 값으로 제공한다.
    useFactory: async () => {
      const redis = new Redis({
        // Redis Config 설정
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        password: configService.get<string>('REDIS_PASSWORD'),
      });
      // 연결 상태 확인용 PING-PONG
      const connect = await redis.ping();
      if (connect === 'PONG') console.log('REDIS Connect!');
      return redis;
    },
  },
];
