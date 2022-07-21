import cron from 'node-cron';

import { sendTracker } from '../../../helpers/discord';
import { getWebhookUrls, delay, humanFileSize } from '../../../helpers/function';
import axios from '../lib/axios';

let _client: any = null;

const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');

const getPatchSize = async (name: string, from: number, to: number) => {
    let totalSize = 0;
    for (let i = from + 1; i <= to; i++) {
        let patchUrl;
        if (name === 'sea') {
            patchUrl = `http://patchsea.dragonnest.com/Game/DragonNest/Patch/${zeroPad(i, 8)}/Patch${zeroPad(i, 8)}.pak`;
        } else if (name === 'na') {
            patchUrl = `http://patchus.dragonnest.com/Game/DragonNest/patch/${zeroPad(i, 8)}/Patch${zeroPad(i, 8)}.pak`;
        } else if (name === 'ko') {
            patchUrl = `https://patchkr.dragonnest.com/Patch/${zeroPad(i, 8)}/Patch${zeroPad(i, 8)}.pak`;
        }

        if (!patchUrl) {
            break;
        }

        try {
            const buffer = await axios.head(patchUrl);
            totalSize += Number(buffer.headers['content-length']);
        } catch(err: any) {
            _client.logger.debug('[DN_TRACK] An error occured when getting file size!', err);
        }
    }

    return humanFileSize(totalSize, true);
};

const getData = async () => {
    _client.logger.debug('[DN_TRACK] Dragon Nest Version Tracker ticked!');
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
                const patchSize = await getPatchSize(DN_Version[i].shortName, oldver, newver);
                await sendTracker(await getWebhookUrls('webhook.dn.sea.patch'), DN_Version[i].longName, oldver, newver, patchSize);

                await _client.gameserversvc.update({
                    game: 'dn',
                    shortName: DN_Version[i].shortName,
                }, {
                    version: newver,
                });
            }

            await delay(5000);
        }
    } catch (err: any) {
        _client.logger.debug('[DN_TRACK] An error occured with dntrack!', err);
    }

    _client.logger.debug('[DN_TRACK] Dragon Nest Version Tracker success!');
};

exports.init = (client: any) => {
    _client = client;
};

export const handle = cron.schedule('* * * * *', () => {
    getData();
});