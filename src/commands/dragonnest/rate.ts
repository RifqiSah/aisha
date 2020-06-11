import func from '../../lib/function';
const list = func.formatData('dnrate');

module.exports = {
    name: 'rate',
    desc: `Melihat info rate enhance, dan chance apapun (kecuali drop) pada Dragon Nest. Rate yang tersedia yaitu:\n\n\`\`\`${list}\`\`\``,
    enable: true,
    regex: false,
    help: true,
    role: [],
    aliases: [],
    usage: '[jenis rate]',
    cooldown: 0,
    func: (client: any, message: any, args: any) => {
        const rate = (args.length ? args.join(' ').toLowerCase() : 'null');
        const msg = [];

        const data = func.getDNRateData(rate);
        if (!data) msg.push(`Rate untuk \`${rate}\` tidak ditemukan!`);
        else {
            msg.push(`__**Rate untuk ${data.name}**__\n`);
            data.data.map((id: string) => {
                msg.push(id);
            });
        }

        msg.push(`\nGunakan \`${client.config.PREFIX}help rate\` untuk melihat rate yang tersedia.`);
        message.channel.send(msg, { split: true });
    },
};
