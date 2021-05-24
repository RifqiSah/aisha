module.exports = {
    name: 'botinfo',
    desc: 'Mendapatkan informasi dari Aisha.',
    enable: true,
    regex: false,
    help: true,
    public: true,
    role: [],
    aliases: [],
    usage: '',
    cooldown: 0,
    func: (client: any, message: any, args: any) => {
        const data = [];

        data.push('Halo, ini beberapa informasi dari Aisha:\n');
        data.push(`\`Serving\`: ${message.guild.name} Server`);
        data.push('`Host`: Virtual Private Server');
        // data.push(`\`Bot Owner\`: <@${client.config.BOT_OWNER}>`);
        data.push('`Bot Owner`: `RifqiSah#6743`');
        data.push('\nSemoga harimu menyenangkan 😃. Terima kasih ~');

        message.channel.send(data, { split: true });
    },
};
