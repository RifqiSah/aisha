import funct from '../../lib/function';
const list = funct.formatData('dragonnest.dnguide');

module.exports = {
    name: 'dnguide',
    desc: `Melihat guide dari Dragon Nest. Guide yang tersedia yaitu:\n\n\`\`\`${list}\`\`\``,
    enable: true,
    regex: false,
    help: true,
    public: true,
    role: [],
    aliases: [],
    usage: '[jenis guide]',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        const guide = (args.length ? args.join(' ').toLowerCase() : 'null');
        const msg: string[] = [];

        const data = funct.getExternalData('dragonnest.dnguide', guide);
        if (!data) {
            msg.push(`Guide untuk \`${guide}\` tidak ditemukan!`);

            const recom = funct.commandRecom('dnguide', guide);
            if (recom) msg.push(`\nMungkin yang Anda maksud: \`${recom}\`?`);
        } else {
            msg.push(`__**Guide untuk ${data.name}**__\n`);
            await funct.formatImageInMessage(msg, message, data);
        }

        msg.push(`\nGunakan \`${client.config.BOT_PREFIX}help dnguide\` untuk melihat daftar guide yang tersedia.\n`);
        funct.sendMessage(message, msg);
    },
};
