import { registerAs } from '@nestjs/config';
import { PARSED_ENV } from './config.parser';

const logEnv= PARSED_ENV.log as Record<string, any>;

export interface ILogEnv {
  level: string;                  // TYPE : LOG LEVEL

  captureRequest: boolean;        // TYPE : CAPTURE REQUEST?
  captureResponse: boolean;       // TYPE : CAPTURE RESPONSE?

  cloudwatch: {                   // TYPE : CLOUDWATCH LOGGING
    enabled: boolean;             // TYPE : ENABLED?
    loggerName: string;           // TYPE : LOGGER NAME
    logGroupName: string;         // TYPE : LOG GROUP NAME
    logStreamName: string;        // TYPE : LOG STREAM NAME
    awsAccessKeyId: string;       // TYPE : AWS ACCESS KEY ID
    awsSecretKey: string;         // TYPE : AWS SECRET KEY
    log_level: string;            // TYPE : LOG LEVEL
  };
}

export default registerAs(
  'log', // TYPE : REGISTER AS THIS NAME
  (): ILogEnv => ({
  level: logEnv.level || 'info',

  captureResponse: logEnv.capture_response || false,
  captureRequest: logEnv.capture_request || false,

  cloudwatch: {
    enabled: logEnv.cloudwatch.enabled || false,
    loggerName: logEnv.cloudwatch.name || 'cloudwatcher',
    logGroupName: logEnv.cloudwatch.log_group || 'development',
    logStreamName: logEnv.cloudwatch.log_stream || '',
    awsAccessKeyId: logEnv.cloudwatch.access_key || '',
    awsSecretKey: logEnv.cloudwatch.secret_key || '',
    log_level: logEnv.cloudwatch.log_level || 'debug',
  }
  
}));

