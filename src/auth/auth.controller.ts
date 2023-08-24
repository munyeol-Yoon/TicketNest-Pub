import {
  Body,
  Controller,
  Post,
  Get,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignUpDto } from './dto/auth.dto';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('/api/auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @ApiOperation({ summary: '유저 생성 API', description: '유저를 생성합니다.' })
  @Post('/signup')
  async signUp(@Body() body: SignUpDto) {
    return await this.authService.signUp(body);
  }

  @ApiOperation({
    summary: '유저 Login API',
    description: 'Login을 진행합니다.',
  })
  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const { accessToken } = await this.authService.login(body);
    res.cookie('Authorization', accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    return res.json({ accessToken });
  }
}
