/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { createWriteStream, unlinkSync } from 'fs';
import { get, post } from 'superagent';
import { getWebhookUrls, getFileExtensionFromUrl } from './function';
import { logger } from '../lib/logger';

export async function sendGeneral(urls: any, data: any) {
    const urlss = process.env.APP_ENV === 'local' ? await getWebhookUrls('webhook.testing') : urls;
    try {
        await Promise.all(urlss.map(async (url: string) => {
            await post(url).set('Content-Type', 'application/json').send({
                content: data,
            });
        }));
    } catch (err: any) {
        logger.error(`An error occured! ${err}`);
    }
}

export async function sendGeneralWithAttachment(urls: any, data: any, attachment: any) {
    const urlss = process.env.APP_ENV === 'local' ? await getWebhookUrls('webhook.testing') : urls;

    const filepath = `./${Math.random().toString(36).substring(2, 5)}.${getFileExtensionFromUrl(attachment)}`;
    const stream = createWriteStream(filepath);

    stream.on('finish', async () => {
        try {
            await Promise.all(urlss.map(async (url: string) => {
                await post(url).type('form').field('payload_json', JSON.stringify({ content: data })).attach('file1', filepath);
            }));
        } catch (err: any) {
            logger.error(`An error occured! ${err}`);
        }

        unlinkSync(filepath);
    });

    get(attachment)
        .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.99 Safari/537.36')
        .pipe(stream);
}

export async function sendTracker(urls: any, name: string, oldver: number, newver: number) {
    const urlss = process.env.APP_ENV === 'local' ? await getWebhookUrls('webhook.testing') : urls;
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

        await Promise.all(urlss.map(async (url: string) => {
            await post(url).set('Content-Type', 'application/json').set('Content-Length', body.length.toString()).send(body);
        }));
    } catch (err: any) {
        logger.error(`An error occured! ${err}`);
    }
}

export async function sendServer(urls: any, name: string, status: boolean) {
    const urlss = process.env.APP_ENV === 'local' ? await getWebhookUrls('webhook.testing') : urls;
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

        await Promise.all(urlss.map(async (url: string) => {
            await post(url).set('Content-Type', 'application/json').set('Content-Length', body.length.toString()).send(body);
        }));
    } catch (err: any) {
        logger.error(`An error occured! ${err}`);
    }
}