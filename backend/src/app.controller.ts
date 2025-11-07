import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { setAuthCookie } from './auth/cookie.util';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly config: ConfigService,
  ) {}

  @Get('csrf-token')
  csrf(
    @Req() req: Request & { csrfToken?: () => string },
    @Res() res: Response,
  ) {
    try {
      const token = req.csrfToken ? req.csrfToken() : '';
      res.json({ csrfToken: token });
    } catch (error) {
      res.json({ csrfToken: '' });
    }
  }
}
