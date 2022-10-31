import * as cheerio from 'cheerio';
import cron from 'node-cron';

import { sendGeneral } from '../../../helpers/discord';
import { getWebhookUrls, delay } from '../../../helpers/function';
import axios from '../lib/axios';

let _client: any = null;

const getData = async () => {
    _client.logger.debug('[DN_NA_NEWS] Dragon Nest NA News ticked!');
    try {
        const category: any[] = [];
        const title: any[] = [];
        const number: any[] = [];

        const buffer = await axios.get('https://us.dragonnest.com/news/dev-blog/all');
        const data = buffer?.data;

        const $ = cheerio.load(data);
        $('table.bbs_list').each((i, val1) => {
            $(val1).find('tr').each((j, val2) => {
                $(val2).find('td').each((k, val3) => {
                    if ($(val3).attr('class') === 'category') category.push($(val3).text());
                    if ($(val3).attr('class') === 'subject') title.push($(val3).text());
                    if ($(val3).attr('class') === 'num') number.push($(val3).text());
                });
            });
        });

        const news = await _client.gameserversvc.findOne({
            game: 'dn',
            shortName: 'na',
        });

        for(let i = category.length - 1; i >= 0; i--) {
            if (Number(number[i]) > Number(news.berita)) {
                if (title[i].toLowerCase().includes('update content')) {
                    const message = `<@&489292018628165633>\n\n__**[${category[i]}] ${title[i]}:**__\nhttps://us.dragonnest.com/news/dev-blog/all/${number[i]}`;
                    await sendGeneral(await getWebhookUrls('webhook.dn.sea.news'), message);
                }
            }
        }

        await news.update({
            berita: number[0],
        });

    } catch (err: any) {
        _client.logger.debug('[DN_NA_NEWS] An error occured with dnseanews!', err);
    }

    _client.logger.debug('[DN_NA_NEWS] Dragon Nest NA News success!');
};

exports.init = (client: any) => {
    _client = client;
};

export const handle = cron.schedule('*/5 * * * *', () => {
    getData();
});