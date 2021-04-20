import func from '../../lib/function';
const list = func.formatData('dnguide');

module.exports = {
    name: 'guide',
    desc: `Melihat guide dari Dragon Nest. Guide yang tersedia yaitu:\n\n\`\`\`${list}\`\`\``,
    enable: true,
    regex: false,
    help: true,
    public: true,
    role: [],
    aliases: [],
    usage: '[jenis guide]',
    cooldown: 0,
    func: (client: any, message: any, args: any) => {
        const guide = (args.length ? args.join(' ').toLowerCase() : 'null');
        const msg: string[] = [];

        const data = func.getExternalData('dragonnest.dnguide', guide);
        if (!data) {
            msg.push(`Guide untuk \`${guide}\` tidak ditemukan!`);

            const recom = func.commandRecom('dnguide', guide);
            if (recom) msg.push(`\nMungkin yang Anda maksud: \`${recom}\`?`);
        } else {
            msg.push(`__**Guide untuk ${data.name}**__\n`);
            data.data.map((id: string) => {
                msg.push(id);
                if (/(https?:\/\/[^\s]+)/.test(id)) {
                    // msg.pop();
                    message.channel.send(msg, { split: true/*, files: [id]*/ });
                    msg.length = 0;
                }
            });
        }

        msg.push(`\nGunakan \`${client.config.BOT_PREFIX}help guide\` untuk melihat daftar guide yang tersedia.\n`);
        message.channel.send(msg, { split: true });
    },
};
