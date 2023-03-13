import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'PUBLIC_ENDPOINT';
export function PublicEndpoint() {
  return SetMetadata(IS_PUBLIC_KEY, true);
}
