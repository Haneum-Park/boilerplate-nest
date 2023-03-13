import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ILogEnv } from '@config/index';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CaptureRequestMiddleware implements NestMiddleware {
  captureRequest: boolean = false;
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {
    const logConfig = this.configService.get<ILogEnv>('log')!;
    this.captureRequest = logConfig.captureRequest;
  }

  use(request: Request, _response: Response, next: NextFunction): void {
    if (this.captureRequest) {
      const { ip, method, path: url, headers, cookies, query } = request;
      request.on('close', () => {
        this.logger.debug(
          '\n======================= Request:  =======================\n'
          + `[${method}] FROM ${ip} ${url}\n`
          + `QUERY: ${JSON.stringify(query, null, 2)}\n`
          + `HEADERS: ${JSON.stringify(headers, null, 2)}\n`
          + `COOKIES: ${JSON.stringify(cookies, null, 2)}\n`
          + `BODY: ${JSON.stringify(request.body, null, 2)}\n`
          + '===================== End Request  ======================\n\n'
        );
      })
    }

    next();
  }
}
