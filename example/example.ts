import winston from 'winston';

import { SentryTransport } from '../src/index';

const logger = winston.createLogger({
  transports: [
    new SentryTransport({
      dsn: process.env.SENTRY_DSN,
      level: 'error',
      handleExceptions: true,
    })
  ]
})

logger.error('Plain text error.');
logger.error(new Error('Something went wrong.'));
logger.error('Plain text error.', {
  extra: {
    foo: 'bar',
  },
  tags: {
    foo: 'bar',
  },
  user: {
    ip: '127.0.0.1',
    username: 'user1',
  },
});