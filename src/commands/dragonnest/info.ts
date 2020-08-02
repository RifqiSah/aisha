import func from '../../lib/function';
const list = func.formatData('dninfo');

module.exports = {
    name: 'info',
    desc: `Melihat info hal-hal yang ada pada Dragon Nest. Info yang tersedia yaitu:\n\n\`\`\`${list}\`\`\``,
    enable: true,
    regex: false,
    help: true,
    role: ['489292018628165633'],
    aliases: [],
    usage: '[jenis info]',
    cooldown: 0,
    func: (client: any, message: any, args: any) => {
        const info = (args.length ? args.join(' ').toLowerCase() : 'null');
        const msg = [];

        const data = func.getExternalData('dragonnest.dninfo', info);
        if (!data) {
            msg.push(`Info untuk \`${info}\` tidak ditemukan!`);

            const recom = func.commandRecom('dninfo', info);
            if (recom) msg.push(`\nMungkin yang Anda maksud: \`${recom}\`?`);
        } else {
            msg.push(`__**Info untuk ${data.name}**__\n`);
            data.data.map((id: string) => {
                msg.push(id);
            });
        }

        msg.push(`\nGunakan \`${client.config.BOT_PREFIX}help info\` untuk melihat daftar info yang tersedia.\n`);
        message.channel.send(msg, { split: true });
    },
};
