/* eslint-disable function-call-argument-newline */
/* eslint-disable function-paren-newline */
import path, { resolve } from 'path';
import { createLogger, format, transports } from 'winston';
// import DiscordTransport from 'winston-discord-transport';
// import config from './config';

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

        // Loging to Discord
        // new DiscordTransport({
        //     webhook: `${config.BOT_WEBHOOK_LOG}`,
        //     defaultMeta: { Service: 'Aisha' },
        //     level: 'warn'
        // }),

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