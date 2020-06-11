import func from '../../lib/function';
const list = func.formatData('dnhp');

module.exports = {
    name: 'hp',
    desc: `Informasi mengenai jumlah HP dari nest. HP yang tersedia yaitu:\n\n\`\`\`${list}\`\`\``,
    enable: true,
    regex: false,
    help: true,
    role: [],
    aliases: [],
    usage: '[jenis nest]',
    cooldown: 0,
    func: (client: any, message: any, args: any) => {
        const nest = (args.length ? args.join(' ').toLowerCase() : 'null');
        const msg = [];

        const data = func.getDNHpData(nest);
        if (!data) msg.push(`HP untuk \`${nest}\` tidak ditemukan!`);
        else {
            msg.push(`__**HP untuk ${data.name}**__\n`);
            data.data.map((id: string) => {
                msg.push(id);
            });
        }

        msg.push(`\nGunakan \`${client.config.PREFIX}help hp\` untuk melihat info yang tersedia.`);
        message.channel.send(msg, { split: true });
    },
};
