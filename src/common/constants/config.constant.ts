import path from 'path';

const CONFIG_BASE_PATH: string = path.join(__dirname, '..', 'config', 'env');
const CONFIG_ENV_PATH: string = path.join(CONFIG_BASE_PATH, process.env.NODE_ENV === 'production'
? '.prod.yaml' : '.dev.yaml');

export {
  CONFIG_BASE_PATH,
  CONFIG_ENV_PATH,
}

