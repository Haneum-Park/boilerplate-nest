import * as yaml from 'js-yaml';
import fs from 'fs';
import { CONFIG_ENV_PATH } from '@constant/config.constant';

const PARSED_ENV: Record<string, any> = yaml.load(fs.readFileSync(CONFIG_ENV_PATH, 'utf-8')) as Record<string, any>;

export {
  PARSED_ENV,       // TYPE: 파싱된 Environment Value
}

