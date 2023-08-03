import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const userRepositoryMock = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const jwtServiceMock = {};
    const configServiceMock = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserEntity), // 실제 데이터베이스 리포지토리 대신 사용할 목 객체를 DI 시스템에 등록할 때 필요한 키 역할
          useValue: userRepositoryMock,
        },
        {
          provide: JwtService, // JwtService에 대한 의존성을 제공합니다.
          useValue: jwtServiceMock, // 위에서 정의한 목 객체를 사용합니다.
        },
        {
          provide: ConfigService, // ConfigService에 대한 의존성을 제공합니다.
          useValue: configServiceMock, // 위에서 정의한 목 객체를 사용합니다.
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // 회원가입 테스트 코드

  it('회원가입이 성공하는가?', async () => {
    const signUpDto = {
      email: 'test@test.com',
      nickname: 'test',
      password: 'Qwer123$',
      confirm: 'Qwer123$',
    };

    const result = await service.signUp(signUpDto);
    expect(result).toEqual({ message: '회원가입 성공' });
  });

  it('닉네임이 없을 때 BadRequestException 이 발생하는가?', async () => {
    const signUpDto = {
      email: 'test@test.com',
      password: 'Qwer123$',
      confirm: 'Qwer123$',
    };

    await expect(service.signUp(signUpDto as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('비밀번호가 다를 때 BadRequestException 이 발생하는가?', async () => {
    const signUpDto = {
      email: 'test@test.com',
      nickname: 'test',
      password: 'Qwer123$',
      confirm: 'Qwer123$$$',
    };

    await expect(service.signUp(signUpDto as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('이미 존재하는 이메일 일 때 ConflictException 이 발생하는가? ', async () => {
    const signUpDto = {
      email: 'test@test.com',
      nickname: 'test',
      password: 'Qwer123$',
      confirm: 'Qwer123$',
    };

    // jest.spyOn(userRepository, 'findOne').mockResolvedValue(new UserEntity());
    jest.spyOn(userRepository, 'findOne').mockResolvedValue({
      email: 'test@test.com',
      nickname: 'test12',
    } as UserEntity);

    await expect(service.signUp(signUpDto)).rejects.toThrow(ConflictException);
  });

  it('이미 존재하는 닉네임 일 때 ConflictException 이 발생하는가? ', async () => {
    const signUpDto = {
      email: 'test@test.com',
      nickname: 'test',
      password: 'Qwer123$',
      confirm: 'Qwer123$',
    };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue({
      email: 'test12@test.com',
      nickname: 'test',
    } as UserEntity);

    await expect(service.signUp(signUpDto)).rejects.toThrow(ConflictException);
  });
});
