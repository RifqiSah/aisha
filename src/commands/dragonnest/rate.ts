import func from '../../lib/function';
const list = func.formatData('dnrate');

module.exports = {
    name: 'rate',
    desc: `Melihat info rate enhance, dan chance apapun (kecuali drop) pada Dragon Nest. Rate yang tersedia yaitu:\n\n\`\`\`${list}\`\`\``,
    enable: true,
    regex: false,
    help: true,
    public: true,
    role: [],
    aliases: [],
    usage: '[jenis rate]',
    cooldown: 0,
    func: (client: any, message: any, args: any) => {
        const rate = (args.length ? args.join(' ').toLowerCase() : 'null');
        const msg: string[]=[];

        const data = func.getExternalData('dragonnest.dnrate', rate);
        if (!data) {
            msg.push(`Rate untuk \`${rate}\` tidak ditemukan!`);

            const recom = func.commandRecom('dnrate', rate);
            if (recom) msg.push(`\nMungkin yang Anda maksud: \`${recom}\`?`);
        } else {
            msg.push(`__**Rate untuk ${data.name}**__\n`);
            data.data.map((id: string) => {
                msg.push(id);
                if (id.startsWith('http')) {
                    message.channel.send(msg, { split: true });
                    msg.length = 0;
                }
            });
        }

        msg.push(`\nGunakan \`${client.config.BOT_PREFIX}help rate\` untuk melihat daftar rate yang tersedia.\n`);
        message.channel.send(msg, { split: true });
    },
};
