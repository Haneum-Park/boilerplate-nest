import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAppEnv } from '@config/index';

@Injectable()
export class AppService {
  private appConfig: IAppEnv;
  constructor(private configService: ConfigService) {
    this.appConfig = this.configService.get<IAppEnv>('app')!;
  }
  getVersion(): string {
    return this.appConfig.version;
  }
  testError(): void {
    throw new Error('TEST ERROR');
  }
}
