import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { LoginDto, SignUpDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) // 레포지토리를 서비스에 주입
    private userRepository: Repository<UserEntity>,
  ) {}
  async signUp(body: SignUpDto) {
    // console.log('hihi');
    const { email, password, confirm, nickname } = body;
    if (password !== confirm) {
      throw new BadRequestException(
        '확인 비밀번호가 입력 비밀번호와 일치하지 않습니다.',
      );
    }
    const isExistemail = await this.userRepository.findOne({
      where: { email: email },
    });
    if (isExistemail) {
      throw new NotFoundException(`이미 존재하는 이메일 입니다`);
    }

    const user = this.userRepository.create({ email, password, nickname });
    this.userRepository.save(user);
  }
  //   async login(body: LoginDto) {
  //     const { email, password } = body;
  //   }
}
