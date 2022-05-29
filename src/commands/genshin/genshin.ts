import { MessageEmbed } from 'discord.js';

import { sendMessage } from '../../helpers/function';
import { search, recom, getCurrentDay } from '../../helpers/genshin/genshin';

module.exports = {
    name: 'genshin',
    desc: 'Cari hal terkait Genshin Impact. Biarkan kata kunci kosong untuk menunjukkan item apa yang dapat dicari hari ini.',
    enable: true,
    regex: false,
    help: true,
    public: true,
    role: [],
    aliases: [],
    usage: '[keyword]',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        const keyword = (args.length ? args.join(' ').toLowerCase() : null);
        const msg: string[] = [];

        // jika tanpa keyword?
        if (!keyword) {
            const today = getCurrentDay();
            if (today === 'minggu') {
                msg.push('Hari Minggu dapat farm semua item! 😀');
            } else {
                const embed = new MessageEmbed()
                    .setColor([254, 254, 254])
                    .setTitle(`Genshin Impact Items: ${today.charAt(0).toUpperCase()}${today.slice(1,)}`,)
                    .setImage(`https://paimon.moe/images/daily/${today}.png?12`);

                message.channel.send({ embeds: [embed] });
            }
        } else {
            const embed = await search(keyword);
            if (!embed) {
                msg.push(`Informasi untuk \`${keyword}\` tidak ditemukan!`);
            } else {
                const recomInfo = await recom(keyword);

                message.channel.send(`__**Informasi untuk ${recomInfo[0]?.item?.name}**__\n`);
                message.channel.send({ embeds: [embed] });
            }
        }

        msg.push(`\nGunakan \`${client.config.BOT_PREFIX}help genshin\` untuk melihat daftar hal yang tersedia.\n`);
        sendMessage(message, msg);
    },
};
