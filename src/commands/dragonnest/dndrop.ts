import { getExternalData, commandRecom, formatImageInMessage, sendMessage, formatData } from '../../helpers/function';
const list = formatData('dragonnest.dndrop');

module.exports = {
    name: 'dndrop',
    desc: `Melihat info drop rate dari sebuah item pada Dragon Nest. Drop yang tersedia yaitu:\n\n\`\`\`${list}\`\`\``,
    enable: true,
    regex: false,
    help: true,
    public: true,
    role: [],
    aliases: [],
    usage: '[jenis item]',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        const item = (args.length ? args.join(' ').toLowerCase() : 'null');
        const msg: string[] = [];

        const data = getExternalData('dragonnest.dndrop', item);
        if (!data) {
            msg.push(`Drop rate untuk item \`${item}\` tidak ditemukan!`);

            const recom = commandRecom('dndrop', item);
            if (recom) msg.push(`\nMungkin yang Anda maksud: \`${recom}\`?`);
        } else {
            msg.push(`__**Drop rate untuk ${data.name}**__\n`);
            await formatImageInMessage(msg, message, data);
        }

        msg.push(`\nGunakan \`${client.config.BOT_PREFIX}help dndrop\` untuk melihat daftar drop yang tersedia.\n`);
        sendMessage(message, msg);
    },
};
