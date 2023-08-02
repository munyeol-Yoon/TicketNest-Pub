import { Body, Controller, Post, Get, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignUpDto } from './dto/auth.dto';
import { Response } from 'express';
@Controller('/api/auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() body: SignUpDto) {
    return await this.authService.signUp(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const { token } = await this.authService.login(body);
    res.cookie('Authorization', token);
    res.json({ token });
  }
}
