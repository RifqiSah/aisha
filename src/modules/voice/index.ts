import { ChannelType } from 'discord.js';

import cron from 'node-cron';

let _client: any = null;

const getData = () => {
    _client.logger.debug('[VOICE] Check ticked!');

    const members: string [] = [];
    const voiceChannels = _client.bot.channels.cache.filter((ch: any) => ch.type === ChannelType.GuildVoice);

    voiceChannels.map((vc: any) => {
        vc?.members?.map((member: any) => {
            members.push(member);
            member.voice.disconnect('Disconnected by Aisha');
        });
    });

    _client.logger.debug(`[VOICE] Disconnected ${members.length} users!`);
};

module.exports = (client: any) => {
    client.logger.info('  [-] Initialize voice');
    _client = client;
    client.logger.info('  [V] Done!');
};

export const handle = cron.schedule('0 2 * * *', () => {
    getData();
});