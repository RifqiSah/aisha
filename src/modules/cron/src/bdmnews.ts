import * as cheerio from 'cheerio';
import moment from 'moment';
import cron from 'node-cron';

import { sendGeneral } from '../../../helpers/discord';
import { getWebhookUrls, delay } from '../../../helpers/function';
import axios from '../../api';

let _client: any = null;

const getData = async () => {
    _client.logger.debug('[CRON] Black Desert Global News ticked!');
    try {
        const news = await _client.gamenewssvc.findOne({
            name: 'bdom',
        });

        const category: any[] = [];
        const title: any[] = [];
        const number: any[] = [];
        const date: any[] = [];

        const buffer = await axios.get('https://www.world.blackdesertm.com/Ocean/News');
        const data = buffer?.data;

        const $ = cheerio.load(data);
        $('#listArea li a').each((i, val1) => {
            const anchor = $(val1).attr('href') || '';

            number.push(/\d+/.exec(anchor)?.[0]);

            $(val1).find('.desc').each((j, val2) => {
                category.push($(val2).find('.category').text());
                title.push($(val2).find('.title').text());

                date.push(moment($(val2).find('.info .date').text(), 'YYYY.MM.DD').format('YYYY-MM-DD'));
            });
        });

        let sameIndex = null;
        for (let i = 0; i < category.length; i++) {
            const newsDate = moment(news.other).format('YYYY-MM-DD');
            if (newsDate === date[i] && Number(news.news) === Number(number[i])) {
                sameIndex = i;
            }
        }

        if (sameIndex) {
            for(let i = sameIndex - 1; i >= 0; i--) {
                const message = `__**[${category[i]}] ${title[i]}:**__\nhttps://www.world.blackdesertm.com/Ocean/News/Detail?boardNo=${number[i]}`;
                await sendGeneral(await getWebhookUrls('webhook.bdm.gl.news'), message);

                await delay(5000);
            }

            await news.update({
                news: number[0],
                other: date[0],
            });
        }

    } catch (err: any) {
        _client.logger.debug('[CRON] An error occured bdmnews!', err);
    }

    _client.logger.debug('[CRON] Black Desert Global News success!');
};

exports.init = (client: any) => {
    _client = client;
};

export const handle = cron.schedule('*/5 * * * *', () => {
    getData();
});