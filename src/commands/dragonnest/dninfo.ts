import funct from '../../lib/function';
const list = funct.formatData('dninfo');

module.exports = {
    name: 'dninfo',
    desc: `Melihat info hal-hal yang ada pada Dragon Nest. Info yang tersedia yaitu:\n\n\`\`\`${list}\`\`\``,
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

        const data = funct.getExternalData('dragonnest.dninfo', info);
        if (!data) {
            msg.push(`Info untuk \`${info}\` tidak ditemukan!`);

            const recom = funct.commandRecom('dninfo', info);
            if (recom) msg.push(`\nMungkin yang Anda maksud: \`${recom}\`?`);
        } else {
            msg.push(`__**Info untuk ${data.name}**__\n`);
            await funct.formatImageInMessage(msg, message, data);
        }

        msg.push(`\nGunakan \`${client.config.BOT_PREFIX}help info\` untuk melihat daftar info yang tersedia.\n`);
        funct.sendMessage(message, msg);
    },
};
