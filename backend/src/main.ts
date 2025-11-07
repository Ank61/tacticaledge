import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import csurf from 'csurf';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { createLogger } from './util/logger';
import * as express from 'express';
import * as path from 'path';

async function main() {
  const logger = WinstonModule.createLogger(createLogger());
  const app = await NestFactory.create(AppModule, { logger });

  const configService = app.get(ConfigService);

  app.use(helmet());
  app.use(cookieParser());

  const frontendOrigin = configService.get<string>('FRONTEND_ORIGIN');
  app.enableCors({
    origin: frontendOrigin ? [frontendOrigin] : [],
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(
    '/uploads',
    express.static(path.join(process.cwd(), 'uploads'), {
      setHeaders: (res, path) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      },
    }),
  );
  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  const csrfProtection = csurf({
    cookie: {
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction
    },
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
  });

  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      if (req.path.startsWith('/api/auth/')) {
        return next();
      }
      return csrfProtection(req, res, next);
    },
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Movies API')
    .setDescription('API documentation for the Movies service')
    .setVersion('1.0')
    .addCookieAuth('jwt', { type: 'apiKey', in: 'cookie', name: 'jwt' })
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('PORT') ?? 4000;

  await app.listen(port);
}
main();
