import moment from 'moment';
import cron from 'node-cron';

let _client: any = null;

import Parser from 'rss-parser';
const parser = new Parser();

const freeGamesChannelId = '910538794799874108';

const getData = async () => {
    _client.logger.debug('[CRON] FreeGames ticked!');
    try {
        const data: any[] = [];
        let latestData = await _client.globalsvc.getGlobals('news.freegames');
        latestData = moment(latestData.value);

        const channel = _client.channels.cache.find((ch: any) => ch.id === freeGamesChannelId);
        if (!channel) {
            return;
        }

        const feed = await parser.parseURL('https://steamcommunity.com/groups/freegamesfinders/rss/');
        for (let i = feed.items.length - 1; i >= 0; i--) {
            const item = feed.items[i];
            const itemDate = moment(item.pubDate);

            if (itemDate.isAfter(latestData)) {
                // console.log(item.contentSnippet?.split('\n')[0]);

                const title = item?.title?.split('free from') || '';
                const gameTitle = title[0].trim();
                const freeFrom = title[1].trim();

                const desc = item?.content || '';
                const descriptionArr = item.contentSnippet?.split('\n');
                const gameDescription = descriptionArr?.[0];

                const claimIndex = descriptionArr?.findIndex((v) => v.match(/Offer good/));
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const claimBefore = item.contentSnippet?.split('\n')[claimIndex!].replace('- ', '').trim();

                const claimLink = /(https?:\/\/[^\s]+)"/.exec(desc)?.[0].replace('https://steamcommunity.com/linkfilter/?url=', '').slice(0, -1);

                // console.log(`__**[${freeFrom}] ${gameTitle}**__\n${gameDescription}\n\n${claimBefore}\n${claimLink}`);

                channel.send(`__**[${freeFrom}] ${gameTitle}**__\n${gameDescription}\n\n${claimBefore}\n${claimLink}`);

                if (i === 0) {
                    await _client.globalsvc.updateGlobals('news.freegames', item.pubDate);
                }
            }

            _client.func.delay(5000);
        }
    } catch (err: any) {
        _client.logger.error('[CRON] An error occured!', err);
    }

    _client.logger.debug('[CRON] FreeGames success!');
};

exports.init = (client: any) => {
    _client = client;
};

export const handle = cron.schedule('0 * * * *', () => {
    getData();
});