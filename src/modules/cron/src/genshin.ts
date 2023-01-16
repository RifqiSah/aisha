import moment, { Moment } from 'moment';
import cron from 'node-cron';

import { sendGeneralWithAttachment } from '../../../helpers/discord';
import { getWebhookUrls, delay, getContentFromHtmlString, trimString } from '../../../helpers/function';
import axios from '../lib/axios';

let _client: any = null;

const getCategoryEn = (ids: string[]) => {
    return ids.map((id) => {
        if (id === '11') return 'Info';
        if (id === '13') return 'Event';
        return null;
    }).filter((x) => x)?.[0];
};

const getCategoryId = (ids: string[]) => {
    return ids.map((id) => {
        if (id === '396') return 'Buletin';
        if (id === '397') return 'Pengumuman';
        if (id === '398') return 'Event';
        return 'N/A';
    }).filter((x) => x)?.[0];
};

const getData = async () => {
    _client.logger.debug('[GENSHIN_NEWS] Genshin Impact News ticked!');
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

        const buffer = await axios.get('https://content-static-sea.hoyoverse.com/content/yuanshen/getContentList?pageSize=15&pageNum=1&channelId=266');
        const data = buffer?.data;

        const newsList = data?.data?.list;
        newsList.map((news: any) => {
            id.push(Number(news?.contentId));
            title.push(news?.title);
            category.push(getCategoryId(news?.channelId));
            intro.push(news?.intro);
            banner.push(news?.ext?.[1].value[0]?.url);
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
                // const message = `__**[${category[i]}] ${title[i]}:**__\n\n${intro[i]}\n\nStart Time: **${startTime[i].format('YYYY-MM-DD HH:mm')} GMT+8**\nDetails: <https://genshin.hoyoverse.com/id/news/detail/${id[i]}>\n\n${banner[i]}`;
                // await sendGeneral(await getWebhookUrls('webhook.genshin.news'), message);

                const message = `__**[${category[i]}] ${title[i]}:**__\n\n${intro[i]}\n\nSelengkapnya: <https://genshin.hoyoverse.com/id/news/detail/${id[i]}>\n\nPratinjau:`;
                await sendGeneralWithAttachment(await getWebhookUrls('webhook.genshin.news'), message, banner[i]);
                // console.log(message, banner[i]);

                await delay(5000);
            }

            await news.update({
                news: id[0],
                other: moment(startTime[0]).format('YYYY-MM-DD HH:mm:ss'),
            });
        }

    } catch (err: any) {
        _client.logger.debug('[GENSHIN_NEWS] An error occured genshinimpact!', err);
    }

    _client.logger.debug('[GENSHIN_NEWS] Genshin Impact News success!');
};

const getDataV2 = async () => {
    _client.logger.debug('[GENSHIN_NEWS_v2] Genshin Impact News ticked!');
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
        const endTime: Moment[] = [];

        const buffer = await axios.get('https://api-os-takumi-static.hoyoverse.com/content_v2_user/app/a1b1f9d3315447cc/getContentList?iAppId=32&iChanId=395&iPageSize=20&iPage=1&sLangKey=id-id');
        const data = buffer?.data;

        const newsList = data?.data?.list;
        newsList.map((news: any) => {
            id.push(Number(news?.iInfoId));
            category.push(getCategoryId(news?.sChanId));
            title.push(news?.sTitle);
            // intro.push(news?.sIntro);
            intro.push(getContentFromHtmlString(news?.sContent));

            const bannerObj = JSON.parse(news?.sExt || {});
            banner.push(bannerObj?.banner[0]?.url);

            startTime.push(moment(news?.dtStartTime));
            endTime.push(moment(news?.dtEndTime));
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
                // const message = `__**[${category[i]}] ${title[i]}:**__\n\n${intro[i]}\n\nStart Time: **${startTime[i].format('YYYY-MM-DD HH:mm')} GMT+8**\nDetails: <https://genshin.hoyoverse.com/id/news/detail/${id[i]}>\n\n${banner[i]}`;
                // await sendGeneral(await getWebhookUrls('webhook.genshin.news'), message);

                const message = `__**[${category[i]}] ${title[i]}:**__\n\n${intro[i]}\n\nSelengkapnya: <https://genshin.hoyoverse.com/id/news/detail/${id[i]}>\n\nPratinjau:`;
                await sendGeneralWithAttachment(await getWebhookUrls('webhook.genshin.news'), message, banner[i]);
                // console.log(message, banner[i]);

                await delay(5000);
            }

            await news.update({
                news: id[0],
                other: moment(startTime[0]).format('YYYY-MM-DD HH:mm:ss'),
            });
        }

    } catch (err: any) {
        _client.logger.debug('[GENSHIN_NEWS_v2] An error occured genshinimpact!', err);
    }

    _client.logger.debug('[GENSHIN_NEWS_v2] Genshin Impact News success!');
};

exports.init = (client: any) => {
    _client = client;
};

export const handle = cron.schedule('* * * * *', () => {
    // getData();
    getDataV2();
});