import { registerAs } from '@nestjs/config';
import { PARSED_ENV } from './config.parser';

const appConfig = PARSED_ENV.app as Record<string, any>;

export interface IAppEnv {
  isProduction: boolean;          // TYPE : IS PRODUCTION?
  packageName: string;            // TYPE : PACKAGE NAME
  packageDescription: string;     // TYPE : PACKAGE DESCRIPTION
  host: string;                   // TYPE : HOST NAME
  hostUrl: string;                // TYPE : HOST URL
  corsOrigin: string | string[];  // TYPE : CORS ORIGIN URL OR ARRAY OF URLS
  port: number;                   // TYPE : PORT NUMBER
  https: boolean;                 // TYPE : HTTPS ENABLED?
  version: string;                // TYPE : APP VERSION
}

export default registerAs(
  'app', // TYPE : REGISTER AS THIS NAME
  (): IAppEnv => {
    const host: string = appConfig.host || 'localhost';
    const port: number = parseInt(appConfig.port || '3000', 10);
    const urlPrefix: string = appConfig.https || false ? 'https' : 'http';
    const urlSuffix: string = (port == 80 || port == 443) ? '' : `:${appConfig.port}`;
    const hostUrl: string = `${urlPrefix}://${host}${urlSuffix}/`;
    const version: string = `v${(process.env.VERSION || '0.0.0').replace('v', '')}`;
    const packageName: string = process.env.npm_package_name || 'ql.gl';
    const packageDescription: string = process.env.npm_package_description || 'https://ql.gl';

    return {
      packageName,
      packageDescription,
      isProduction: process.env.NODE_ENV === 'production',
      hostUrl,
      corsOrigin: appConfig.corsOrigin || hostUrl,
      port,
      https: appConfig.https || false,
      host,
      version,
    } as IAppEnv;
  }
);

