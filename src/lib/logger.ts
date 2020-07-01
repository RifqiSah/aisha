/* eslint-disable function-call-argument-newline */
/* eslint-disable function-paren-newline */
import path, { resolve } from 'path';
import { createLogger, format, transports } from 'winston';

// Custom log formatting
const logFormat = format.printf((info) => `${info.timestamp} - ${info.level}: ${info.message}`);
export const logger = createLogger({
    level: 'info',
    format: format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    transports: [
        // Logging to console
        new transports.Console({
            format: format.combine(
                format.colorize(),
                logFormat
            )
        }),

        // Logging info and up to file
        new transports.File({ 
            filename: path.join(resolve(__dirname, '../../logs'), 'full.log'),
            level: 'info',
            format: logFormat,
            options: { flags: 'w' }
        }),

        // Logging only errors to file
        new transports.File({ 
            filename: path.join(resolve(__dirname, '../../logs'), 'error.log'),
            level: 'error',
            format: logFormat,
            options: { flags: 'w' }
        })
    ],
});