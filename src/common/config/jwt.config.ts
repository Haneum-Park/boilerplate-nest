import { registerAs } from '@nestjs/config';
import { PARSED_ENV } from './config.parser';

const jwtConfig = PARSED_ENV.jwt as Record<string, any>;
const accessConfig = jwtConfig.access_token as Record<string, any>;
const refreshConfig = jwtConfig.refresh_token as Record<string, any>;

export interface IJWTEnv {
  accessToken: IJWTOption;        // TYPE : ACCESS TOKEN
  refreshToken: IJWTOption;       // TYPE : REFRESH TOKEN
}

export interface IJWTOption {
  secretOrPrivateKey: string;     // TYPE : SECRET OR PRIVATE KEY
  signOptions: {                  // TYPE : SIGN OPTIONS
    algorithm: string;            // TYPE : ALGORITHM
    expiresIn: number;            // TYPE : EXPIRES IN
  };
}

export default registerAs(
  'jwt', // TYPE : REGISTER AS THIS NAME
  (): IJWTEnv=> ({
    accessToken: {
      secretOrPrivateKey: accessConfig.secret_or_private_key,
      signOptions: {
        algorithm: accessConfig.sign_option.algorithm,
        expiresIn: accessConfig.sign_option.expires_in,
      },
    },
    refreshToken: {
      secretOrPrivateKey: refreshConfig.secret_or_private_key,
      signOptions: {
        algorithm: refreshConfig.sign_option.algorithm,
        expiresIn: refreshConfig.sign_option.expires_in,
      },
    }
  }));


