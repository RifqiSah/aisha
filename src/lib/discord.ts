/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { post } from 'superagent';
import { logger } from '../lib/logger';

export default class Database {
    static async sendGeneral(urls: any, data: any) {
        try {
            await Promise.all(urls.map(async (url: string) => {
                await post(url).set('Content-Type', 'application/json').send({
                    content: data,
                });
            }));
        } catch (err: any) {
            logger.error(`An error occured! ${err}`);
        }
    }

    static async sendTracker(urls: any, name: string, oldver: number, newver: number) {
        try {
            const body = JSON.stringify({
                username: 'Aisha',
                avatar_url: 'https://cdn.rifqisah.com/aisha/aisha-logo.jpg',
                embeds: [
                    {
                        title: 'Dragon Nest',
                        description: `**${name}** telah update dari ${oldver} ke ${newver}`,
                        color: 4295156,
                        timestamp: new Date(),
                    }
                ],
            });

            await Promise.all(urls.map(async (url: string) => {
                await post(url).set('Content-Type', 'application/json').set('Content-Length', body.length.toString()).send(body);
            }));
        } catch (err: any) {
            logger.error(`An error occured! ${err}`);
        }
    }

    static async sendServer(urls: any, name: string, status: boolean) {
        try {
            const body = JSON.stringify({
                username: 'Berlin',
                avatar_url: 'https://cdn.rifqisah.com/aisha/berlin.jpg',
                embeds: [
                    {
                        title: 'Dragon Nest',
                        description: `Server **${name}** sedang ${(status ? '**Online**' : '**Maintenance**')}`,
                        color: status ? 4387938 : 16011073,
                        timestamp: new Date(),
                    }
                ],
            });

            await Promise.all(urls.map(async (url: string) => {
                await post(url).set('Content-Type', 'application/json').set('Content-Length', body.length.toString()).send(body);
            }));
        } catch (err: any) {
            logger.error(`An error occured! ${err}`);
        }
    }
}