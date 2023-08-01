import { Body, Controller, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignUpDto } from './dto/auth.dto';

@Controller('/api/auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() body: SignUpDto) {
    return await this.authService.signUp(body);
  }

  //   @Post('login')
  //   async login(@Body() body: LoginDto) {
  //     return await this.authService.login(body);
  //   }
}
