/* eslint-disable function-call-argument-newline */
/* eslint-disable function-paren-newline */
import path, { resolve } from 'path';
import { createLogger, format, transports } from 'winston';
import DiscordTransport from 'winston-discord-transport';

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

        // Loging to Discord
        new DiscordTransport({
            webhook: 'https://discordapp.com/api/webhooks/730631558108676176/qWvk95Z8uSHN5_l6AMh6ShK8IaIUao6AwvIJgzOW1g86ulvpgul54jG2uZHb3xvdXbWx',
            defaultMeta: { Service: 'Aisha' },
            level: 'warn'
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