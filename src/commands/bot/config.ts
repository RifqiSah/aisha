module.exports = {
    name: 'config',
    desc: 'Pengaturan untuk Aisha.',
    enable: true,
    regex: false,
    help: false,
    public: true,
    role: ['admin'],
    aliases: [],
    usage: '[jenis] [value]',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        const chid = message.channel.id;
        const guildid = message.guild.id;

        if (args.length < 2) {
            return message.channel.send(`Masukkan tidak valid! Gunakan \`${client.config.BOT_PREFIX}help config\` untuk informasi lebih lanjut.`).then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => {
                client.logger.error(err);
            });
        }

        const cmd = args[0];
        const mentioned = args[1].startsWith('<') && args[1].endsWith('>') ? args[1].replace(/\D/g, '') : args[1];

        if (cmd === 'prefix') {
            await client.configsvc.addConfig(guildid, 'prefix', mentioned.toString(), 'BOT Prefix');
        } else if (cmd === 'master') {
            const name = message.guild.roles.cache.get(mentioned).name;
            await client.configsvc.addConfig(guildid, 'role-master', mentioned, name);
        } else if (cmd === 'organizer') {
            const name = message.guild.roles.cache.get(mentioned).name;
            await client.configsvc.addConfig(guildid, 'role-organizer', mentioned, name);
        } else if (cmd === 'bot-channel') {
            const name = client.bot.channels.cache.get(mentioned).name;
            await client.configsvc.addConfig(guildid, 'channel-bot', mentioned, name);
        } else if (cmd === 'news-channel') {
            const name = client.bot.channels.cache.get(mentioned).name;
            await client.configsvc.addConfig(guildid, 'channel-news', mentioned, name);
        } else {
            return message.channel.send(`Peraturan untuk \`${cmd}\` tidak ditemukan!`).then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => {
                client.logger.error(err);
            });
        }

        return message.channel.send('Berhasil disimpan!').then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => {
            client.logger.error(err);
        });
    },
};
