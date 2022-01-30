import axios from 'axios';
import cron from 'node-cron';

import discord from '../../lib/discord';
import func from '../../lib/function';

let _client: any = null;

const getData = async () => {
    _client.logger.debug('[CRON] Dragon Nest Version Tracker ticked!');
    try {
        const DN_Version: any[] = [];
        const DB_Version: any[] = [];

        // get version
        const buffer = await axios.get('https://arcsat.divinitor.com/svc/rs/regions');
        const data = buffer?.data;

        for (let i = 0; i < data.length; i++) {
            DN_Version.push({
                id: data[i].id,
                shortName: data[i]?.shortName,
                version: data[i]?.version,
                longName: data[i]?.displayNames?.default,
            });
        }

        // sort
        DN_Version.sort((a, b) => a.id - b.id);

        // get saved version
        const dbdata = await _client.gameserversvc.findAll({
            where: {
                game: 'dn',
            },
            order: [['id', 'ASC']]
        });

        for (let i = 0; i < dbdata.length; i++) {
            DB_Version.push({
                shortName: dbdata[i]?.shortName,
                version: dbdata[i]?.version,
            });
        }

        // compare!
        for (let i = 0; i < DN_Version.length; i++) {
            const oldver = DB_Version[i].version;
            const newver = DN_Version[i].version;

            if ((Number(oldver) < Number(newver)) && (DB_Version[i].shortName === DN_Version[i].shortName)) {
                await discord.sendTracker(await func.getWebhookUrls('webhook.dn.sea.patch'), DN_Version[i].longName, oldver, newver);

                await _client.gameserversvc.update({
                    game: 'dn',
                    shortName: DN_Version[i].shortName,
                }, {
                    version: newver,
                });
            }

            await _client.func.delay(5000);
        }
    } catch (err: any) {
        _client.logger.error('[CRON] An error occured!', err);
    }

    _client.logger.debug('[CRON] Dragon Nest Version Tracker success!');
};

exports.init = (client: any) => {
    _client = client;
};

export const handle = cron.schedule('* * * * *', () => {
    getData();
});