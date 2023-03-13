import { Module } from '@nestjs/common';
import { UsersModule } from '@src/users/users.module';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

import { JwtModule } from '@nestjs/jwt';
import { IAppEnv, IJWTEnv } from '@config/index';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule, PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const appConfig = configService.get<IAppEnv>('app')!;
        const jwtConfig = configService.get<IJWTEnv>('jwt')!;
        const accessConfig = jwtConfig.accessToken;

        return {
          secretOrPrivateKey: accessConfig.secretOrPrivateKey,
          signOptions: {
            algorithm: accessConfig.signOptions.algorithm as any,
            expiresIn: accessConfig.signOptions.expiresIn,
            issuer: appConfig.host,
            encoding: 'utf8',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AuthController,
  ],
  providers: [
    AuthService, LocalStrategy, JwtStrategy, ConfigService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
