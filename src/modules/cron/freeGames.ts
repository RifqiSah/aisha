import moment from 'moment';
import cron from 'node-cron';

let _client: any = null;

import Parser from 'rss-parser';
const parser = new Parser();

const getData = async () => {
    _client.logger.debug('[CRON] FreeGames ticked!');
    try {
        const data: any[] = [];
        let latestData = await _client.globalsvc.getGlobals('news.freegames');
        latestData = moment(latestData.value);

        const feed = await parser.parseURL('https://steamcommunity.com/groups/freegamesfinders/rss/');
        for (let i = feed.items.length - 1; i >= 0; i--) {
            const item = feed.items[i];
            const itemDate = moment(item.pubDate);

            if (itemDate.isAfter(latestData)) {
                console.log(item.title);
                console.log(itemDate);

                if (i === 0) {
                    await _client.globalsvc.updateGlobals('news.freegames', item.pubDate);
                }
            }
        }
    } catch (err: any) {
        _client.logger.error('[CRON] An error occured!', err);
    }
};

exports.init = (client: any) => {
    _client = client;
};

export const handle = cron.schedule('* * * * *', () => {
    getData();
});