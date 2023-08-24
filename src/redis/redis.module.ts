import { Global, Module } from '@nestjs/common';
import { redisProvider } from './redis.provider';

@Global()
@Module({
  // 비구조화 할당을 통해 객체의 속성을 해체하여 그 값을 개별 변수에 담을 수 있게 한다.
  providers: [...redisProvider],
  exports: [...redisProvider],
})
export class RedisModule {}
