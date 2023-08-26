import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { config } from 'dotenv';
config();

// Jwt 토큰 검증 미들웨어
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Bearer Token을 코드 한 줄로 추출 가능

      jwtFromRequest: (req) => {
        // ExtractJwt.fromAuthHeaderAsBearerToken() 이 어떤 이유인지 아직 모르겠으나 토큰 추출을 못함.
        // let token = null;
        if (req.body.headers) {
          const [tokenType, token] = (
            req.body.headers['Authorization'] ?? ''
          ).split(' ');
          if (tokenType !== 'Bearer' || !token) {
            throw new UnauthorizedException('토큰이 유효하지 않습니다');
            // ? req.body.headers['Authorization'].split(' ')[1]
            // : null;
          }
          return token;
        }
      },
    });
  }
  // 위 super 에서 토큰 검증이 성공하면 아래의 validate 메서드가 실행됨
  async validate(payload) {
    const { userId } = payload;
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    return user.id;
  }
}
