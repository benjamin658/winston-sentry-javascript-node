import { LogEntry } from 'winston';
import Transport, { TransportStreamOptions } from 'winston-transport';
import * as Sentry from '@sentry/node';

export interface Extra {
  extra?: {
    [key: string]: any;
  }
}

export interface Tag {
  tags?: {
    [key: string]: any;
  }
}

export interface UserInfo {
  user?: Sentry.User
}

export interface SentryOptions {
  sentry: Sentry.NodeOptions;
}

export type Log = LogEntry & Extra & Tag & UserInfo;

export class SentryTransport extends Transport {
  public constructor(opts: TransportStreamOptions & SentryOptions) {
    const { sentry, ...rest } = opts;
    super(rest);
    Sentry.init(sentry);
  }

  public log(info: Log, next: () => void): void {
    if (this.silent) {
      next();
      return;
    }

    if (typeof info.extra !== 'undefined') {
      this.setExtra(info.extra);
    }

    if (typeof info.tags !== 'undefined') {
      this.setTag(info.tags);
    }

    if (typeof info.user !== 'undefined') {
      this.setUserInfo(info.user);
    }

    this.setLevel(this.getLevel(info.level));

    if (info instanceof Error) {
      this.setExtra({
        stack: info.stack,
        message: info.message,
      });

      Sentry.captureException(info);
    } else if (info.exception && this.handleExceptions) {
      this.setExtra(info);
      Sentry.captureException(info.error);
    } else {
      Sentry.captureMessage(info.message);
    }

    next();
  }

  private setLevel(level: string) {
    Sentry.configureScope((scope) => {
      scope.setLevel(this.getLevel(level));
    })
  }

  private setExtra(extra: { [key: string]: any }): void {
    Sentry.configureScope((scope) => {
      Object.entries(extra).forEach((e) => {
        scope.setExtra(e[0], e[1]);
      })
    });
  }

  private setTag(tag: { [key: string]: any }): void {
    Sentry.configureScope((scope) => {
      Object.entries(tag).forEach((t) => {
        scope.setTag(t[0], t[1]);
      })
    });
  }

  private setUserInfo(user: Sentry.User): void {
    Sentry.configureScope((scope) => {
      scope.setUser(user);
    });
  }

  private getLevel(level: string): Sentry.Severity {
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