<!--
  Title: Winston Sentry
  Description: Sentry transport for the winston logger that using the official Sentry SDK for Javascript instead of the old Raven.
  Author: benjamin658
  -->

# winston-sentry-javascript-node

[![winston](https://img.shields.io/badge/winston-3.x+-brightgreen.svg)](https://github.com/winstonjs/winston#handling-uncaught-exceptions-with-winston)
[![npm version](https://badge.fury.io/js/winston-sentry-javascript-node.svg)](https://badge.fury.io/js/winston-sentry-javascript-node)
[![license](https://img.shields.io/github/license/benjamin658/winston-sentry-javascript-node)](https://github.com/benjamin658/winston-sentry-javascript-node/blob/master/License)

Sentry transport for the winson logger 3+ and uses the [@sentry/node](https://github.com/getsentry/sentry-javascript/tree/master/packages/node) SDK instead of the old Raven.

> This package is written in Typescript with the well typing and code quality.

## Installation

`npm install winston-sentry-javascript-node --save`

## Usage

```javascript
import { SentryTransport } from 'winston-sentry-javascript-node';

const logger = winston.createLogger({
  transports: [
    new SentryTransport({
      sentry:{
        dsn: 'MY_SENTRY_DSN',
      },
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
```

### Handle Exception

Catch and send `uncaughtException` to the Sentry.  

```javascript
const logger = winston.createLogger({
  transports: [
    new SentryTransport({
      sentry{
        dsn: 'MY_SENTRY_DSN',
      },
      handleExceptions: true,
    }),
  ],
});

// or

const logger = winston.createLogger({
  exceptionHandlers: [
    new SentryTransport({
      sentry: {
        dsn: 'MY_SENTRY_DSN',
      }
    }),
  ]
});
```

## Options

```javascript
new SentryTransport(opts)
```

* opts: TransportStreamOptions

```javascript
interface TransportStreamOptions {
  format?: logform.Format;
  level?: string;
  silent?: boolean;
  handleExceptions?: boolean;

  log?(info: any, next: () => void): any;
  logv?(info: any, next: () => void): any;
  close?(): void;
}
```

* opts.sentry: Please see [Sentry client options](https://docs.sentry.io/error-reporting/configuration/?platform=javascript).

## Default Extra for Error Object

By default, if you provide an Error Object to logger, this package will set the following extra:

```javascript
{
  stack: err.stack,
  message: err.message,
}
```

---

© Ben Hu (benjamin658), 2019-NOW

Released under the [MIT License](https://github.com/benjamin658/winston-sentry-javascript-node/blob/master/LICENSE)
