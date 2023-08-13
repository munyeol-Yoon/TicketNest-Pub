import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDto, SignUpDto } from './dto/auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const authServiceMock = {
      signUp: jest.fn(),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /signup', () => {
    it('올바른 파라미터로 호출하였는가?', async () => {
      const signupDto = {
        email: 'test@test.com',
        nickname: 'test',
        password: 'Qwer123$',
        confirm: 'Qwer123$',
      };

      await controller.signUp(signupDto);

      expect(authService.signUp).toHaveBeenCalledWith(signupDto);
    });

    it('AuthService.signUp 의 결과를 반환 하는가?', async () => {
      const signupDto = {
        email: 'test@test.com',
        nickname: 'test',
        password: 'Qwer123$',
        confirm: 'Qwer123$',
      };

      jest
        .spyOn(authService, 'signUp')
        .mockResolvedValue({ message: '회원가입 성공' });

      const result = await controller.signUp(signupDto);

      expect(result).toEqual({ message: '회원가입 성공' });
    });
  });
  describe('POST /login', () => {
    // 로그인 테스트
    it('AuthService.login 의 결과를 json 형식으로 반환 하는가?', async () => {
      const loginDto: LoginDto = {
        email: 'test@test.com',
        password: 'Qwer123$',
      };

      jest
        .spyOn(authService, 'login')
        .mockResolvedValue({ accessToken: '20dfhGdfnsd.ndkfhasd.zxcnvkx' });
      const res: Response = { cookie: jest.fn(), json: jest.fn() } as any;
      await controller.login(loginDto, res);

      expect(res.json).toHaveBeenCalledWith({
        accessToken: '20dfhGdfnsd.ndkfhasd.zxcnvkx',
      });
    });
  });
});
