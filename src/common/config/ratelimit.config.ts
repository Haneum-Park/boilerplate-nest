import { registerAs } from '@nestjs/config';
import { PARSED_ENV } from './config.parser';

const rateLimitEnv = PARSED_ENV['rate-limit'] as Record<string, any>;

export interface IRateLimitEnv {
  ttl: number;                    // TYPE : TIME TO LIVE
  limit: number;                  // TYPE : LIMIT
}


export default registerAs(
  'rate-limit', // TYPE : REGISTER AS THIS NAME
  (): IRateLimitEnv => ({
    ttl: rateLimitEnv.ttl || 10,
    limit: rateLimitEnv.limit || 100,
}));


