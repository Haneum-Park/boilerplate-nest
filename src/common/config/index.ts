import { IAppEnv, default as appConfig } from './app.config';
import { ILogEnv, default as logConfig } from './log.config';
import { IJWTEnv, IJWTOption, default as jwtConfig } from './jwt.config';
import { IRateLimitEnv, default as rateLimitConfig } from './ratelimit.config';

export interface IDefaultEnv {
  app: IAppEnv;                   // TYPE : APP
  log: ILogEnv;                   // TYPE : LOGGING
  jwt: IJWTEnv;                  // TYPE : JSON WEB TOKEN
  'rate-limit': IRateLimitEnv;      // TYPE : RATE LIMIT
}





export const configLoaders = [
  appConfig,
  logConfig,
  jwtConfig,
  rateLimitConfig,
];

export {
  IAppEnv,
  ILogEnv,
  IJWTEnv,
  IJWTOption,
  IRateLimitEnv,
}

export {
  appConfig,
  logConfig,
  jwtConfig,
  rateLimitConfig,
};
