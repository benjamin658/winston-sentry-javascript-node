import { LogEntry } from 'winston';
import Transport, { TransportStreamOptions } from 'winston-transport';
import * as Sentry from '@sentry/node';

export interface Tag {
  tags?: {
    [key: string]: any;
  };
}

export interface UserInfo {
  user?: Sentry.User;
}

export interface Extra {
  extra?: {
    [key: string]: any;
  };
}

export interface SentryOptions {
  sentry: Sentry.NodeOptions;
}

export type Log = LogEntry & Tag & UserInfo & Extra;

export type SentryTransportOption = TransportStreamOptions & SentryOptions;

export class SentryTransport extends Transport {
  public constructor(opts: SentryTransportOption) {
    const { sentry, ...rest } = opts;
    super(rest);
    Sentry.init(sentry);
  }

  public log(info: Log, next: () => void): void {
    setImmediate(() => {
      this.emit('logged', info);
    });

    if (this.silent) {
      next();
      return;
    }

    const {
      tags,
      user,
      extra,
      level,
      stack,
      message,
      error,
    } = info;

    Sentry.withScope((scope) => {
      scope.setLevel(SentryTransport.getLevel(level));

      if (typeof tags !== 'undefined') {
        scope.setTags(tags);
      }

      if (typeof user !== 'undefined') {
        scope.setUser(user);
      }

      if (typeof extra !== 'undefined') {
        scope.setExtras(extra);
      }

      if (info instanceof Error) {
        scope.setExtras({
          stack,
          message,
        });

        Sentry.captureException(info);
      } else if (info.exception && this.handleExceptions) {
        scope.setExtras({
          stack,
          message,
          process: info.process,
          os: info.os,
          trace: info.trace,
        });

        Sentry.captureException(error);
      } else {
        Sentry.captureMessage(message);
      }

      next();
    });
  }

  private static getLevel(level: string): Sentry.Severity {
    switch (level) {
      case 'silly':
      case 'verbose':
      case 'debug':
        return Sentry.Severity.Debug;
      case 'log':
        return Sentry.Severity.Log;
      case 'info':
        return Sentry.Severity.Info;
      case 'warning':
        return Sentry.Severity.Warning;
      case 'error':
        return Sentry.Severity.Error;
      case 'fatal':
        return Sentry.Severity.Fatal;
      default:
        return Sentry.Severity.Error;
    }
  }
}
