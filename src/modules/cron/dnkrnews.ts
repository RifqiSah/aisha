import axios from 'axios';
import cron from 'node-cron';

import discord from '../../lib/discord';
import func from '../../lib/function';

let _client: any = null;

const getData = async () => {
    _client.logger.debug('[CRON] Dragon Nest KR News ticked!');
    try {
        const category: any[] = [];
        const title: any[] = [];
        const number: any[] = [];

        const buffer = await axios.post('https://patchnote.dragonnest.com/main/list?', {
            PageNo: 1,
            PageSize: 1,
        });
        const data = buffer?.data;

        const patchNumber = data?.PatchNoteList[0]?.PatchNoteNo;
        const patchName = data?.PatchNoteList[0]?.PatchNoteName;
        const patchCover = data?.PatchNoteList[0]?.CoverImage;
        const patchThumbnail = data?.PatchNoteList[0]?.ThumbnailImage;

        const news = await _client.gameserversvc.findOne({
            game: 'dn',
            shortName: 'ko',
        });

        if (Number(patchNumber) > Number(news.patchNote)) {
            const message = `Patchnote baru telah ditemukan! Dengan:\n\n\`\`\`ID: ${patchNumber}\nNama Patch: ${patchName}\nCover: https:${patchCover}\nThumbnail: https:${patchThumbnail}\`\`\`\nBaca selengkapnya di https://patchnote.dragonnest.com/Category?patchnoteno=${patchNumber}`;
            await discord.sendGeneral(await func.getWebhookUrls('webhook.dn.kr.patch'), message);
        }

        await news.update({
            patchNote : patchNumber,
        });

    } catch (err: any) {
        _client.logger.error('[CRON] An error occured!', err);
    }

    _client.logger.debug('[CRON] Dragon Nest KR News success!');
};

exports.init = (client: any) => {
    _client = client;
};

export const handle = cron.schedule('* * * * *', () => {
    getData();
});