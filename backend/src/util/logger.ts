import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';

export function createLogger(): WinstonModuleOptions {
  const logsDir = path.join(process.cwd(), 'logs');
  return {
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike('Backend', {
            colors: true,
            prettyPrint: true,
          }),
        ),
      }),
      new winston.transports.File({
        dirname: logsDir,
        filename: 'app.log',
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    ],
  };
}
