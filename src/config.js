import { getSiteURL } from './lib/get-site-url';
import { LogLevel } from './lib/logger';

export const config = {
  site: {
    name: 'SIMPLD',
    description: 'SIMPLD',
    themeColor: '#090a0b',
    url: getSiteURL(),
  },
  logLevel: process.env.REACT_APP_LOG_LEVEL || LogLevel.ALL,
};
