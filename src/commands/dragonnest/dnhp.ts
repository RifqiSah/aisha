import { getExternalData, commandRecom, formatImageInMessage, sendMessage, formatData } from '../../helpers/function';
const list = formatData('dragonnest.dnhp');

module.exports = {
    name: 'dnhp',
    desc: `Informasi mengenai jumlah HP dari nest. Nest yang tersedia yaitu:\n\n\`\`\`${list}\`\`\``,
    enable: true,
    regex: false,
    help: true,
    public: true,
    role: [],
    aliases: [],
    usage: '[jenis nest]',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        const nest = (args.length ? args.join(' ').toLowerCase() : 'null');
        const msg: string[] = [];

        const data = getExternalData('dragonnest.dnhp', nest);
        if (!data) {
            msg.push(`HP untuk \`${nest}\` tidak ditemukan!`);

            const recom = commandRecom('dnhp', nest);
            if (recom) msg.push(`\nMungkin yang Anda maksud: \`${recom}\`?`);
        } else {
            msg.push(`__**HP untuk ${data.name}**__\n`);
            await formatImageInMessage(msg, message, data);
        }

        msg.push(`\nGunakan \`${client.config.BOT_PREFIX}help dnhp\` untuk melihat daftar info HP yang tersedia.\n`);
        sendMessage(message, msg);
    },
};
