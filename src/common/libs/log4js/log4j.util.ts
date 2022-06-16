import Path from 'path';
import * as Log4js from 'log4js';
import * as Util from 'util';
import dayjs from 'dayjs'; // 处理时间的工具
import * as StackTrace from 'stacktrace-js';
import Chalk from 'chalk';
import config from '../../../config/index';

const appLogDirConfig = config().app.logger.dir;

const baseLogPath = Path.normalize(
  Path.isAbsolute(appLogDirConfig) ? appLogDirConfig : Path.join(process.cwd(), appLogDirConfig)
);

// 日志级别
export enum LoggerLevel {
  ALL = 'ALL',
  MARK = 'MARK',
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
  OFF = 'OFF',
}

// 内容跟踪类
export class ContextTrace {
  constructor(
    public readonly context: string,
    public readonly path?: string,
    public readonly lineNumber?: number,
    public readonly columnNumber?: number
  ) {}
}

Log4js.addLayout('Its-Server', (logConfig: any) => {
  return (logEvent: Log4js.LoggingEvent): string => {
    let moduleName = '';
    let position = '';

    // 日志组装
    const messageList: string[] = [];
    logEvent.data.forEach((value: any) => {
      if (value instanceof ContextTrace) {
        moduleName = value.context;
        // 显示触发日志的坐标（行, 列）
        if (value.lineNumber && value.columnNumber) {
          position = `${value.lineNumber}, ${value.columnNumber}`;
        }
        return;
      }

      if (typeof value !== 'string') {
        value = Util.inspect(value, false, 3, true);
      }

      messageList.push(value);
    });

    // 日志组成部分
    const messageOutput: string = messageList.join(' ');
    const positionOutput: string = position ? ` [${position}]` : '';
    const typeOutput = `[${logConfig.type}] ${logEvent.pid.toString()} - `;
    const dateOutput = `${dayjs(logEvent.startTime).format('YYYY/MM/DD HH:mm:ss')}`;
    const moduleOutput: string = moduleName ? `[${moduleName}] ` : '[LoggerService] ';
    let levelOutput = `[${logEvent.level}] ${messageOutput}`;

    // 根据日志级别, 用不同颜色区分
    switch (logEvent.level.toString()) {
      case LoggerLevel.DEBUG:
        levelOutput = Chalk.green(levelOutput);
        break;
      case LoggerLevel.INFO:
        levelOutput = Chalk.cyan(levelOutput);
        break;
      case LoggerLevel.WARN:
        levelOutput = Chalk.yellow(levelOutput);
        break;
      case LoggerLevel.ERROR:
        levelOutput = Chalk.red(levelOutput);
        break;
      case LoggerLevel.FATAL:
        levelOutput = Chalk.hex('#DD4C35')(levelOutput);
        break;
      default:
        levelOutput = Chalk.grey(levelOutput);
        break;
    }

    return `${Chalk.green(typeOutput)}${dateOutput}  ${Chalk.yellow(
      moduleOutput
    )}${levelOutput}${positionOutput}`;
  };
});

// 注入配置
Log4js.configure({
  appenders: {
    console: {
      type: 'console',
      layout: { type: 'Its-Server' },
    },
    access: {
      type: 'dateFile',
      filename: `${baseLogPath}/access/access.log`,
      alwaysIncludePattern: true,
      pattern: 'yyyyMMdd',
      daysToKeep: 60,
      numBackups: 3,
      category: 'http',
      keepFileExt: true,
    },
    app: {
      type: 'dateFile',
      filename: `${baseLogPath}/app-out/app.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern: '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}',
      },
      // 日志文件按日期（天）切割
      pattern: 'yyyyMMdd',
      daysToKeep: 60,
      // maxLogSize: 10485760,
      numBackups: 3,
      keepFileExt: true,
    },
    errorFile: {
      type: 'dateFile',
      filename: `${baseLogPath}/errors/error.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern: '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}',
      },
      // 日志文件按日期（天）切割
      pattern: 'yyyyMMdd',
      daysToKeep: 60,
      // maxLogSize: 10485760,
      numBackups: 3,
      keepFileExt: true,
    },
    errors: {
      type: 'logLevelFilter',
      level: 'ERROR',
      appender: 'errorFile',
    },
  },
  categories: {
    default: {
      appenders: ['console', 'app', 'errors'],
      level: 'DEBUG',
    },
    info: { appenders: ['console', 'app', 'errors'], level: 'info' },
    access: { appenders: ['console', 'app', 'errors'], level: 'info' },
    http: { appenders: ['access'], level: 'DEBUG' },
  },
});

// 实例化
const logger = Log4js.getLogger();
logger.level = LoggerLevel.TRACE;

export class Logger {
  static trace(...args: any[]) {
    logger.trace(Logger.getStackTrace(), ...args);
  }

  static debug(...args: any[]) {
    logger.debug(Logger.getStackTrace(), ...args);
  }

  static log(...args: any[]) {
    logger.info(Logger.getStackTrace(), ...args);
  }

  static info(...args: any[]) {
    logger.info(Logger.getStackTrace(), ...args);
  }

  static warn(...args: any[]) {
    logger.warn(Logger.getStackTrace(), ...args);
  }

  static warning(...args: any[]) {
    logger.warn(Logger.getStackTrace(), ...args);
  }

  static error(...args: any[]) {
    logger.error(Logger.getStackTrace(), ...args);
  }

  static fatal(...args: any[]) {
    logger.fatal(Logger.getStackTrace(), ...args);
  }

  static access(...args: any[]) {
    const loggerCustom = Log4js.getLogger('http');
    loggerCustom.info(Logger.getStackTrace(), ...args);
  }

  // 日志追踪, 可以追溯到哪个文件、第几行第几列
  static getStackTrace(deep = 2): string {
    const stackList: StackTrace.StackFrame[] = StackTrace.getSync();
    const stackInfo: StackTrace.StackFrame = stackList[deep];

    const lineNumber: number | undefined = stackInfo.lineNumber;
    const columnNumber: number | undefined = stackInfo.columnNumber;
    const fileName: string | undefined = stackInfo.fileName;
    const basename: string | undefined = Path.basename(fileName || '');
    return `${basename}(line: ${lineNumber}, column: ${columnNumber}): \n`;
  }
}
