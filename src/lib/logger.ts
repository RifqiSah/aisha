/* eslint-disable function-call-argument-newline */
/* eslint-disable function-paren-newline */

import path, { resolve } from 'path';
import { createLogger, format, transports } from 'winston';

/**
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
 */

// Custom log formatting
const logFormat = format.printf((info) => `${info.timestamp} - ${info.level}: ${info.message}`);
export const logger = createLogger({
    level: 'debug',
    format: format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    transports: [
        // Logging to console
        new transports.Console({
            level: process.env.APP_ENV === 'production' ? 'info' : 'debug',
            format: format.combine(
                format.colorize(),
                logFormat
            )
        }),

        // Logging info and up to file
        new transports.File({
            filename: path.join(resolve(__dirname, '../logs'), 'full.log'),
            level: 'info',
            format: logFormat,
            options: { flags: 'w' }
        }),

        // Logging only errors to file
        new transports.File({
            filename: path.join(resolve(__dirname, '../logs'), 'error.log'),
            level: 'error',
            format: logFormat,
            options: { flags: 'w' }
        }),

        // Logging for debug
        new transports.File({
            filename: path.join(resolve(__dirname, '../logs'), 'debug.log'),
            level: 'debug',
            format: logFormat,
            options: { flags: 'w' }
        }),
    ],
});