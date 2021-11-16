import funct from '../../lib/function';
const list = funct.formatData('bdm.bdmrate');

module.exports = {
    name: 'bdmrate',
    desc: `Melihat info rate enhance, dan chance apapun pada Black Desert Mobile. Rate yang tersedia yaitu:\n\n\`\`\`${list}\`\`\``,
    enable: true,
    regex: false,
    help: true,
    public: true,
    role: [],
    aliases: [],
    usage: '[jenis rate]',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        const rate = (args.length ? args.join(' ').toLowerCase() : 'null');
        const msg: string[] = [];

        const data = funct.getExternalData('bdm.bdmrate', rate);
        if (!data) {
            msg.push(`Rate untuk \`${rate}\` tidak ditemukan!`);

            const recom = funct.commandRecom('bdmrate', rate);
            if (recom) msg.push(`\nMungkin yang Anda maksud: \`${recom}\`?`);
        } else {
            msg.push(`__**Rate untuk ${data.name}**__\n`);
            await funct.formatImageInMessage(msg, message, data);
        }

        msg.push(`\nGunakan \`${client.config.BOT_PREFIX}help bdmrate\` untuk melihat daftar rate yang tersedia.\n`);
        funct.sendMessage(message, msg);
    },
};
