import moment, { Moment } from 'moment';
import cron from 'node-cron';

import { sendGeneralWithAttachment } from '../../../helpers/discord';
import { getWebhookUrls, delay } from '../../../helpers/function';
import axios from '../lib/axios';

let _client: any = null;

const getCategory = (ids: string[]) => {
    return ids.map((id) => {
        if (id === '11') return 'Info';
        if (id === '13') return 'Event';
        return null;
    }).filter((x) => x)?.[0];
};

const getData = async () => {
    _client.logger.debug('[CRON] Genshin Impact News ticked!');
    try {
        const news = await _client.gamenewssvc.findOne({
            name: 'genshin',
        });

        const id: any[] = [];
        const title: any[] = [];
        const category: any[] = [];
        const intro: any[] = [];
        const banner: any[] = [];
        const startTime: Moment[] = [];

        const buffer = await axios.get('https://content-static-sea.hoyoverse.com/content/yuanshen/getContentList?pageSize=10&pageNum=1&channelId=10');
        const data = buffer?.data;

        const newsList = data?.data?.list;
        newsList.map((news: any) => {
            id.push(Number(news?.contentId));
            title.push(news?.title);
            category.push(getCategory(news?.channelId));
            intro.push(news?.intro);
            banner.push(news?.ext?.[1].value[0].url);
            startTime.push(moment(news?.start_time));
        });

        let sameIndex = null;
        for (let i = 0; i < id.length; i++) {
            const newsDate = moment(news.other);
            if (newsDate.isSame(startTime[i]) && Number(news.news) === id[i]) {
                sameIndex = i;
            }
        }

        if (sameIndex) {
            for(let i = sameIndex - 1; i >= 0; i--) {
                // const message = `__**[${category[i]}] ${title[i]}:**__\n\n${intro[i]}\n\nStart Time: **${startTime[i].format('YYYY-MM-DD HH:mm')} GMT+8**\nDetails: <https://genshin.hoyoverse.com/en/news/detail/${id[i]}>\n\n${banner[i]}`;
                // await sendGeneral(await getWebhookUrls('webhook.genshin.news'), message);

                const message = `__**[${category[i]}] ${title[i]}:**__\n\n${intro[i]}\n\nDetails: <https://genshin.hoyoverse.com/en/news/detail/${id[i]}>\n\nPreview:`;
                await sendGeneralWithAttachment(await getWebhookUrls('webhook.genshin.news'), message, banner[i]);
                // console.log(message);

                await delay(5000);
            }

            await news.update({
                news: id[0],
                other: moment(startTime[0]).format('YYYY-MM-DD HH:mm:ss'),
            });
        }

    } catch (err: any) {
        _client.logger.debug('[CRON] An error occured genshinimpact!', err);
    }

    _client.logger.debug('[CRON] Genshin Impact News success!');
};

exports.init = (client: any) => {
    _client = client;
};

export const handle = cron.schedule('* * * * *', () => {
    getData();
});