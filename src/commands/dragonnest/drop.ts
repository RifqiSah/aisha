import funct from '../../lib/function';
const list = funct.formatData('dndrop');

module.exports = {
    name: 'drop',
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

        const data = funct.getExternalData('dragonnest.dndrop', item);
        if (!data) {
            msg.push(`Drop rate untuk item \`${item}\` tidak ditemukan!`);

            const recom = funct.commandRecom('dndrop', item);
            if (recom) msg.push(`\nMungkin yang Anda maksud: \`${recom}\`?`);
        } else {
            msg.push(`__**Drop rate untuk ${data.name}**__\n`);
            await funct.formatImageInMessage(msg, message, data);
        }

        msg.push(`\nGunakan \`${client.config.BOT_PREFIX}help drop\` untuk melihat daftar drop yang tersedia.\n`);
        funct.sendMessage(message, msg);
    },
};
