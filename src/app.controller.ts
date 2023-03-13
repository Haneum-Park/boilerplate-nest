import {
  Controller, Get,
} from '@nestjs/common';
import { RetType, HttpStatus } from '@type/return.type';
import { AppService } from './app.service';
import { PublicEndpoint } from '@common/decorators/public.decorator';
// import { SkipThrottle } from '@nestjs/throttler';
// import { KError } from '@error/error.handler';

// @SkipThrottle(true)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @PublicEndpoint()
  @Get()
  getHello(): RetType<Record<string, string>> {
    // throw new KError('Error NAME', 400, 'error description', { more: 'info' });
    // throw new UnauthorizedException();

    return RetType.new<Record<string, string>>()
      .setData({ version: this.appService.getVersion() })
      .setHttpStatus(HttpStatus.ACCEPTED);
    
  }
}
