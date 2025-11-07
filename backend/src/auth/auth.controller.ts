import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import type { Response } from 'express';
import { setAuthCookie } from '../auth/cookie.util';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('signup')
  async signup(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.auth.signup(dto);
    setAuthCookie(res, { sub: user.id }, this.config);
    return user;
  }

  @Post('login')
  async login(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.auth.validateUser(dto);
    setAuthCookie(res, { sub: user.id }, this.config);
    return user;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'lax' });
    return { ok: true };
  }
}
