module.exports = {
    name: 'leave',
    func: async (client: any, message: any, args: any) => {
        const guildId: string = args[1];

        if (!guildId) {
            return message.channel.send('Mohon masukkan Guild ID!').then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => {
                client.logger.error(err);
            });
        }

        client.bot.guilds.cache.get(guildId).leave().catch((err: any) => {
            return client.logger.error(err);
        });

        return message.channel.send(`Aisha telah keluar dari <${guildId}>!`).then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => {
            client.logger.error(err);
        });
    }
};