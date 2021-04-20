import func from '../../lib/function';
const list = func.formatData('dnhp');

module.exports = {
    name: 'hp',
    desc: `Informasi mengenai jumlah HP dari nest. Nest yang tersedia yaitu:\n\n\`\`\`${list}\`\`\``,
    enable: true,
    regex: false,
    help: true,
    public: true,
    role: [],
    aliases: [],
    usage: '[jenis nest]',
    cooldown: 0,
    func: (client: any, message: any, args: any) => {
        const nest = (args.length ? args.join(' ').toLowerCase() : 'null');
        const msg: string[]=[];

        const data = func.getExternalData('dragonnest.dnhp', nest);
        if (!data) {
            msg.push(`HP untuk \`${nest}\` tidak ditemukan!`);

            const recom = func.commandRecom('dnhp', nest);
            if (recom) msg.push(`\nMungkin yang Anda maksud: \`${recom}\`?`);
        } else {
            msg.push(`__**HP untuk ${data.name}**__\n`);
            data.data.map((id: string) => {
                msg.push(id);
                if (id.startsWith('http')) {
					msg.pop();
                    message.channel.send(msg, { split: true ,files: [id]});
                    msg.length = 0;
                }
            });
        }

        msg.push(`\nGunakan \`${client.config.BOT_PREFIX}help hp\` untuk melihat daftar info HP yang tersedia.\n`);
        message.channel.send(msg, { split: true });
    },
};
