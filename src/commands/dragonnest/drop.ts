import func from '../../lib/function';
const list = func.formatData('dndrop');

module.exports = {
    name: 'drop',
    desc: `Melihat info drop rate dari sebuah item pada Dragon Nest. Item yang tersedia yaitu:\n\n\`\`\`${list}\`\`\``,
    enable: true,
    regex: false,
    help: true,
    role: [],
    aliases: [],
    usage: '[jenis item]',
    cooldown: 0,
    func: (client: any, message: any, args: any) => {
        const item = (args.length ? args.join(' ').toLowerCase() : 'null');
        const msg = [];

        const data = func.getDNDropData(item);
        if (!data) msg.push(`Drop rate untuk item \`${item}\` tidak ditemukan!`);
        else {
            msg.push(`__**Drop rate untuk ${data.name}**__\n`);
            data.data.map((id: String) => {
                msg.push(id);
            });
        }

        msg.push(`\nGunakan \`${client.config.PREFIX}help drop\` untuk melihat daftar item yang tersedia.`);
        message.channel.send(msg, { split: true });
    },
};
