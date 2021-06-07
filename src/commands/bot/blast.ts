module.exports = {
    name: 'blast',
    desc: 'Mengirim semua informasi dari Aisha ke server yg terdaftar.',
    enable: true,
    regex: false,
    help: false,
    public: false,
    role: ['372915947478056960'],
    aliases: [],
    usage: '[pesan anda]',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        const guilds = [];

        const sayMessage = args.join(' ');
        if (!sayMessage) {
            message.channel.send('Mohon masukkan pesan anda!');
            return;
        }

        message.delete().catch((err: any) => client.logger.error(err));

        message.client.guilds.cache.forEach(async (guild: any) => {
            const channelId = await client.configsvc.getConfig(guild.id, 'channel-news');
            const channel = guild.channels.cache.get(channelId.value);

            if (channel) {
                channel.send(`__**Informasi**__\n\n${sayMessage}`);
            } else {
                guilds.push(guild.name);
            }
        });
    },
};
