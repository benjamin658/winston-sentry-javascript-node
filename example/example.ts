import winston from 'winston';

import { SentryTransport } from '../src/index';

const logger = winston.createLogger({
  transports: [
    new SentryTransport({
      sentry: {
        dsn: process.env.SENTRY_DSN,
      },
      level: 'error',
      handleExceptions: true,
    }),
  ],
});

logger.error(new Error('Something went wrong.'));
logger.error('Plain text error.');
logger.error('Plain text error.', {
  tags: {
    foo: 'bar',
  },
  user: {
    ip: '127.0.0.1',
    username: 'user1',
  },
  extra: {
    extra1: 'extra1',
    extra2: 'extra2',
  },
});
