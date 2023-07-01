import * as cheerio from 'cheerio';
import cron from 'node-cron';

import { sendGeneral } from '../../../helpers/discord';
import { getWebhookUrls, delay } from '../../../helpers/function';
import axios from '../lib/axios';

let _client: any = null;

const getData = async () => {
    _client.logger.debug('[DN_KR_NEWS] Dragon Nest KR News ticked!');
    try {
        const number: any[] = [];
        const cover: any[] = [];
        const title: any[] = [];
        const updateDate: any[] = [];

        const buffer = await axios.post('https://patchnote.dragonnest.com/kr/Home/List', {
            page: 1,
        });
        const data = buffer?.data;

        const $ = cheerio.load(data);
        $('ul.over_li').each((i, val1) => {
            $(val1).find('li').each((j, val2) => {
                // patch number
                let patchNumber = $(val2).attr('onclick');
                patchNumber = patchNumber?.match(/\d+/g)?.[0];
                number.push(patchNumber);

                // patch image
                $(val2).find('img').each((k, val3) => {
                    const patchImage = $(val3).attr('src');
                    cover.push(`https:${patchImage}`);
                });

                // patch title & date
                $(val2).find('div.over_ban').each((k, val3) => {
                    const patchTitle = $(val3).find('p.over_ban_tit').text();
                    title.push(patchTitle);

                    const patchDate = $(val3).find('p.over_date').text();
                    updateDate.push(patchDate);
                });

            });
        });

        const news = await _client.gameserversvc.findOne({
            game: 'dn',
            shortName: 'ko',
        });

        if (Number(number[0]) > Number(news.patchNote)) {
            const message = `Patchnote baru telah ditemukan! Dengan:\n\n\`\`\`ID: ${number[0]}\nNama Patch: ${title[0]}\nCover: https:${cover[0]}\`\`\`\nBaca selengkapnya di https://patchnote.dragonnest.com/kr/${number[0]}`;
            await sendGeneral(await getWebhookUrls('webhook.dn.kr.patch'), message);
        }

        await news.update({
            patchNote : number[0],
        });

    } catch (err: any) {
        _client.logger.debug('[DN_KR_NEWS] An error occured dnkrnews!', err);
    }

    _client.logger.debug('[DN_KR_NEWS] Dragon Nest KR News success!');
};

exports.init = (client: any) => {
    _client = client;
};

export const handle = cron.schedule('0 * * * *', () => {
    getData();
});