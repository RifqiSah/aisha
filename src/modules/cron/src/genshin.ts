import moment, { Moment } from 'moment';
import cron from 'node-cron';

import { sendGeneral, sendGeneralWithAttachment } from '../../../helpers/discord';
import { getWebhookUrls, delay, getContentFromHtmlString, humanFileSize } from '../../../helpers/function';
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

const getPatchSize = async (patchUrl: string) => {
    let totalSize = 0;
    try {
        const buffer = await axios.head(patchUrl);
        totalSize += Number(buffer.headers['content-length']);
    } catch(err: any) {
        _client.logger.debug('[GENSHIN_PATCH] An error occured when getting file size!', err);
        return humanFileSize(0);
    }

    return humanFileSize(totalSize);
};

const getLangObj = (arr: any, val: any) => {
    const index = arr.findIndex((x: any) => x.language === val);
    return arr[index];
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
        _client.logger.debug('[GENSHIN_NEWS] An error occured Genshin Impact!', err);
    }

    _client.logger.debug('[GENSHIN_NEWS] Genshin Impact News success!');
};

const getPreDownload = async () => {
    _client.logger.debug('[GENSHIN_PATCH] Genshin Impact Patch ticked!');
    try {
        const server = await _client.gameserversvc.findOne({
            game: 'genshin',
        });

        const buffer = await axios.get('https://sdk-os-static.mihoyo.com/hk4e_global/mdk/launcher/api/resource?channel_id=1&key=gcStgarh&launcher_id=10&sub_channel_id=0');
        const data = buffer?.data;

        const gameFiles = data?.data?.game?.diffs?.[0];

        // game_4.3.0_4.4.0_hdiff_7lGqkpy9saiZYfXS.zip
        const latestFileName = gameFiles?.name?.split('_');
        const latestGameVersion = Number(latestFileName[2].replaceAll('.', ''));

        if (latestGameVersion > Number(server.version)) {
            const engLanguage = getLangObj(gameFiles?.voice_packs, 'en-us');
            const jpLanguage = getLangObj(gameFiles?.voice_packs, 'ja-jp');
            const krLanguage = getLangObj(gameFiles?.voice_packs, 'ko-kr');
            const cnLanguage = getLangObj(gameFiles?.voice_packs, 'zh-cn');

            const gameFilesMessage = [
                'Dear Travelers,\n',
                'The pre-installation function is now available on both PC and mobile platforms. It\'s recommended that Travelers complete any Domains or other challenges they wish to finish first before beginning the pre-installation process.\n',
                'Travelers on PC can still play the game while pre-installing game resources. Pre-installation will take up a certain amount of your network\'s bandwidth, so it\'s best to make sure you have a good network connection before beginning pre-installation.\n',
                'After pre-installation is complete, Travelers can update the game and experience new version content faster.\n',
                '__**Manual Download**__\n',
                'Below is the manual download (without using launcher), after download move downloaded files to Genshin Impact Directory (Genshin Impact Game folder), and **DONT EXTRACT !**\n',
                `**Base Game | ${await getPatchSize(gameFiles?.path ?? 0)}**`,
                `<${gameFiles?.path}>\n`,
                `**English Audio | ${await getPatchSize(engLanguage?.path ?? 0)}**`,
                `<${engLanguage?.path}>\n`,
                `**Japanese Audio | ${await getPatchSize(engLanguage?.path ?? 0)}**`,
                `<${jpLanguage?.path}>\n`,
                `**Korean Audio | ${await getPatchSize(jpLanguage?.path ?? 0)}**`,
                `<${krLanguage?.path}>\n`,
                `**Chinese Audio | ${await getPatchSize(cnLanguage?.path ?? 0)}**`,
                `<${cnLanguage?.path}>`,
            ];

            const message = `__**[PATCH] Pre-Download version ${latestFileName[2]}:**__\n\n${gameFilesMessage.join('\n')}`;
            await sendGeneral(await getWebhookUrls('webhook.genshin.news'), message);

            await server.update({
                version: latestGameVersion,
            });
        } else {
            _client.logger.debug('[GENSHIN_PATCH] Genshin Impact version is up to date!');
        }

    } catch (err: any) {
        _client.logger.debug('[GENSHIN_PATCH] An error occured Genshin Impact!', err);
    }

    _client.logger.debug('[GENSHIN_PATCH] Genshin Impact Patch success!');
};

exports.init = (client: any) => {
    _client = client;
};

export const handle = cron.schedule('* * * * *', () => {
    getData();
    getPreDownload();
});