import { getExternalData, commandRecom, formatImageInMessage, sendMessage, formatData } from '../../helpers/function';
const list = formatData('bdm.bdminfo');

module.exports = {
    name: 'bdminfo',
    desc: `Melihat info hal-hal yang ada pada Black Desert Mobile. Info yang tersedia yaitu:\n\n\`\`\`${list}\`\`\``,
    enable: true,
    regex: false,
    help: true,
    public: true,
    role: [],
    aliases: [],
    usage: '[jenis info]',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        const info = (args.length ? args.join(' ').toLowerCase() : 'null');
        const msg: string[] = [];

        const data = getExternalData('bdm.bdminfo', info);
        if (!data) {
            msg.push(`Info untuk \`${info}\` tidak ditemukan!`);

            const recom = commandRecom('bdminfo', info);
            if (recom) msg.push(`\nMungkin yang Anda maksud: \`${recom}\`?`);
        } else {
            msg.push(`__**Info untuk ${data.name}**__\n`);
            await formatImageInMessage(msg, message, data);
        }

        msg.push(`\nGunakan \`${client.config.BOT_PREFIX}help bdminfo\` untuk melihat daftar info yang tersedia.\n`);
        sendMessage(message, msg);
    },
};
