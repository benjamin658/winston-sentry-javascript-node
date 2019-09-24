# winston-sentry-javascript-node

[![winston](https://img.shields.io/badge/winston-3.x+-brightgreen.svg)][winston-url]

Sentry transport for the winson logger and uses the [@sentry/node](https://github.com/getsentry/sentry-javascript/tree/master/packages/node) SDK instead of the old Raven.

> This package is written in Typescript with the well typing and code quality.

## Installation

`npm install winston-sentry-javascript-node --save`

## Usage

```javascript
import { SentryTransport } from 'winston-sentry-javascript-node';

const logger = winston.createLogger({
  transports: [
    new SentryTransport({
      dsn: 'MY_SENTRY_DSN',
    }),
  ],
});

logger.error('Plain text error.');
logger.error(new Error('Something went wrong.'));
```

### Extra / Tags / User Example

Set user information, as well as tags and further extras.

```javascript
logger.error('Plain text error.', {
  extra: {
    foo: 'bar',
  },
  tags: {
    foo: 'bar'
  },
  user: {
    ip: '127.0.0.1',
    username: 'user1'
  }
});
```

### Handle Exception

Catch and send `uncaughtException` to the Sentry.  

```javascript
const logger = winston.createLogger({
  transports: [
    new SentryTransport({
      dsn: 'MY_SENTRY_DSN',
      handleExceptions: true,
    }),
  ],
});

// or

const logger = winston.createLogger({
  exceptionHandlers: [
    new SentryTransport({
      dsn: 'MY_SENTRY_DSN',
    }),
  ]
});
```

## Default Extra for Error Object

By default, if you provide an Error Object to logger, this package will set the following extra:

```javascript
{
  stack: err.stack,
  message: err.message
}
```

---

© Ben Hu (benjamin658), 2019-NOW

Released under the [MIT License](https://github.com/benjamin658/winston-sentry-javascript-node/blob/master/LICENSE)
