import { sendMessage } from '../../helpers/function';
import { search } from '../../helpers/genshin/genshin';

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
        const keyword = (args.length ? args.join(' ').toLowerCase() : 'null');
        const msg: string[] = [];

        const embed = await search(keyword);
        if (embed) message.channel.send({ embeds: [embed] });

        msg.push(`\nGunakan \`${client.config.BOT_PREFIX}help genshin\` untuk melihat daftar hal yang tersedia.\n`);
        sendMessage(message, msg);
    },
};
