import func from '../../lib/function';

module.exports = {
    name: 'dnpatch',
    desc: 'Untuk memudahakan dalam menulis patchnote.',
    enable: true,
    regex: false,
    help: false,
    public: false,
    role: ['433870492378595329'],
    aliases: ['pn'],
    usage: '[nomor]',
    cooldown: 0,
    func: (client: any, message: any, args: any) => {
        message.delete();

        const data = [];
        const channel = message.guild.channels.cache.find((ch: any) => ch.id === '381495270241730561'); // dn-sea
        if (!channel) {
            return;
        }

        const month = func.getMonthName();
        const newsNumber = args[0];

        data.push('<@&489292018628165633>\n');
        data.push(`__**[Patchnote] ${month} Patchnote**__`);
        data.push(`https://sea.dragonnest.com/news/notice/all/${newsNumber}`);

        func.sendMessageChannel(channel, data);
    },
};
