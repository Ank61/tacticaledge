import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

export function setAuthCookie(
  res: Response,
  payload: Record<string, any>,
  config: ConfigService,
) {
  const token = jwt.sign(payload, config.get<string>('JWT_SECRET')!, {
    expiresIn: '7d',
  });
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}
