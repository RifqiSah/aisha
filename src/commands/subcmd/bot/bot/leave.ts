module.exports = {
    name: 'leave',
    func: async (client: any, message: any, args: any) => {
        args.shift();

        const guildIds: string[] = args;
        let counts = 0;

        if (!guildIds.length) {
            return message.channel.send('Mohon masukkan minimal 1 Guild ID!').then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => {
                client.logger.error(err);
            });
        }

        guildIds.forEach((id: string) => {
            const guildObj = client.bot.guilds.cache.get(id);
            if (guildObj) {
                guildObj.leave().catch((err: any) => {
                    return client.logger.error(err);
                });

                counts++;
            }
        });

        return message.channel.send(`Aisha telah keluar dari ${counts} - ${guildIds.length} guild!`).then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => {
            client.logger.error(err);
        });
    }
};