import appRoot from 'app-root-path';
import winston, { format } from 'winston';
import config from './main';

const { combine, timestamp, prettyPrint } = format;

const logger = winston.createLogger({
  level: config.logWinston,
  format: combine(timestamp(), prettyPrint()),
  handleExceptions: true,
  json: false,
  colorize: false,
  transports: [
    new winston.transports.File({
      filename: `${appRoot}/logs/error.log`,
      level: 'error',
    }),
    new winston.transports.File({
      filename: `${appRoot}/logs/info.log`,
      level: 'info',
    }),
    new winston.transports.File({
      filename: `${appRoot}/logs/debug.log`,
      level: 'debug',
    }),
    new winston.transports.Console(),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

export default logger;
